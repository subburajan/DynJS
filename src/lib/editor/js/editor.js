/**
 *  editor extended javascript function
 *
 *  @author subburajan
 *  @date   march 2011
 *
 ****************************************************************************/

$2("editor", ["editor-ext"], function(S) {

	/* 0-> title, 1->group, 2->language */

	S.namespace("S.Ed");

	S.Ed._user_lang = { "english": [ "Title", "Group", "Language" ], 
					"tamil": [ "\u0BA4\u0BB2\u0BC8\u0BAA\u0BCD\u0BAA\u0BC1", 
							   "\u0BA4\u0BCA\u0B95\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1",
							   "\u0BAE\u0BCA\u0BB4\u0BBF"
							 ]
				};

	S.Ed.init_groups = function(list) {
		this._grps = list;
	}

	S.Ed._get_grps_html = function() {
		if(!this._grps) {
			return "";
		}
		var grps = "";
		for(var key in this._grps) {
			grps += "<option value='" + key + "'>" + this._grps[key] + "</option>";
		}
		return grps;
	}

	S.Ed.put_group = function(_key, _val) {
		this._grps[_key] = _val;
	}

	S.Ed.remove_group = function(_key) {
		delete this._grps[_key];
	}

//-------------------------------------------------------------------------------
//  Xwindow html Information
//-------------------------------------------------------------------------------

	S.Ed.createEditor = function(_id, _title, _l) {
		_l = _l || "english";
		var ulang = this._user_lang[_l];	
		var hi = new S.Desk.XWndHtmlInfo(_id);
		hi.title = _title;
		hi.xheader = 
				'<div id="' + _id + '_ed_hdr" class="ed-hdr">\
					<div class="left">\
						<span class="title-lbl"><b>' + ulang[0] + '</b></span>\
						<span class="title-inp"><input id="' + _id + '_title" type="text" class="ed_title text_13_cz"/></span>\
						<span class="lang-lbl"><b>' + ulang[2] + '</b></span>\
						<select id="' + _id + '_lang">\
							<option value="english">English</option>\
							<option value="tamil">Tamil</option>\
						</select>\
					</div>\
					<div class="right">\
						<span><input type="image" class="ed_butt_cz" _evt="open_kb"\
							src="' + S.IMG_PATH + '/butt/keyboard_orig.gif"/></span>\
						<span><input type="image" class="ed_butt_cz" _evt="open_ext_kb"\
							src="' + S.IMG_PATH + '/butt/keyboard_incl.gif"/></span>\
						<span><input type="image" class="ed_butt_cz" _evt="open_transli"\
							src="' + S.IMG_PATH + '/butt/translitre.png"/></span>\
					</div>\
				</div>';
		hi.xfooter = 
				'<div class="ed-ftr">\
					<div class="left">\
						<span class="title-lbl"><b>' + ulang[1] + '</b></span>\
						<select id="' + _id + '_group" class="ed_group text_13_cz">' + this._get_grps_html() + '</select>\
					</div>\
					<div class="right">\
						<span><input type="image" class="ed_butt_cz" _evt="add_new_group"\
								src="' + S.IMG_PATH + '/butt/insert.gif"/></span>\
						<span><input type="image" class="ed_butt_cz" _evt="save_topic"\
								src="' + S.IMG_PATH + '/butt/save.png"/></span>\
					</div>\
				</div>';	
		hi.xbody = '<textarea id="' + _id + '_board" class="ed_board text_cz_13"></textarea>';

		var editor = new S.Ed._Editor(hi);
		editor._lang = _l;
		S.Desk.Wnd.reg(editor.wnd);

		editor.wnd.maximize_cb = editor.wnd.restore_cb = function() {
			var ta = $1(_id + "_board");
			ta.style.width = (ta.parentNode.clientWidth - 6) + "px";
		}
		editor.wnd.maximize_cb();

		return editor;
	}

//----------------------------------------------------------------------------------
//		_Editor Listener
//----------------------------------------------------------------------------------

/**
 * _Editor Listener
 */
function _EdListener(_app) {
	this.app = _app;
	return this;
}

_EdListener.prototype = {
	listen: function(_evt) {
		this[_evt]();
	},

	open_kb: function() {
		var kb = S.Ed.Lang[this.app._tlang].kbui();
		if(kb) {
			var self = this;
			kb.setOnWriteCB(function(txt) { self.app.insertTxt(txt) } );
		}
	},

	open_ext_kb: function() {
		var kb = S.Ed.Lang[this.app._tlang].kbui_ext();
		if(kb) {
			var self = this;
			kb.setOnWriteCB(function(txt) { self.app.insertTxt(txt) } );
		}
	},

	open_transli: function() {
		S.Ed.Lang[this.app._tlang].transui();
	},

	/**
	 *  Remote event
	 */
	save_topic: function() { 
		var title = this.app.titleFd.value.trim();
		if(title.length == 0) {
			alert("Please enter a title");
			return;
		}
		title = S.Util.uni2ent(title);

		var group = this.app.groupFd.options[this.app.groupFd.selectedIndex].value;
		//group = Util.uni2ent(group);
		var url = "/desk/" + group;
		if(this.app.contentId) {
			url += "/" + this.app.contentId;
		}
		url += "?title=" + escape(title);

		var val = this.app.board.value; 
		//var val = uni2ent(this.board.value);

		var self = this;
		S.Ajax.post(url, val, function(xmlHttp) {
			try {
				var result = eval( "(" + xmlHttp.responseText + ")");
				if(result.status == "success") {
					self.contentId = result.result[0];
					//var lblindx = result[1]
					alert(result.result[2]);
				} else {
					alert(result.reason[0] + "\n" + result.reason[1]);
				}
			} catch(e) {
				throw e;
			}
		});
	},

	add_new_group: function() {
		var group = this.app.groupFd.options[this.groupFd.selectedIndex].text;
		group = S.Util.uni2ent(group);	
	}
}

//-------------------------------------------------------------------------------
//	S.Ed._Editor appending function
//-------------------------------------------------------------------------------

S.Lang.derive(S.Ed._Editor.prototype, {

	setGroup: function(_gid) {
		var ops = this.groupFd.options;
		var opl = ops.length;
		for(var ind = 0; ind < opl; ind++) {
			if(ops[ind].value == _gid) {
				this.groupFd.selectedIndex = ind;
				break;
			}
		}
	},

	setId: function(_id) {
		this.contentId = _id;
	},

	setTitle: function(_title) {
		this.titleFd.value = _title;
	},

	setValue: function(_val) {
		this.board.value = _val;
	},

	setInfo: function(_gid, _id, _title, _val) {
		this.setGroup(_gid);
		this.contentId = _id;
		this.titleFd.value = _title;
		this.board.value = _val;
	},

//-------------------------------------------------------------------------------
//	initialize private functions
//-------------------------------------------------------------------------------

	_init_window: function() {
		if(_isIE) {
			var self = this;
			var f = function() {
				var state = new Object();
				with(self.board) {
					state.h = style.height;
					style.height = parentNode.offsetHeight;
					state.w = style.width;
					style.width = parentNode.offsetWidth - 15;
				}
				this._ot_state = state;
			}
			f();
			this.wnd.maxmize_cb = f;
			this.wnd.restore_cb = function(state) {
				with(self.board) {
					style.height = this._ot_state.h;
					style.width = this._ot_state.w;
				}
			}
		}
	},

	init_groups: function(groups) {
		var _html = "";
		for(var key in groups) {
			 _html += "<option value='" + key + "'>" + groups[key] + "</option>";
		}
		this.groupFd.innerHTML = _html;
	},

	_init_evts: function() {
		this._ev_hand = new _EdListener(this);
		var inps = this.wnd.wnddiv.getElementsByTagName("input");
		for(var i = 0; i < inps.length; i++) {
			this._init_evt(inps.item(i));
		}

		var self = this;
		var _lang = document.getElementById(this.getId() + "_lang");
		_lang.onchange = function() {
			self._tlang = _lang.options[_lang.selectedIndex].value;
			S.Ed.Lang[self._tlang].init_ifnot();
		};
		_lang.onchange();
	},

	_init_evt: function(inp) {
		var _evt = inp.getAttribute("_evt");
		if(_evt) {
			var self = this;
			inp.onclick = function() {
				self._ev_hand.listen(_evt);			
			}
		}
	},

	getId: function() {
		return this.wnd.wnddiv.id;
	}
});

});
