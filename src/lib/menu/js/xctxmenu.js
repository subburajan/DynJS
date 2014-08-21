/**
 *  Context menu 
 *
 *  @author subburajan
 *  @date   march 2011
 *
 ****************************************************************************/

$2("xctxmenu", ["lang"], function(S) {

	/**
	 * X Mouse Adapter, singleton
	 */
	var _mouse_adapter = new function() {
		document.oncontextmenu = function() { return false; }
		this._reg = [];
		var self = this;
		S.Lang.addEvent(document, "mousedown", function() {
			for(var ind = 0; ind < self._reg.length; ind++) {
				self._reg[ind].hide_ctx_menu();
			}
			return true;
		});

		if(_isIE) {
			this._mevt_map = {1: "mouse_left_bt", 4: "mouse_mid_bt", 2: "mouse_right_bt"};
			this._create_listnr = function(_ctxmenu) {
				var self = this;
				return function() {
					var _fn = self._mevt_map[window.event.button];
					if(_fn) {
						return self[_fn](window.event, window.event.srcElement, _ctxmenu);
					}
					return false;
				}
			}

		} else {
			document.captureEvents(Event.MOUSEDOWN || Event.MOUSEUP);
			this._mevt_map = [0, "mouse_left_bt", "mouse_mid_bt", "mouse_right_bt"];
			this._create_listnr = function(_ctxmenu) {
				var self = this;
				return function(evt) {
					var _fn = self._mevt_map[evt.which];
					if(_fn) {
						return self[_fn](evt, evt.target, _ctxmenu);
					}
					return false;
				}
			}
		}

		this.mouse_left_bt = function(evt, elem, _ctxmenu) {
			_ctxmenu.hide_ctx_menu();
			return true;
		}

		this.mouse_mid_bt = function(e) {
			return true;
		}

		this.mouse_right_bt = function(evt, elem, _ctxmenu) {
			_ctxmenu.show_ctx_menu(evt, elem);
			return false;
		}

		this.attach = function(_divid, _ctxmenu) {
			this._reg.push(_ctxmenu);
			var _d = document.getElementById(_divid);
			var _f = this._create_listnr(_ctxmenu);
			S.Lang.addEvent(_d, "mousedown", _f);
			S.Lang.addEvent(_d, "mouseup", _f);
		}
	};

//----------------------------------------------------------------------------
//	X Context Menu
//----------------------------------------------------------------------------

	S.namespace("S.UI");

	S.UI.XContextMenu = function(_id, _objid) {
		this._init(_id, _objid);
		return this;
	}

	S.UI.XContextMenu.prototype = {

		show_ctx_menu: function(e, elem) {
			this._div.style.visibility = "visible";
			this._setpos(e);
		},

		isvisible: function() {
			return this._div.style.visibility == "visible";
		},

		hide_ctx_menu: function() {
			this._div.style.visibility = "hidden";
		},

		load: function(cmenus) {
			var _html = '<table style="width:100%;cell-padding:2px">';
			for(var key in cmenus) {
				_html += '<tr><td id="' + key + '" type="menu" class="ctx_menu_cz"><p>' + cmenus[key] + '</p></td></tr>';
			}
			_html += '</table>';
			this._div.innerHTML = _html;
			this._init_menuitems();
		},

		_init: function(_id, _objid) {
			this._div = document.createElement("DIV");
			document.getElementById(_objid).appendChild(this._div);
			with(this._div) {
				id = _id;
				className = "ctx_menu_bar_cz shadow";
				var self = this;
				onmousedown = (_isIE)? function(evt) {
					self._invokeListnr(window.event.srcElement);
				}: function(evt) {
					self._invokeListnr(evt.target);
				}
			}
			this._attachToAdapter(_objid);
		},

		/**
		 * Add to right click menu
		 */
		_attachToAdapter: function(_objid) {
			_mouse_adapter.attach(_objid, this);
		},

		_init_menuitems: function() {
			var tds = this._div.getElementsByTagName("td");
			for(var ind = 0; ind < tds.length; ind++) {
				this._conf_menuitem(tds.item(ind));
			}
			//tds.item(tds.length - 1).className = "";
		},

		_conf_menuitem: function(td) {
			td.onmouseover = function() {
				this.style.backgroundColor = "1E5CC7";
				this.style.color = "white";
			}
			td.onmouseout = function() {
				this.style.backgroundColor = "white";
				this.style.color = "black";
			}
			td.onmouseout();
		},

		setListnr: function(_listnr) {
			this.listnr = _listnr;
		},

		_invokeListnr: function(elem) {
			this.hide_ctx_menu();
			var menuid = this._findMenuid(elem);
			if(menuid) {
				this.listnr.listen(menuid);
			}
		},

		_findMenuid: function(elem) {
			var did = this._div.id;
			do {
				if(elem.getAttribute("type") == "menu") {
					return elem.id;
				}
				elem = elem.parentNode;
			} while(elem.id != did);
			return false;
		}
	}

	S.UI.XContextMenu.prototype._setpos = (_isIE) ? function(e) {
		with(this._div.style) {
			top = (e.clientY + document.body.scrollTop) + "px";
			left = (e.clientX + document.body.scrollLeft) + "px";
		}
	}: function(e) {
		with(this._div.style) {
			top = (e.clientY + window.pageYOffset) + "px";
			left = (e.clientX + window.pageXOffset) + "px";
		}
	}

});
