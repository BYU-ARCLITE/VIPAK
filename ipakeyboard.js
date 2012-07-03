$(function(){
  var fct = new KeyboardFactory();
  var kb = fct.fullkeyboard();
  $('body').append(kb.html);
  $('.kbwpr').hide();
  var cS,cE,field;
  $('input[type=text],input[type=textbox],textarea').focusin(function(){
      $(kb.html).slideDown('fast');
      field = $(this);
  });
  $(kb.html).find('.kbletter').click(function(){
    cS = field.caret().start, cE = field.caret().end;
    var str = field.attr('value');
    var sub1 = str.substring(0,cS), sub2 = str.substring(cE);
    field.attr('value', sub1 + $(this).attr('letter') + sub2);
    field.focus();
    cS = cS+$(this).attr('letter').length;
    cE = cS;
    field.caret(cE,cE);
  });
});
function KeyboardFactory(){
  this.fullkeyboard = function(){
    var k;
    k = new Keyboard();
    k.dict = k.ipa_full;
    k.organize();
    
    return k;
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
function Keyboard(){
  this.Left = [];
  this.Right = [];
  this.Center = [];
  this.position = [];
  this.parentId = null;
  this.dict = null;
  this.focusBox = null;
  this.organize = function(){
    if(this.dict == null)
    {
      return false;
    }
    var location, type, lset, lettr, sectn, lst, let, indx, counter=0;
    var title1, title2, posel, kgp;
    this.html = document.createElement('div');
    this.html.setAttribute('class', 'kbwpr');
    for(location in this.dict){
      posel = document.createElement('div');
      posel.setAttribute('id', 'kbpos'+location);
      
      for(type in this.dict[location]){
	
	sectn = new KeySection();
	sectn.title = type;
	sectn.elmnt = document.createElement('div');
	sectn.elmnt.setAttribute('class', 'kbsection');
	title1 = document.createElement('div');
	title1.setAttribute('class', 'label kbsectitle');
	title1.innerHTML = sectn.title;
	sectn.elmnt.appendChild(title1);
	for(indx in this.dict[location][type]){
	  for(lset in this.dict[location][type][indx]){
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
	    for(lettr in this.dict[location][type][indx][lset]){
	      let = new Letter();
	      let.letter = lettr;
	      let.isScript = checkCharWidth(lettr);
	      let.title = this.dict[location][type][indx][lset][lettr];
	      let.elmnt = document.createElement('button');
	      let.elmnt.setAttribute('class', 'kbletter btn');
	      let.elmnt.setAttribute('id', 'kbl'+let.letter);
	      let.elmnt.setAttribute('title', let.title);
	      let.elmnt.setAttribute('letter', let.letter);
	      let.elmnt.innerHTML = (let.isScript? '&nbsp;':'')+let.letter;
	      lst.letterset.push(let);
	      kgp.appendChild(let.elmnt);
	      
	    }
	    counter=counter+1;
	    lst.elmnt.appendChild(kgp);
	    sectn.keyset.push(lst);
	    sectn.elmnt.appendChild(lst.elmnt);
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
	{"*" : { "ʰ":"aspirated", "ʷ":"labialized", "ʲ":"palatalized", "ˠ":"velarized", "ˤ":"pharyngealized", "ⁿ":"nasal release", "ˡ":"lateral release", "ʱ":"breathy-voice aspirated", "ᵊ":"syllabic or schwa", "ʳ":"optional r", "˞":"rhotacized"}},
	{"#" : { "̚":"unreleased", "̈":"centralized", "̃":"nasalized", "̥":"voiceless", "̊":"voiceless", "̬":"voiced", "̩":"syllabic", "̝":"raised", "̞":"lowered", "̟":"advanced (fronted)", "̠":"retracted (backed)"}},
	{">" : { "ʼ":"ejective", "̪":"dental", "̺":"apical", "̯":"non-syllabic", "̤":"breathy voiced", "̰":"creaky voiced", "̼":"linguolabial", "̘":"advanced tongue root", "̙":"retracted tongue root", "̻":"laminal", "̹":"more rounded", "̜":"less rounded", "̽":"mid-centralized"}},
	{"~" : { "ː":"length mark", "ˑ":"half-long", "̆":"extra short",}},
	{"\'" : { "ˈ":"primary stress", "ˌ":"secondary stress",}},
	{"|":{ "|":"minor group", "‖":"major group",}},
	{"["	:{ "͡":"tie bar", "͜":"tie bar", "‿":"linking", "→":"becomes"}},
	{"7" : { "̋":"extra high", "́":"high", "̄":"mid", "̀":"low", "̏":"extra low",}},
	{"^": { "̌":"rising", "̂":"falling", "᷄":"high rising", "᷅":"low rising", "᷈":"rising-falling"}},
	{"]" : {"˥":"extra high", "˦":"high", "˧":"mid", "˨":"low", "˩":"extra low"}}, 
	{"\\" : {"˩˥":"rising (may not work on chrome/safari)", "˥˩":"falling (may not work on chrome/safari)", "˦˥":"high rising (may not work on chrome/safari)", "˩˨":"low rising (may not work on chrome/safari)", "˧˦˧":"rising-falling (may not work on chrome/safari)"}},
	{"+" : { "↓" : "downstep", "↑" : "upstep", "↗" : "global rise", "↘" : "global fall"}}
      ] 
    }
  };
}

function checkCharWidth(chr)
{
  var f = document.createElement('span'), g = 'bkeirbareren143e', h;
  f.setAttribute('id', g); 
  f.innerHTML = chr; 
  document.body.appendChild(f);
  h = f.offsetWidth;
  document.body.removeChild(f);
  return h>0 ? false : true;
}
/*
 *The following function is a jQuery plugin
 * Copyright (c) 2010 C. F., Wong (<a href="http://cloudgen.w0ng.hk">Cloudgen Examplet Store</a>)
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
﻿(function(k,e,i,j){k.fn.caret=function(b,l){var a,c,f=this[0],d=k.browser.msie;if(typeof b==="object"&&typeof b.start==="number"&&typeof b.end==="number"){a=b.start;c=b.end}else if(typeof b==="number"&&typeof l==="number"){a=b;c=l}else if(typeof b==="string")if((a=f.value.indexOf(b))>-1)c=a+b[e];else a=null;else if(Object.prototype.toString.call(b)==="[object RegExp]"){b=b.exec(f.value);if(b!=null){a=b.index;c=a+b[0][e]}}if(typeof a!="undefined"){if(d){d=this[0].createTextRange();d.collapse(true);
d.moveStart("character",a);d.moveEnd("character",c-a);d.select()}else{this[0].selectionStart=a;this[0].selectionEnd=c}this[0].focus();return this}else{if(d){c=document.selection;if(this[0].tagName.toLowerCase()!="textarea"){d=this.val();a=c[i]()[j]();a.moveEnd("character",d[e]);var g=a.text==""?d[e]:d.lastIndexOf(a.text);a=c[i]()[j]();a.moveStart("character",-d[e]);var h=a.text[e]}else{a=c[i]();c=a[j]();c.moveToElementText(this[0]);c.setEndPoint("EndToEnd",a);g=c.text[e]-a.text[e];h=g+a.text[e]}}else{g=
f.selectionStart;h=f.selectionEnd}a=f.value.substring(g,h);return{start:g,end:h,text:a,replace:function(m){return f.value.substring(0,g)+m+f.value.substring(h,f.value[e])}}}}})(jQuery,"length","createRange","duplicate");
