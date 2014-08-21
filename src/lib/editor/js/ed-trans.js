/**
 *  Translitre map window and words object definitions  
 *
 *  @author subburajan
 *  @date   march 2011
 *
 ****************************************************************************/

$2("ed-trans", ["xwindow", "translitre", "keyboard"], function(S) {

S.namespace("S.Ed");

S.Ed.TransMapXwnd = function(_id, _t, _trans) {
	this.id = _id;
	this.init(_t, _trans);
	return this;
}

S.Ed.TransMapXwnd.prototype = {
	init: function(_t, _trans) {
		var hi = new S.Desk.XWndHtmlInfo(this.id, 250, 300);
		hi.title = _t;
		hi.xheader = '<div class="trans-hdr">\
						<span>\
							<input id="' + this.id + '_sr_txt" type="text" class="search_trans_cz"/>\
						</span>\
						<span>\
							<input id="' + this.id + '_sr" type="image" class="ed_butt_cz" \
								src="' + S.IMG_PATH + '/butt/search.gif"/>\
						</span>\
					</div>';	
		hi.xbody = this._build_bdy(_trans);

		this.wnd = new S.Desk.XWindow(hi);
		var self = this;

		document.getElementById(this.id + "_sr").onclick = function() {
			self.search();
		}
		document.getElementById(this.id + "_sr_txt").onkeydown = function(e) {
			var ev = (e || window.event);
			ev.cancelBubble = true;
			if(e.keyCode == KeyCode.ENTER) {
				self.search();
			}
		}
		this.wnd.addOnCloseCB(function() { self.close(); });
	},

	_build_bdy: function(_trans) {
		var _html = "<div class='translitre_cz'><table class='text_13_cz'>";
		var eng = _trans[0]; //tamil_translitres[0];
		var _lang = _trans[1]; //tamil_translitres[1];
		var eng_w;
		for(var ind = 0; ind < eng.length; ind++) {
			eng_w = eng[ind];
			_html += "<tr id='_t" + eng_w + "'><td>" + eng_w + "</td><td>" + _lang[ind] + "</td></tr>";
		}
		_html += "</table></div>";
		return _html;
	},

	search: function() {
		var sid = "_t" + document.getElementById(this.id + "_sr_txt").value.trim();
		var rowe = document.getElementById(sid);
		if(rowe) {
			rowe.scrollIntoView();
			rowe.className = "trans_rowe_sel_cz";
			if(this.rowSel) {
				this.rowSel.className = "";
			}
			this.rowSel = rowe;
		}
	},

	close: function() {

	}
}

//---------------------------------------------------------------------------------
//	Translitre Words for languages
//---------------------------------------------------------------------------------

S.Ed.TransWords = function(_trans, _pro_) {
	this.eng = new S.Ed.Translitre(_trans[0]);
	this._lang = _trans[1];
	this.max_trans_ltrs = 5;
	this._pro = _pro_;
	return this;
}

S.Ed.TransWords.prototype = {
	to_lang: function(text) {
		var ind = this.eng.indexOf(text)
		if(ind != -1) {
			return this._lang[ind];
		}
	},

	to_eng: function(text) {
		var ind = this._lang.indexOf(text)
		if(ind != -1) {
			return this.eng.get(ind);
		}
	},

	to_lang_chars: function(txt) {
		var txt_size = txt.length; //text length
		var num_of_groups = this._pro.length; //available length
		var si = 0;
		var result = "";
		var grp_sel;
		var grp_res;
		var grp_no;
		while(si < txt_size) {
			grp_no = txt_size - si;
			if(grp_no > num_of_groups) {
				grp_no = num_of_groups;
			}
			do {
				grp_sel = txt.substring(si, si + grp_no);
				grp_no--;
				grp_res = this._pro[grp_no][grp_sel];
			} while(!grp_res);
			result += grp_res;
			si += grp_no + 1;
		}
		return result;
	},

	trans: function(engTxt) {
		engTxt = engTxt.trim().toLowerCase();
		var res = this.to_lang(engTxt);
		if(res) {
			return res;
		}

		res = this.to_lang_chars(engTxt);
		if(res) {
			return res;
		}
		return txt;
	}
};

//-------------------------------------------------------------------------
//	Language tools register
//-------------------------------------------------------------------------

S.namespace("S.Ed.Lang");

S.Lang.derive(S.Ed.Lang, {
	_init_ifnot: function(t) {
		if(t.words) {
			return;
		}
		var w = new S.Ed.TransWords(t._trans, t._pro);
		t.trans = function(engTxt) {
			return w.trans(engTxt);
		}
		t.words = w;
	},

	_createTransUi: function(_id, _t, _trans) {
		if(S.Desk.Wnd.showif(_id)) {
			return;
		}
		var tmap = new S.Ed.TransMapXwnd(_id, _t, _trans);
		S.Desk.Wnd.reg(tmap.wnd);
	},

	_createKb: function(_id, _html, _t, _w, _h) {
		var xwnd = S.Desk.Wnd.showif(_id);
		if(xwnd) {
			return xwnd._tmap;
		}

		var _hi = new S.Desk.XWndHtmlInfo(_id, _w, _h);
		_hi.title = _t;
		_hi.xbody = _html;

		var tmap = new S.Ed.Keyboard(_hi);
		tmap.wnd._tmap = tmap;
		S.Desk.Wnd.reg(tmap.wnd);
		return tmap;
	}
});

//------------------------------------------------------------------------------
// English 
//------------------------------------------------------------------------------

S.namespace("S.Ed.Lang.english");

S.Lang.derive(S.Ed.Lang.english, {
	transui: function() { return false },

	trans: function(engTxt) {
		return engTxt;
	},

	init_ifnot: function() { },

	kbui: function() { return false; },

	kbui_ext: function() { return false; }
});

});
