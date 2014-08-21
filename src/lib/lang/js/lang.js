/**
 *  Lang functions
 *
 *  @author subburajan
 *  @date   march 2011
 *
 ****************************************************************************/

$2("lang", ["base"], function(S) {

S.Lang = {

	KeyCode: { "SPACE": 32, "BACKSPACE": 8, "ENTER": 13, "CTRL": 17, "ALT": 18 },


	_MONTH:  [	'January', 'February', 'March',
					'April', 'May', 'June', 'July', 'August',
					'September', 'October', 'November', 'December' ],

	sm_heading: "Smyle",

	getObj: function(_idOrObj) {
		return (typeof(_idOrObj) == "string")? $1(_idOrObj): _idOrObj;
	},

	inherit: function(_child, _parent, _fmap) {
		var TempF = function() { };
		TempF.prototype = _parent.prototype;
		_child.prototype = new TempF();
		if(_fmap) {
			var p = _child.prototype;
			for(var k in _fmap) {
				p[k] = _fmap[k];
			}
		}
		_child.superclass = _parent;
	},

	derive: function(_class, _fmap) {
		for(var k in _fmap) {
			_class[k] = _fmap[k];
		}
		return _class;
	},

	setSelection: function(_sel_) {
		this._sel = _sel_;
	},

	getIEver: function() {
	   var rv = -1;
	   if (navigator.appName == 'Microsoft Internet Explorer') {
		  var ua = navigator.userAgent;
		  var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		  if (re.exec(ua) != null)
			 rv = parseFloat( RegExp.$1 );
	   }
	   return rv;
	},

	hasClass: function(elem, cn) {
		return (elem.className.indexOf(cn) > -1);
	},

	addClass: function(elem, cn) {
		if(elem.className.indexOf(cn) == -1) {
			elem.className += " " + cn;
		}
	},

	removeClass: function(elem, cn) {
		var c = elem.className;
		var i = c.indexOf(cn);
		if(i > -1) {
			elem.className = c.substring(0, i) + c.substring(i + cn.length);
		}
	}
};

var _l = S.Lang;

if(_isIE) {

	_l.iframeDoc = function(ifr) {
		return ifr.document;
	}

	_l.addEvent = function(_obj, _funcName, _func) {
		_obj.attachEvent("on" + _funcName, _func);
		return {
			remove: function() {
				_obj.detachEvent("on" + _funcName, _func);
				this.remove = undefined;
			}
		}
	}

	_l.getWndWidth = function() {
		return document.documentElement.offsetWidth;
	}

	_l.getWndHeight = function() {
		return document.documentElement.offsetHeight;
	}

	_l.getWndDimen = function() {
		return [ document.documentElement.offsetWidth, document.documentElement.offsetHeight ];
	}

	_l.getDraggable = function(evt) {
		var e = window.event.srcElement;
		var d = e.getAttribute("draggable");
		if(d) {
			return document.getElementById(d);
		}
		return false;
	}

	_l.getTargetElem = function(evt) {
		return window.event.srcElement;
	}

	_l.indexOf = function(arr, _text) {
		var l = arr.length;
		for(var ind = 0; ind < l; ind++) {
			if(arr[ind] == _text) {
				return ind;
			}
		}
		return -1;
	}

	document.onselectstart = function() { return _l._sel; } // ie

} else {

	_l.iframeDoc = function(ifr) {
		return ifr.contentDocument.documentElement;
	}

	_l.addEvent = function(_obj, _funcName, _func) {
		_obj.addEventListener(_funcName, _func, false);
		return {
			remove: function() {
				_obj.removeEventListener(_funcName, _func);
				this.remove = null;
			}
		}
	}

	_l.getWndWidth = function() {
		return window.innerWidth;
	}

	_l.getWndHeight = function() {
		return window.innerHeight;
	}

	_l.getWndDimen = function() {
		return [ window.innerWidth, window.innerHeight ];
	}

	_l.getDraggable = function(evt) {
		var e = evt.target;
		var d = e.getAttribute("draggable");
		if(d) {
			return $1(d);
		}
		return false;
	}

	_l.getTargetElem = function(evt) {
		return evt.target;
	}

	document.onmousedown = function() { return _l._sel; } // mozilla

	_l.indexOf = function(arr, _text) {
		return arr.indexOf(_text);
	}
}

S.Lang.getDataSet = function(e, key) {
	if(e.dataset) {
		return e.dataset[key];
	}
	var key = "data-" + key;
	return e.getAttribute(key) || "";
}

S.Lang.getKeyCode = function(e) {
	e = window.event || e;
	return e.keyCode ? e.keyCode : e.which;
}

});
