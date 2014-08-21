/**
 *  editor Util javascript function
 *
 *  @author subburajan
 *  @date   march 2011
 *
 ****************************************************************************/

$2("ed-util", ["lang"], function(S) {

S.Util = {

	uni2ent: function(srcTxt) {
		var entTxt = '';
		var c, hi, lo;
		var len = 0;
		for (var i=0, code; code=srcTxt.charCodeAt(i); i++) {
			var rawChar = srcTxt.charAt(i);
			// needs to be an HTML entity
			if (code > 255) {
				// normally we encounter the High surrogate first
				if (0xD800 <= code && code <= 0xDBFF) {
					hi  = code;
					lo = srcTxt.charCodeAt(i+1);
					// the next line will bend your mind a bit
					code = ((hi - 0xD800) * 0x400) + (lo - 0xDC00) + 0x10000;
					i++; // we already got low surrogate, so don't grab it again
				} else if (0xDC00 <= code && code <= 0xDFFF) {
					// what happens if we get the low surrogate first?
					hi  = srcTxt.charCodeAt(i-1);
					lo = code;
					code = ((hi - 0xD800) * 0x400) + (lo - 0xDC00) + 0x10000;
				}
				// wrap it up as Hex entity
				c = "\\u0" + code.toString(16).toUpperCase() + ';';
			} else {
				c = rawChar;
			}
			entTxt += c;
			len++;
		}
		return entTxt;
	},
	
	attach_resizer: function(_id) {
		var f;
		if(_isIE) {
			var _x = false;
			f = function() {
				if(_x) {
					return;
				}
				_x = !_x;
				document.getElementById(_id).style.height = document.documentElement.offsetHeight -
					document.getElementById("header_div").clientHeight - 
					document.getElementById("taskbar").clientHeight + 50;
			};
		} else {
			f = function() {
				document.getElementById(_id).style.height = document.body.offsetHeight -
					document.getElementById("header_div").clientHeight - 
					document.getElementById("taskbar").clientHeight
			}
		}
		S.Lang.addEvent(window, "resize", f);
		S.Lang.addEvent(window, "scroll", f);	
		f();
	},

	alignMenu: function(divid) {
		var mdiv = document.getElementById(divid);
		var ww = S.Lang.getWndWidth();
		//mdiv.style.left = ww - mdiv.clientWidth - 2;
	},

	setHeading: function(_h) {
		var hdr = document.createElement("div");
		hdr.className = "heading_cz";
		hdr.innerHTML = "<h1>" + _h + "</h1>";
		//document.getElementById("header_div").appendChild(hdr);
		return hdr;
	},
	
	isEnglishChar: function(ch) {
		return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
	}
	
};

});
