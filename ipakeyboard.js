jQuery.fn.exists = function(){return this.length>0;}

function dig(blob, depth){
  depth = depth || 0;
  var deepest = 0;
  var item = blob != null && typeof blob == 'object' ? Object.keys(blob)[0]:null;
  console.log(item);
  return item !=null? (typeof blob[item] === 'object' ? dig(blob[item], depth + 1) : depth + 1): depth;
  if( typeof blob[item] === 'object' ) {
    return dig( blob[item], depth+1); // descend
  } else { // simple value, leaf
    return depth + 1;
  }
}
/*
* useVipak(boxSelector) or useVipak(boxselector, dict) or useVipak(dict)
* if kbtype is omitted, dict must have the following build: {num:{area[{set:{letter:description}}]}}
* 
*/
function useVipak(arg1, arg2){
  var d = null, k=null, b=null;
  if (arg2 != undefined){
    
    d = arg2;
    b = arg1;
    if(typeof arg1 == "string" && typeof arg2 == "string"){
      k = 2;
      d = new Object();
      for(var l in arg2){
	d[arg2[l]] = null;
      }
    }else{
      var i = dig(d);
      k = i>3?0:(i>1 ? 1:2);
    }
  }else if(typeof arg1 === 'object'){
    d = arg1;
    var i = dig(d);
    k = i>3?0:(i>1 ? 1:2);
    
  }else if(typeof arg1 === 'string' ){
    if($(arg1).exists()){
      b = arg1;
    }
    else{
      k = 2;
      d = new Object();
      for(var l in arg1){
	d[arg1[l]] = null;
      }
    }
  }
  var kb = new Keyboard();
  kb.driver(d,k,b);
}


jQuery.fn.center = function () {
  this.css("position","fixed");
  this.css("left", ( $(window).width() - this.width() ) / 2+$(window).scrollLeft() + "px");
  return this;
}
function Keyboard(){
  var kb = this, typeModeIcon, isVisible=false;
  var alpha, beta, charlie, delta, foxtrot, gamma, hotel=1, specialMode = false, prevMode = false, 
  _specialCode = {
    BACKSPACE: 8,
    COMMA: 188,
    DELETE: 46,
    DOWN: 40,
    END: 35,
    ENTER: 13,
    ESCAPE: 27,
    HOME: 36,
    LEFT: 37,
    NUMPAD_ADD: 107,
    NUMPAD_DECIMAL: 110,
    NUMPAD_DIVIDE: 111,
    NUMPAD_ENTER: 108,
    NUMPAD_MULTIPLY: 106,
    NUMPAD_SUBTRACT: 109,
    PAGE_DOWN: 34,
    PAGE_UP: 33,
    PERIOD: 190,
    RIGHT: 39,
    SPACE: 32,
    SHIFT: 16,
    TAB: 9,
    UP: 38
  };
  typeModeIcon = document.createElement('i');
  typeModeIcon.setAttribute('class', 'icon icon-leaf kbtyping');
  this.Left = [];
  this.Right = [];
  this.Center = [];
  this.position = [];
  this.parentId = null;
  this.focusBox = null;
  this.alphaSet = [];
  this.focusbox = null;

  this.driver = function(dict, kbtype, boxSelector){
    
    this.organize(dict, kbtype);
    document.body.appendChild(this.html);
    $(this.html).hide();
    this.setBoxListener(boxSelector);
    this.setButtonListeners();
    this.setHotKeys();
  };
  this.normalKeyboard = function(dict){
    
    this.driver();
  };
  this.smallKeyboard = function(dict){
    this.organize(dict, 0);
    this.driver();
  };
  this.organize = function(dict, kbtype){
    if(dict == null || dict == undefined)
    {
      dict = this.ipa_full;
      kbtype = 0;
    }
    if(kbtype == null){
      kbtype = 0;
    }
    var location, type, lset, lettr, sectn, lst, let, indx, title1, title2, posel, kgp, tmp, closeIcon, helpIcon, kbtoolbar;
    this.html = document.createElement('div');
    this.html.setAttribute('class', 'kbwpr');
    this.html.tabIndex = 1;
    kbtoolbar = document.createElement('div');
    kbtoolbar.setAttribute('class', 'kbtoolbar');
    kbtoolbar.innerHTML = 'VIPAK&nbsp;';
    closeIcon = document.createElement('i');
    closeIcon.setAttribute('class', 'kbclose');
    closeIcon.setAttribute('title', 'close VIPAK');
    closeIcon.innerHTML = '&times;';
    helpIcon = document.createElement('i');
    helpIcon.setAttribute('class', 'kbhelp');
    helpIcon.setAttribute('title', 'about VIPAK~\n Hotkeys - (focused in text box)\n  Activate: Ctrl+Shift\n  Deactivate: Esc');
    helpIcon.innerHTML = '?';
    kbtoolbar.appendChild(helpIcon);
    kbtoolbar.appendChild(closeIcon);
    this.html.appendChild(kbtoolbar);
    if(kbtype == 0){
      for(location in dict){
	posel = document.createElement('span');
	posel.setAttribute('id', 'kbpos'+location);
	
	for(type in dict[location]){
	  createKeySection(type);
	  for(indx in dict[location][type]){
	    for(lset in dict[location][type][indx]){
	      createLetterSet(dict[location][type][indx][lset]);
	    }
	    if(location=="0"){
	      this.Left.push(sectn);
	    }
	    if(location=="1"){
	      this.Right.push(sectn);
	    }
	    if(location=="2"){
	      this.Center.push(sectn);
	    }
	    posel.appendChild(sectn.elmnt);
	  }
	}
	this.html.appendChild(posel);
	this.position.push(posel);
      }
    }
    if(kbtype == 1){
      createKeySection();
      for(lset in dict){
	createLetterSet(dict[lset]);
      }
      this.html.appendChild(sectn.elmnt);
    }
    if(kbtype == 2){
      lset = "~";
      createKeySection();
      createLetterSet(dict);
      this.html.appendChild(sectn.elmnt);
    }
    function createKeySection(typ){
      sectn = new KeySection();
      sectn.title = typ;
      sectn.elmnt = document.createElement('div');
      sectn.elmnt.setAttribute('class', 'kbsection');
      if(typ != null){
	title1 = document.createElement('div');
	title1.setAttribute('class', 'label kbsectitle');
	title1.innerHTML = sectn.title;
	sectn.elmnt.appendChild(title1);
      }
    }
    function createLetterSet(dictref){
      lst = new LetterSet();
      lst.title = lset;
      lst.elmnt = document.createElement('span');
      lst.elmnt.setAttribute('class', 'kblset label');
      lst.elmnt.setAttribute('id', lst.title);
      title2 = document.createElement('span');
      title2.setAttribute('class', 'kblsetitle badge');
      title2.innerHTML = lst.title;
      lst.elmnt.appendChild(title2);
      kgp = document.createElement('span');
      kgp.setAttribute('class', 'kbtng btn-group');
      for(lettr in dictref){
	let = new Letter();
	let.letter = lettr;
	let.isScript = checkCharWidth(lettr);
	let.title = dictref[lettr] != undefined ? dictref[lettr]:'';
	let.elmnt = document.createElement('button');
	let.elmnt.setAttribute('class', 'kbletter btn');
	let.elmnt.setAttribute('id', 'kbl'+let.letter);
	let.elmnt.setAttribute('title', let.title);
	let.elmnt.setAttribute('letter', let.letter);
	let.elmnt.innerHTML = (let.isScript? '&nbsp;':'')+let.letter;
	lst.letterset.push(let);
	kgp.appendChild(let.elmnt);
      }
      lst.elmnt.appendChild(kgp);
      kb.alphaSet[lst.title] = lst.letterset;
      sectn.keyset.push(lst);
      sectn.elmnt.appendChild(lst.elmnt);
    }
  };
  this.ipa_full = {
    "0"	:
    {
      "vowels"	:
      [
	{"A" : { "æ":"near-open front unrounded", "ɐ":"near-open central", "ɑ":"open back unrounded", "ɒ":"open back rounded"}},
	{"E" : { "ə":"mid-central (schwa)", "ɚ":"rhotacized mid-central", "ɵ":"close-mid central rounded", "ɘ":"close-mid central unrounded",}},
	{"3" : { "ɜ":"open-mid central unrounded", "ɝ":"rhotacized open-mid central unrounded", "ɛ":"open-mid front unrounded", "ɛ̃":"nasalized open-mid front unrounded", "ɞ":"open-mid central rounded"}},
	{"I" : { "ɨ":"close central unrounded", "ɪ":"near-close near-front unrounded",}},
	{"O" : { "ɔ":"open-mid back rounded", "ɤ":"close-mid back unrounded", "ø":"close-mid front rounded", "œ":"open-mid front rounded", "ɶ":"open front rounded"}},
	{"U" : { "ʌ":"open-mid back unrounded", "ʊ":"near-close near-back rounded", "ʉ":"close central rounded", "ɯ":"close back unrounded"}},
	{"Y" : { "ʏ":"near-close near-front rounded"}}
      ],
      "consonants"	:
      [
	{"B" : { "β":"voiced bilabial fricative", "ʙ":"bilabial trill", "ɓ":"voiced bilabial implosive"}},
	{"C" : { "ɕ":"voiceless alveopalatal fricative", "ç":"voiceless palatal fricative"}},
	{"D" : { "ð":"voiced dental fricative", "d͡ʒ":"voiced postalveolar fricative", "ɖ":"voiced retroflex plosive", "ɗ":"voiced alveolar implosive", "ᶑ":"voiced retroflex implosive"}},
	{"G" : { "ɠ":"voiced velar implosive", "ɢ":"voiced uvular plosive", "ʛ":"voiced uvular implosive"}},
	{"H" : { "ɦ":"voiced glottal fricative", "ħ":"voiceless pharyngeal fricative", "ɧ":"voiceless palatal-velar fricative", "ʜ":"voiceless epiglottal fricative", "ɥ":"labial-palatal approximant"}},
	{"J" : { "ʝ":"voiced palatal fricative", "ɟ":"voiced palatal plosive", "ʄ":"voiced palatal implosive", "ʎ":"palatal lateral approximant"}},
	{"L" : { "ɫ":"velarized alveolar lateral approximant", "ɮ":"voiced alveolar lateral fricative", "ɭ":"retroflex lateral approximant", "ɬ":"voiceless alveolar lateral fricative", "ʟ":"velar lateral approximant"}},
	{"M" : { "ɱ":"labiodental nasal"}},
	{"N" : { "ŋ":"velar nasal", "ɲ":"palatal nasal", "ɴ":"uvular nasal", "ɳ":"retroflex nasal"}},
	{"P" : { "ɸ":"voiceless bilabial fricative"}},
	{"R" : { "ʁ":"voiced uvular fricative", "ʀ":"uvular trill", "ɹ":"alveolar approximant", "ɾ":"alveolar tap", "ɻ":"retroflex approximant", "ɽ":"retroflex flap", "ɺ":"alveolar lateral flap"}},
	{"S" : { "ʃ":"voiceless postalveolar fricative", "ʂ":"voiceless retroflex fricative"}},
	{"T" : { "θ":"voiceless dental fricative", "ʈ":"voiceless retroflex plosive", "t͡ʃ":"voiceless postalveolar fricative", "t͡s":"voiceless alveolar fricative"}},
	{"V" : { "ⱱ":"labiodental flap", "ʋ":"labiodental approximant", "ɣ":"voiced velar fricative"}},
	{"W" : { "ɰ":"velar approximant", "ʍ":"voiceless labio-velar approximant"}},
	{"X" : { "χ":"voiceless uvular fricative"}},
	{"Z" : { "ʒ":"voiced postalveolar fricative", "ʐ":"voiced retroflex fricative", "ʑ":"voiced alveopalatal fricative"}},
	{"?" : { "ʔ":"glottal stop", "ʕ":"voiced pharyngeal fricative", "ʢ":"voiced epiglottal fricative", "ʡ":"epiglottal plosive",}},
	{"0" : { "ʘ":"bilabial click", "ǀ":"dental click", "ǃ":"retroflex click", "ǂ":"postalveolar click", "ǁ":"alveolar lateral click"}}
      ]
    },
    "1"	:
    {
      "diacritics"	:
      [
	{"~" : { "ʰ":"aspirated", "ʷ":"labialized", "ʲ":"palatalized", "ˠ":"velarized", "ˤ":"pharyngealized"}},
	{"*"  : {"ⁿ":"nasal release", "ˡ":"lateral release", "ʱ":"breathy-voice aspirated", "ᵊ":"syllabic or schwa", "ʳ":"optional r", "˞":"rhotacized"}},
	{"#" : { "̚":"unreleased", "̈":"centralized", "̃":"nasalized", "̥":"voiceless", "̊":"voiceless"}}, 
	{"@" : {"̬":"voiced", "̩":"syllabic", "̝":"raised", "̞":"lowered", "̟":"advanced (fronted)", "̠":"retracted (backed)"}},
	{"<" : { "ʼ":"ejective", "̪":"dental", "̺":"apical", "̯":"non-syllabic", "̤":"breathy voiced", "̰":"creaky voiced"}}, 
	{">"  : {"̼":"linguolabial", "̘":"advanced tongue root", "̙":"retracted tongue root", "̻":"laminal", "̹":"more rounded", "̜":"less rounded", "̽":"mid-centralized"}},
	{":" : { "ː":"length mark", "ˑ":"half-long", "̆":"extra short",}},
	{"\'" : { "ˈ":"primary stress", "ˌ":"secondary stress",}},
	{"|":{ "|":"minor group", "‖":"major group",}},
	{"-"	:{ "͡":"tie bar", "͜":"tie bar", "‿":"linking", "→":"becomes"}},
	{"\"" : { "̋":"extra high", "́":"high", "̄":"mid", "̀":"low", "̏":"extra low",}},
	{"^": { "̌":"rising", "̂":"falling", "᷄":"high rising", "᷅":"low rising", "᷈":"rising-falling"}},
	{"]" : {"˥":"extra high", "˦":"high", "˧":"mid", "˨":"low", "˩":"extra low"}}, 
	{"\\" : {"˩˥":"rising (may not work on chrome/safari)", "˥˩":"falling (may not work on chrome/safari)", "˦˥":"high rising (may not work on chrome/safari)", "˩˨":"low rising (may not work on chrome/safari)", "˧˦˧":"rising-falling (may not work on chrome/safari)"}},
	{"+" : { "↓" : "downstep", "↑" : "upstep", "↗" : "global rise", "↘" : "global fall"}}
      ] 
    }
  };
  this.writeToBox = function(chr, replaceLength){
    var cStart, cEnd, str, output;
    cStart = $(this.focusBox).caret().start - replaceLength;
    cEnd = $(this.focusBox).caret().end;
    str = $(this.focusBox).attr('value');
    out = str.substring(0,cStart) + chr + str.substring(cEnd);
    $(this.focusBox).attr('value', out);
    cStart = cEnd + chr.length;
    $(this.focusBox).caret(cStart,cStart);
  };
  this.setHotKeys = function(){
    document.onkeydown = function(e){
      if (e == null) 
        e = window.event;
      var target = e.target != null ? e.target : e.srcElement;
      if(target == kb.html){
	
	if(e.keyCode == _specialCode['ESCAPE']){
	  $('.kbclose').trigger('click');
	}
      }
      if(target == kb.focusBox){
	if(e.keyCode == 17 && specialMode){
	  
	  delta = null;
	  foxtrot = 0;
	  hotel = 0;
	}
	if(e.keyCode == _specialCode['ESCAPE']){
	  specialMode = false;
	  delta = null;
	  foxtrot = 0;
	  hotel = 0;
	  $(typeModeIcon).remove();
	}
	if(e.ctrlKey && e.keyCode == _specialCode['SHIFT']){
	  specialMode=true;
	  delta = null;
	  foxtrot = 0;
	  hotel = 0;
	  $(kb.focusBox).after(typeModeIcon);
	}
	if(e.ctrlKey && e.keyCode == _specialCode['ESCAPE']){
	  $('.kbclose').trigger('click');
	}
      }
    }
    document.onkeypress = function(e){
      if (e == null) 
        e = window.event;
      var target = e.target != null ? e.target : e.srcElement;
      if(target == kb.focusBox){
	if(specialMode && e.which != 17 && e.which != 16 && !e.ctrlKey){
	  alpha = String.fromCharCode(e.charCode).toLocaleUpperCase();
	  foxtrot = alpha == delta ? foxtrot+1: 0;
	  if(foxtrot==0){
	    hotel=0;
	  }
	  delta = alpha;
	  beta = kb.alphaSet[alpha];
	  if(beta != undefined){
	    gamma = beta[foxtrot % beta.length].letter;
	    e.preventDefault();
	    kb.writeToBox(gamma, hotel);
	    hotel = gamma.length;
	  }
	}
      }
    };
  };
  this.setButtonListeners = function(){
    $(this.html).find('.kbletter').click(function(){
      cS = $(kb.focusBox).caret().start, cE = $(kb.focusBox).caret().end;
      str = $(kb.focusBox).attr('value');
      sub1 = str.substring(0,cS);
      sub2 = str.substring(cE);
      $(kb.focusBox).attr('value', sub1 + $(this).attr('letter') + sub2);
      $(kb.focusBox).focus();
      cS = cS+$(this).attr('letter').length;
      cE = cS;
      $(kb.focusBox).caret(cS,cS);
    });
  };
  this.setBoxListener = function(cls){
    
    $(((cls==null || cls.length == 0)?'textarea, input[type=text],input[type=textbox]':cls)).focusin(function(){
	if(kb.focusBox != this || !isVisible){
	  $(kb.html).slideDown(300).center();
	  kb.focusBox = this;
	  hotel=1;
	  specialMode = false; 
	  prevMode = false;
	  $(typeModeIcon).remove();
	  isVisible = true;
	}
    });
    if(typeof cls!='string'){
      $(cls).each(function(){
	
	$(':not('+this+')').focusin(function(){
	  
	  if(isVisible){
	    $('.kbclose').toggle('click');
	  }
	});
      });
    }else{
      $(':not('+cls+')').focusin(function(){
	if(isVisible){
	  $('.kbclose').toggle('click');
	}
      });
    }
    
    
    $('.kbclose').click(function(){
      kb.focusBox = null;
      $(kb.html).slideUp(300);
      isVisible = false;
    });
    
    $(window).resize(function(){
      $(kb.html).center();
    });
  };

}
function KeySection(){
  this.title = "";
  this.keyset = [];
  this.elmnt = null;
  this.toString = function(){
    return this.title;
  }
}
function LetterSet(){
  this.title = "";
  this.letterset = [];
  this.elmnt = null;
  this.toString = function(){
    return this.title ;
  }
}
function Letter(){
  this.letter = "";
  this.isScript = false;
  this.title = "";
  this.elmnt = null;
  this.toString = function(){
    return this.letter + ":" + this.title;
  }
}
function checkCharWidth(chr){
  var f = document.createElement('span'), g = 'kb13', h;
  f.setAttribute('id', g); 
  f.innerHTML = chr; 
  document.body.appendChild(f);
  h = f.offsetWidth;
  document.body.removeChild(f);
  return h>0 ? false : true;
}

/*
 *
 * Copyright (c) 2010 C. F., Wong (<a href="http://cloudgen.w0ng.hk">Cloudgen Examplet Store</a>)
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
﻿(function(k,e,i,j){k.fn.caret=function(b,l){var a,c,f=this[0],d=k.browser.msie;if(typeof b==="object"&&typeof b.start==="number"&&typeof b.end==="number"){a=b.start;c=b.end}else if(typeof b==="number"&&typeof l==="number"){a=b;c=l}else if(typeof b==="string")if((a=f.value.indexOf(b))>-1)c=a+b[e];else a=null;else if(Object.prototype.toString.call(b)==="[object RegExp]"){b=b.exec(f.value);if(b!=null){a=b.index;c=a+b[0][e]}}if(typeof a!="undefined"){if(d){d=this[0].createTextRange();d.collapse(true);
d.moveStart("character",a);d.moveEnd("character",c-a);d.select()}else{this[0].selectionStart=a;this[0].selectionEnd=c}this[0].focus();return this}else{if(d){c=document.selection;if(this[0].tagName.toLowerCase()!="textarea"){d=this.val();a=c[i]()[j]();a.moveEnd("character",d[e]);var g=a.text==""?d[e]:d.lastIndexOf(a.text);a=c[i]()[j]();a.moveStart("character",-d[e]);var h=a.text[e]}else{a=c[i]();c=a[j]();c.moveToElementText(this[0]);c.setEndPoint("EndToEnd",a);g=c.text[e]-a.text[e];h=g+a.text[e]}}else{g=
f.selectionStart;h=f.selectionEnd}a=f.value.substring(g,h);return{start:g,end:h,text:a,replace:function(m){return f.value.substring(0,g)+m+f.value.substring(h,f.value[e])}}}}})(jQuery,"length","createRange","duplicate");

