jQuery.fn.exists = function () {
    return this.length > 0;
}

function dig(blob, depth) {
    depth = depth || 0;
    var deepest = 0;
    var item = blob !== null && typeof blob === 'object' ? Object.keys(blob)[0] : null;

    return item !== null ? (typeof blob[item] === 'object' ? dig(blob[item], depth + 1) : depth + 1) : depth;
    if (typeof blob[item] === 'object') {
        return dig(blob[item], depth + 1); // descend
    } else { // simple value, leaf
        return depth + 1;
    }
}
/*
 * useVipak(boxSelector) or useVipak(boxselector, dict) or useVipak(dict)
 * if kbtype is omitted, dict must have the following build: {num:{area[{set:{letter:description}}]}}
 *
 */
function vipak(arg1, arg2) {
    var d = null,
        k = null,
        b = null;
    if (arg2 !== undefined) {

        d = arg2;
        b = arg1;
        if (typeof arg1 === "string" && typeof arg2 === "string") {
            k = 2;
            d = new Object();
            for (var l in arg2) {
                d[arg2[l]] = null;
            }
        } else {
            var i = dig(d);
            k = i > 3 ? 0 : (i > 1 ? 1 : 2);
        }
    } else if (typeof arg1 === 'object') {
        d = arg1;
        var i = dig(d);
        k = i > 3 ? 0 : (i > 1 ? 1 : 2);

    } else if (typeof arg1 === 'string') {
        if ($(arg1).exists()) {
            b = arg1;
        } else {
            k = 2;
            d = new Object();
            for (var l in arg1) {
                d[arg1[l]] = null;
            }
        }
    }
    var kb = new Keyboard();
    kb.driver(d, k, b);
    return kb;
}

jQuery.fn.bottomCenter = function () {
    this.css("position", "fixed");
    this.css("top", Math.max(0, (($(window).height() - this.outerHeight()))) + "px");
    
    this.css("left", ($(window).width() - this.width()) / 2 + "px");
    return this;
}

function Keyboard() {
    var kb = this, sectn,
        typeModeIcon, isVisible = false,
        isDragging = false,
        closeIcon, isDragged, leftResize, rightResize, bottomResize, middleResize,
	resizingL, resizingR, resizingB, resizingM, draggingBar;
    var alpha, beta, charlie, delta, foxtrot, gamma, hotel = 1,
        specialMode = false,
        prevMode = false,
        kbtoolbar,
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
    var _startX = 0, _startY = 0; // mouse starting positions
    var _offsetX = 0, _offsetY = 0; // current element offset
    var _lastX = 0, _lastY = 0;
    var _oldZIndex = 0; // we temporarily increase the z-index during drag
    typeModeIcon = document.createElement('canvas');
    typeModeIcon.setAttribute('class', 'kbtyping');
    typeModeIcon.setAttribute('width', '24');
    typeModeIcon.setAttribute('height', '24');
    drawHoshi(typeModeIcon.getContext('2d'));
    this.Center = [];
    this.position = {
      left: null,
      right: null,
      center: null,
      column: []
    };
    this.colWrapper = null;
    this.parentId = null;
    this.focusBox = null;
    this.alphaSet = [];
    this.focusbox = null;
    this.driver = function (dict, kbtype, boxSelector) {

        this.organize(dict, kbtype);
        document.body.appendChild(this.html);
        $(this.html).hide();
        this.setBoxListener(boxSelector);
        this.setButtonListeners();
        this.setHotKeys();
        document.onmousedown = this.OnMouseDown;
        document.onmouseup = this.OnMouseUp;
    };
    this.organize = function (dict, kbtype) {
        if (dict === null || dict === undefined) {
            dict = ipa_full;
            kbtype = 0;
        }
        if (kbtype === null) {
            kbtype = 0;
        }
        var location, type, lset, lettr, sectn, lst, let, indx, title1, title2, posel, kgp, tmp, helpIcon, kbtoolbarbuttons;
        this.html = document.createElement('div');
        this.html.setAttribute('class', 'kb-wrapper');
        this.html.tabIndex = 1;
	this.colWrapper = document.createElement('div');
	this.colWrapper.setAttribute('class', 'kb-col-wrapper');
	leftResize = document.createElement('span');
	leftResize.setAttribute('class', 'kb-left-resize');
	rightResize = document.createElement('span');
	rightResize.setAttribute('class', 'kb-right-resize');
	bottomResize = document.createElement('span');
	bottomResize.setAttribute('class', 'kb-bottom-resize');
	this.html.appendChild(leftResize);
	this.html.appendChild(rightResize);
	this.html.appendChild(bottomResize);
        kbtoolbar = document.createElement('div');
        kbtoolbar.setAttribute('class', 'kb-topbar');
        kbtoolbar.innerHTML = 'VIPAK&nbsp;';
        closeIcon = document.createElement('i');
        closeIcon.setAttribute('class', 'kbclose');
        closeIcon.setAttribute('title', 'close VIPAK');
        closeIcon.innerHTML = '&times;';
        helpIcon = document.createElement('i');
        helpIcon.setAttribute('class', 'kbhelp');
        helpIcon.setAttribute('title', 'about VIPAK~\n Hotkeys - (focused in text box)\n  Activate: Ctrl+Shift\n  Deactivate: Esc');
        helpIcon.innerHTML = '?';
        kbtoolbarbuttons = document.createElement('span');
        kbtoolbarbuttons.setAttribute('class', 'kb-toolbar-right');
        kbtoolbarbuttons.appendChild(helpIcon);
        kbtoolbarbuttons.appendChild(closeIcon);
        kbtoolbar.appendChild(kbtoolbarbuttons);
        this.html.appendChild(kbtoolbar);
        if (kbtype === 0) {
            for (location in dict) {
                posel = document.createElement('span');
                posel.setAttribute('class', 'kb-' + (location === '0' ? 'center' : (location === '1' ? 'left' : 'right')));
                for (type in dict[location]) {
                    createKeySection(type);
                    for (indx in dict[location][type]) {
                        for (lset in dict[location][type][indx]) {
                            createLetterSet(dict[location][type][indx][lset]);
                        }
                        posel.appendChild(sectn.elmnt);
                    }
                }
                
		if(location === "0"){
		  this.position.center = posel;
		  this.html.appendChild(posel);
		}else{
		  this.colWrapper.appendChild(posel);
		}
                if(location === "1"){
		  this.position.left = posel;
		  middleResize = document.createElement('span');
		  middleResize.setAttribute('class', 'kb-mid-resize');
		  this.colWrapper.appendChild(middleResize);
		}
                if(location === "2"){this.position.right = posel;}
                if(Number(location) > 2){this.position.column.push(posel);}
            }
        }
        if (kbtype === 1) {
            createKeySection();
            for (lset in dict) {
                createLetterSet(dict[lset]);
            }
            this.html.appendChild(sectn.elmnt);
        }
        if (kbtype === 2) {
            lset = "~";
            createKeySection('');
            createLetterSet(dict);
            this.html.appendChild(sectn.elmnt);
        }

        function createKeySection(typ) {
            sectn = new KeySection();
            sectn.title = typ;
            sectn.elmnt = document.createElement('div');
            sectn.elmnt.setAttribute('class', 'kb-section');
            if (typ !== null) {
                title1 = document.createElement('div');
                title1.setAttribute('class', 'kb-area-title');
                title1.innerHTML = sectn.title;
                sectn.elmnt.appendChild(title1);
            }
        }

        function createLetterSet(dictref) {
            lst = new LetterSet();
            lst.title = lset;
            lst.elmnt = document.createElement('span');
            lst.elmnt.setAttribute('class', 'kb-letter-set');
            lst.elmnt.setAttribute('id', lst.title);
            title2 = document.createElement('span');
            title2.setAttribute('class', 'kb-letter-set-title');
            title2.innerHTML = lst.title;
            lst.elmnt.appendChild(title2);
            kgp = document.createElement('span');
            kgp.setAttribute('class', 'kb-btn-group');
            for (lettr in dictref) {
                let = new Letter();
                let.letter = lettr;
                let.isScript = checkCharWidth(lettr);
                let.title = dictref[lettr] !== undefined ? dictref[lettr] : '';
                let.elmnt = document.createElement('button');
                let.elmnt.setAttribute('class', 'kb-letter');
                let.elmnt.setAttribute('id', 'kbl' + let.letter);
                let.elmnt.setAttribute('title', let.title);
                let.elmnt.setAttribute('letter', let.letter);
                let.elmnt.innerHTML = (let.isScript ? '&nbsp;' : '') + let.letter;
                lst.letterset.push(let);
                kgp.appendChild(let.elmnt);
            }
            lst.elmnt.appendChild(kgp);
            kb.alphaSet[lst.title] = lst.letterset;
            sectn.keyset.push(lst);
            sectn.elmnt.appendChild(lst.elmnt);
        }
        this.html.appendChild(this.colWrapper);
    };
    this.writeToBox = function (chr, replaceLength) {
        var cStart, cEnd, str, output;
        cStart = $(this.focusBox).caret().start - replaceLength;
        cEnd = $(this.focusBox).caret().end;
        str = $(this.focusBox).attr('value');
        out = str.substring(0, cStart) + chr + str.substring(cEnd);
        $(this.focusBox).attr('value', out);
        cStart = cEnd + chr.length;
        $(this.focusBox).caret(cStart, cStart);
    };
    this.setHotKeys = function () {
        document.onkeydown = function (e) {
            if (e === null) e = window.event;
            var target = e.target !== null ? e.target : e.srcElement;
            if (target === kb.html) {
                if (e.keyCode === _specialCode['ESCAPE']) {
                    $('.kbclose').trigger('click');
                }
            }
            if (target === kb.focusBox) {
                if (e.keyCode === 17 && specialMode) {

                    delta = null;
                    foxtrot = 0;
                    hotel = 0;
                }
                if (e.keyCode === _specialCode['ESCAPE']) {
                    specialMode = false;
                    delta = null;
                    foxtrot = 0;
                    hotel = 0;
                    $(typeModeIcon).remove();
                }
                if (e.ctrlKey && e.keyCode === _specialCode['SHIFT']) {
                    specialMode = true;
                    delta = null;
                    foxtrot = 0;
                    hotel = 0;
                    $(kb.focusBox).after(typeModeIcon);
                }
                if (e.ctrlKey && e.keyCode === _specialCode['ESCAPE']) {
                    $('.kbclose').trigger('click');
                }
            }
        }
        document.onkeypress = function (e) {
            if (e === null) e = window.event;
            var target = e.target !== null ? e.target : e.srcElement;
            if (target === kb.focusBox) {
                if (specialMode && e.which !== 17 && e.which !== 16 && !e.ctrlKey) {
                    alpha = String.fromCharCode(e.charCode).toLocaleUpperCase();
                    foxtrot = alpha === delta ? foxtrot + 1 : 0;
                    if (foxtrot === 0) {
                        hotel = 0;
                    }
                    delta = alpha;
                    beta = kb.alphaSet[alpha];
                    if (beta !== undefined) {
                        gamma = beta[foxtrot % beta.length].letter;
                        e.preventDefault();
                        kb.writeToBox(gamma, hotel);
                        hotel = gamma.length;
                    }
                }
            }
        };
    };
    this.setButtonListeners = function () {
        $(this.html).find('.kb-letter').click(function () {
            cS = $(kb.focusBox).caret().start, cE = $(kb.focusBox).caret().end;
            str = $(kb.focusBox).attr('value');
            sub1 = str.substring(0, cS);
            sub2 = str.substring(cE);
            $(kb.focusBox).attr('value', sub1 + $(this).attr('letter') + sub2);
            $(kb.focusBox).focus();
            cS = cS + $(this).attr('letter').length;
            cE = cS;
            $(kb.focusBox).caret(cS, cS);
        });
    };
    this.setBoxListener = function (cls) {
        var ctx = (cls === null || cls.length === 0) ? $('textarea, input[type=text],input[type=textbox]') : $(cls);

        $(((cls === null || cls.length === 0) ? 'textarea, input[type=text],input[type=textbox]' : cls)).focusin(function () {
            if (kb.focusBox !== this || !isVisible) {
                $(kb.html).slideDown(300, function () {
                    if (!isDragged) $(this).bottomCenter();
                    if(middleResize !== undefined){
		      middleResize.style.left = kb.position.left.offsetWidth+'px';
		      kb.resizeHeight();
		    }
                    
                });
                kb.focusBox = this;
                hotel = 1;
                specialMode = false;
                prevMode = false;
                $(typeModeIcon).remove();
                isVisible = true;
            }
        });

        $('.kbclose').click(function () {
            kb.focusBox = null;
            $(kb.html).slideUp(300);
            isVisible = false;
        });

        $(window).resize(function () {
            $(kb.html).bottomCenter();
	    if(middleResize !== undefined){middleResize.style.left = kb.position.left.offsetWidth+'px';}
        });
    };
    this.OnMouseDown = function (e) {
        var height = kb.html.offsetHeight-4;
        if (e === null) {
            e = window.event;
        }
        kb.html.style.width = kb.html.offsetWidth-4+'px';
        resizingL=e.target===leftResize;
        resizingR=e.target===rightResize;
        resizingB=e.target===bottomResize;
        
        resizingM=e.target===middleResize;
	draggingBar = e.target===kbtoolbar;
        var target = e.target !== null ? e.target : e.srcElement;
        if ((e.button === 1 && window.event !== null || e.button === 0) && (draggingBar||resizingL||resizingR||resizingB||resizingM)) {
            _startX = e.clientX;
            _startY = e.clientY;
            _offsetX = extractNumber(kb.html.style.left);
            _offsetY = extractNumber(kb.html.style.top);
	    _lastX = e.clientX;
	    _lastY = e.clientY;
            _oldZIndex = kb.html.style.zIndex;
	    if(draggingBar){
	      kb.html.style.height = height + 'px';
	      document.onmousemove =kb.OnMouseMove;
	    }
	    else{
	      document.onmousemove =kb.Resize;
	    }
            kb.html.style.zIndex = 10000;
            isDragging = true;
            document.body.focus();
            document.onselectstart = function () {
                return false;
            };
            target.ondragstart = function () {
                return false;
            };
            return false;
        }
    };
    this.Resize = function(e){
      if (e === null) var e = window.event;
      var resizeX =_lastX - e.clientX;
      var resizeY = _lastY - e.clientY;
      var curHeight = kb.html.offsetHeight - 4;
      var curWidth = kb.html.offsetWidth-4;
      var leftWidth = kb.position.left? kb.position.left.offsetWidth-2:null;
      if(resizingL){
	if(kb.position.left.style.width){
	  kb.position.left.style.width = leftWidth + resizeX/2 + 'px';
	  if(kb.position.right){
	    kb.position.right.style.width = curWidth - (leftWidth+resizeX/2)+'px';
	  }
	}
	kb.html.style.left = (_offsetX + e.clientX - _startX) + 'px';
	kb.html.style.width = curWidth + resizeX + 'px';
	kb.resizeHeight();
      }
      if(resizingR){
	if(kb.position.left.style.width){
	  kb.position.left.style.width = leftWidth - resizeX/2 + 'px';
	  if(kb.position.right){
	    kb.position.right.style.width = curWidth - (leftWidth-resizeX/2)+'px';
	  }
	}
	kb.html.style.width = curWidth - resizeX + 'px';
	kb.resizeHeight();
      }
      if(resizingB){
	kb.html.style.height = curHeight - resizeY + 'px';
      }
      if(resizingM){
	kb.position.left.style.width = leftWidth - resizeX + 'px';
	if(kb.position.right){
	  kb.position.right.style.width = curWidth - (leftWidth-resizeX)+'px';
	}
	kb.resizeHeight();
      }
      if(middleResize !== undefined){
	middleResize.style.left = kb.position.left.offsetWidth+'px';
      }
      _lastX = e.clientX;
      _lastY = e.clientY;
    };
    this.OnMouseMove = function (e) {
      if (e === null) var e = window.event;
      kb.html.style.left = (_offsetX + e.clientX - _startX) + 'px';
      kb.html.style.top = (_offsetY + e.clientY - _startY) + 'px';
      if(middleResize !== undefined){
	middleResize.style.left = kb.position.left.offsetWidth+'px';
      }
    };
    this.OnMouseUp = function (e) {
        if (isDragging) {
	  resizingL=false;
	  resizingR=false
	  resizingB=false;
	  resizingM=false;
	  if(!draggingBar){
	    kb.resizeHeight();
	  }
	  kb.html.style.zIndex = _oldZIndex;
	  kb.html.focus();
	  document.onmousemove = null;
	  document.onselectstart = null;
	  isDragging = false;
	  isDragged = true;
        }
    };
    this.resizeHeight = function(){
      var tb = kbtoolbar.offsetHeight;
      var lh = this.position.left?this.position.left.offsetHeight:0;
      var rh = this.position.left?this.position.right.offsetHeight:0;
      var ch = this.position.center? this.position.center.offsetHeight:0;
      var sh = !lh && !rh?$('.kb-wrapper > .kb-section').outerHeight():0;
      this.colWrapper.style.height = (lh>rh?lh:rh) + 'px';
      
      this.html.style.height = tb + ((lh>rh?lh:rh)+sh+ch)+'px';
    };
}

function extractNumber(val) {
    var n = parseInt(val);
    return n === null || isNaN(n) ? 0 : n;
}

function KeySection() {
    this.title = "";
    this.keyset = [];
    this.elmnt = null;
    this.toString = function () {
        return this.title;
    }
}

function LetterSet() {
    this.title = "";
    this.letterset = [];
    this.elmnt = null;
    this.toString = function () {
        return this.title;
    }
}

function Letter() {
    this.letter = "";
    this.isScript = false;
    this.title = "";
    this.elmnt = null;
    this.toString = function () {
        return this.letter + ":" + this.title;
    }
}

function checkCharWidth(chr) {
    var f = document.createElement('span'),
        g = 'kb13',
        h;
    f.setAttribute('id', g);
    f.innerHTML = chr;
    document.body.appendChild(f);
    h = f.offsetWidth;
    document.body.removeChild(f);
    return h > 0 ? false : true;
}
/*
 *
 * Copyright (c) 2010 C. F., Wong (<a href="http://cloudgen.w0ng.hk">Cloudgen Examplet Store</a>)
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */﻿ (function (k, e, i, j) {
    k.fn.caret = function (b, l) {
        var a, c, f = this[0],
            d = k.browser.msie;
        if (typeof b === "object" && typeof b.start === "number" && typeof b.end === "number") {
            a = b.start;
            c = b.end
        } else if (typeof b === "number" && typeof l === "number") {
            a = b;
            c = l
        } else if (typeof b === "string") if ((a = f.value.indexOf(b)) > -1) c = a + b[e];
        else a = null;
        else if (Object.prototype.toString.call(b) === "[object RegExp]") {
            b = b.exec(f.value);
            if (b !== null) {
                a = b.index;
                c = a + b[0][e]
            }
        }
        if (typeof a !== "undefined") {
            if (d) {
                d = this[0].createTextRange();
                d.collapse(true);
                d.moveStart("character", a);
                d.moveEnd("character", c - a);
                d.select()
            } else {
                this[0].selectionStart = a;
                this[0].selectionEnd = c
            }
            this[0].focus();
            return this
        } else {
            if (d) {
                c = document.selection;
                if (this[0].tagName.toLowerCase() !== "textarea") {
                    d = this.val();
                    a = c[i]()[j]();
                    a.moveEnd("character", d[e]);
                    var g = a.text === "" ? d[e] : d.lastIndexOf(a.text);
                    a = c[i]()[j]();
                    a.moveStart("character", - d[e]);
                    var h = a.text[e]
                } else {
                    a = c[i]();
                    c = a[j]();
                    c.moveToElementText(this[0]);
                    c.setEndPoint("EndToEnd", a);
                    g = c.text[e] - a.text[e];
                    h = g + a.text[e]
                }
            } else {
                g = f.selectionStart;
                h = f.selectionEnd
            }
            a = f.value.substring(g, h);
            return {
                start: g,
                end: h,
                text: a,
                replace: function (m) {
                    return f.value.substring(0, g) + m + f.value.substring(h, f.value[e])
                }
            }
        }
    }
})(jQuery, "length", "createRange", "duplicate");
var drawHoshi = function (ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(23.389164, 0);
        ctx.lineTo(23.389164, 24.436085);
        ctx.lineTo(0, 24.436085);
        ctx.closePath();
        ctx.clip();
        ctx.strokeStyle = 'rgba(0,0,0,0)';
        ctx.lineCap = 'butt';
        ctx.lineJoin = 'miter';
        ctx.miterLimit = 4;
        ctx.save();
        ctx.restore();
        ctx.save();
        ctx.restore();
        ctx.save();
        ctx.translate(-298.40319, - 522.03006);
        ctx.save();
        ctx.fillStyle = "#5258c1";
        ctx.strokeStyle = "rgba(0, 0, 0, 0)";
        ctx.transform(0.81953764, 0, 0, 0.81953764, 56.168909, 96.425816);
        ctx.beginPath();
        ctx.moveTo(323.75, 543.79076);
        ctx.lineTo(313.52487, 541.82852);
        ctx.lineTo(306.11164, 549.13931);
        ctx.lineTo(304.81811000000005, 538.80827);
        ctx.lineTo(295.57432000000006, 534.01702);
        ctx.lineTo(305.00000000000006, 529.59433);
        ctx.lineTo(306.70026000000007, 519.32239);
        ctx.lineTo(313.8191800000001, 526.92006);
        ctx.lineTo(324.1137800000001, 525.3629000000001);
        ctx.lineTo(319.0878400000001, 534.4812000000001);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        ctx.restore();
        ctx.restore();
    };


ipa_full = {
    1	: {
        vowels: [{
            "A": {
                "æ": "near-open front unrounded",
                "ɐ": "near-open central",
                "ɑ": "open back unrounded",
                "ɒ": "open back rounded"
            }
        }, {
            "E": {
                "ə": "mid-central (schwa)",
                "ɚ": "rhotacized mid-central",
                "ɵ": "close-mid central rounded",
                "ɘ": "close-mid central unrounded",
            }
        }, {
            "3": {
                "ɜ": "open-mid central unrounded",
                "ɝ": "rhotacized open-mid central unrounded",
                "ɛ": "open-mid front unrounded",
                "ɛ̃": "nasalized open-mid front unrounded",
                "ɞ": "open-mid central rounded"
            }
        }, {
            "I": {
                "ɨ": "close central unrounded",
                "ɪ": "near-close near-front unrounded",
            }
        }, {
            "O": {
                "ɔ": "open-mid back rounded",
                "ɤ": "close-mid back unrounded",
                "ø": "close-mid front rounded",
                "œ": "open-mid front rounded",
                "ɶ": "open front rounded"
            }
        }, {
            "U": {
                "ʌ": "open-mid back unrounded",
                "ʊ": "near-close near-back rounded",
                "ʉ": "close central rounded",
                "ɯ": "close back unrounded"
            }
        }, {
            "Y": {
                "ʏ": "near-close near-front rounded"
            }
        }],
        consonants: [{
            "B": {
                "β": "voiced bilabial fricative",
                "ʙ": "bilabial trill",
                "ɓ": "voiced bilabial implosive"
            }
        }, {
            "C": {
                "ɕ": "voiceless alveopalatal fricative",
                "ç": "voiceless palatal fricative"
            }
        }, {
            "D": {
                "ð": "voiced dental fricative",
                "d͡ʒ": "voiced postalveolar fricative",
                "ɖ": "voiced retroflex plosive",
                "ɗ": "voiced alveolar implosive",
                "ᶑ": "voiced retroflex implosive"
            }
        }, {
            "G": {
                "ɠ": "voiced velar implosive",
                "ɢ": "voiced uvular plosive",
                "ʛ": "voiced uvular implosive"
            }
        }, {
            "H": {
                "ɦ": "voiced glottal fricative",
                "ħ": "voiceless pharyngeal fricative",
                "ɧ": "voiceless palatal-velar fricative",
                "ʜ": "voiceless epiglottal fricative",
                "ɥ": "labial-palatal approximant"
            }
        }, {
            "J": {
                "ʝ": "voiced palatal fricative",
                "ɟ": "voiced palatal plosive",
                "ʄ": "voiced palatal implosive",
                "ʎ": "palatal lateral approximant"
            }
        }, {
            "L": {
                "ɫ": "velarized alveolar lateral approximant",
                "ɮ": "voiced alveolar lateral fricative",
                "ɭ": "retroflex lateral approximant",
                "ɬ": "voiceless alveolar lateral fricative",
                "ʟ": "velar lateral approximant"
            }
        }, {
            "M": {
                "ɱ": "labiodental nasal"
            }
        }, {
            "N": {
                "ŋ": "velar nasal",
                "ɲ": "palatal nasal",
                "ɴ": "uvular nasal",
                "ɳ": "retroflex nasal"
            }
        }, {
            "P": {
                "ɸ": "voiceless bilabial fricative"
            }
        }, {
            "R": {
                "ʁ": "voiced uvular fricative",
                "ʀ": "uvular trill",
                "ɹ": "alveolar approximant",
                "ɾ": "alveolar tap",
                "ɻ": "retroflex approximant",
                "ɽ": "retroflex flap",
                "ɺ": "alveolar lateral flap"
            }
        }, {
            "S": {
                "ʃ": "voiceless postalveolar fricative",
                "ʂ": "voiceless retroflex fricative"
            }
        }, {
            "T": {
                "θ": "voiceless dental fricative",
                "ʈ": "voiceless retroflex plosive",
                "t͡ʃ": "voiceless postalveolar fricative",
                "t͡s": "voiceless alveolar fricative"
            }
        }, {
            "V": {
                "ⱱ": "labiodental flap",
                "ʋ": "labiodental approximant",
                "ɣ": "voiced velar fricative"
            }
        }, {
            "W": {
                "ɰ": "velar approximant",
                "ʍ": "voiceless labio-velar approximant"
            }
        }, {
            "X": {
                "χ": "voiceless uvular fricative"
            }
        }, {
            "Z": {
                "ʒ": "voiced postalveolar fricative",
                "ʐ": "voiced retroflex fricative",
                "ʑ": "voiced alveopalatal fricative"
            }
        }, {
            "?": {
                "ʔ": "glottal stop",
                "ʕ": "voiced pharyngeal fricative",
                "ʢ": "voiced epiglottal fricative",
                "ʡ": "epiglottal plosive",
            }
        }, {
            "0": {
                "ʘ": "bilabial click",
                "ǀ": "dental click",
                "ǃ": "retroflex click",
                "ǂ": "postalveolar click",
                "ǁ": "alveolar lateral click"
            }
        }]
    },
    2: {
        diacritics: [{
            "~": {
                "ʰ": "aspirated",
                "ʷ": "labialized",
                "ʲ": "palatalized",
                "ˠ": "velarized",
                "ˤ": "pharyngealized"
            }
        }, {
            "*": {
                "ⁿ": "nasal release",
                "ˡ": "lateral release",
                "ʱ": "breathy-voice aspirated",
                "ᵊ": "syllabic or schwa",
                "ʳ": "optional r",
                "˞": "rhotacized"
            }
        }, {
            "#": {
                "̚": "unreleased",
                "̈": "centralized",
                "̃": "nasalized",
                "̥": "voiceless",
                "̊": "voiceless"
            }
        }, {
            "@": {
                "̬": "voiced",
                "̩": "syllabic",
                "̝": "raised",
                "̞": "lowered",
                "̟": "advanced (fronted)",
                "̠": "retracted (backed)"
            }
        }, {
            "<": {
                "ʼ": "ejective",
                "̪": "dental",
                "̺": "apical",
                "̯": "non-syllabic",
                "̤": "breathy voiced",
                "̰": "creaky voiced"
            }
        }, {
            ">": {
                "̼": "linguolabial",
                "̘": "advanced tongue root",
                "̙": "retracted tongue root",
                "̻": "laminal",
                "̹": "more rounded",
                "̜": "less rounded",
                "̽": "mid-centralized"
            }
        }, {
            ":": {
                "ː": "length mark",
                "ˑ": "half-long",
                "̆": "extra short",
            }
        }, {
            "\'": {
                "ˈ": "primary stress",
                "ˌ": "secondary stress",
            }
        }, {
            "|": {
                "|": "minor group",
                "‖": "major group",
            }
        }, {
            "-": {
                "͡": "tie bar",
                "͜": "tie bar",
                "‿": "linking",
                "→": "becomes"
            }
        }, {
            "\"": {
                "̋": "extra high",
                "́": "high",
                "̄": "mid",
                "̀": "low",
                "̏": "extra low",
            }
        }, {
            "^": {
                "̌": "rising",
                "̂": "falling",
                "᷄": "high rising",
                "᷅": "low rising",
                "᷈": "rising-falling"
            }
        }, {
            "]": {
                "˥": "extra high",
                "˦": "high",
                "˧": "mid",
                "˨": "low",
                "˩": "extra low"
            }
        }, {
            "\\": {
                "˩˥": "rising (may not work on chrome/safari)",
                "˥˩": "falling (may not work on chrome/safari)",
                "˦˥": "high rising (may not work on chrome/safari)",
                "˩˨": "low rising (may not work on chrome/safari)",
                "˧˦˧": "rising-falling (may not work on chrome/safari)"
            }
        }, {
            "+": {
                "↓": "downstep",
                "↑": "upstep",
                "↗": "global rise",
                "↘": "global fall"
            }
        }]
    }
};
