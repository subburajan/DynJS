/**
 *  Button functions
 *
 *  @author subburajan
 *  @date   march 2011
 *
 ****************************************************************************/

$2("xbutton", ["lang"], function(S) {

	S.namespace("S.UI");

	S.UI.XButton = function(_idOrObj, _cmd, _title) {
		var _span = S.Lang.getObj(_idOrObj);
		this.cmd = _cmd || _span.getAttribute("_cmd");

		_title = _title || _span.title;
		_title = _title.replace(/\s/g, '&nbsp;');
		_span.className = "butt-s1 butt-blue";
		_span.innerHTML = '<a href="javascript:void(0)">' + _title + '</a>';

		var self = this;
		S.Lang.addEvent(_span, "mousedown", function() {
			_img.style.border = "2px solid white";
			self._fireEvent();
		});
		S.Lang.addEvent(_span, "mouseup", function() {
			_img.style.border = "2px solid black";
		});
		this.obj = _span;
		return this;
	}

	S.UI.XButton.prototype = {
		addListnr: function(_f) {
			if(!this._listnrs) {
				this._listnrs = [];
			}
			this._listnrs.push(_f);
		},

		_fireEvent: function() {
			if(this._listnrs) {
				for(var i = 0; i < this._listnrs.length; i++) {
					this._listnrs[i](this.cmd);
				}
			}
		}
	};

//-------------------------------------------------------------------------------
//	 Factory methods
//-------------------------------------------------------------------------------

	S.UI.Butt = {
		_def_left: "5px",

		create: function(_idOrObj, _cmd, _title, _listnr) {
			var butt = new S.UI.XButton(_idOrObj, _cmd, _title);
			_listnr = _listnr || function() { };
			butt.addListnr(_listnr);
			return butt;
		},

		createMany: function(_idOrObj, _listnr) {
			_idOrObj = S.Lang.getObj(_idOrObj);
			_idOrObj.className = "butt_grp_cz";
			_listnr = _listnr || function() { };
			var _gc = _idOrObj.childNodes;
			var _span, _butt;
			var butts = [];
			for(var i = 0; i < _gc.length; i++) {
				var _span = _gc.item(i);
				if(_span.tagName == "SPAN" && _span.getAttribute("_cmd")) {			
					_butt = new S.UI.XButton(_span);
					_butt.addListnr(_listnr);
					butts.push(_butt);
				}
			}
			return butts;
		}
	}

	S.UI.Butt._def_top = (_isIE)? "5px" : "-10px";

});
