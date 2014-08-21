/**
 *  XTree javascript function
 *
 *  @author subburajan
 *  @date   march 2011
 *
 ****************************************************************************/

$2("xtree", ["lang"], function(S) {

	S.namespace("S.UI");

	/**
	 * XTree object definition
	 */
	S.UI.XTree = function(_idOrObj) {
		this.div = S.Lang.getObj(_idOrObj);
		this._init();
		return this;
	}

	S.UI.XTree.prototype = {

	add: function(list, _par) {
		if(!_par || _par == this.div.id) {
			this._add_to_par(list, this.div);
		} else {
			this._add_to_li(list, document.getElementById(this._id_prfx + _par));
		}
	},

	remove: function(_id) {
		var obj = document.getElementById(this._id_prfx + _id);
		if(!obj	) {
			return;
		}
		var obj_par = obj.parentNode;
		obj_par.removeChild(obj);
		if(obj_par.childNodes.length == 0) {
			this._remove_ul(obj_par);
		}
	},

	size: function() {
		return this.div.getElementsByTagName("li").length;
	},

	getKey: function(indx) {
		var list = this.div.getElementsByTagName("li");
		if(indx <= list.length) {
			return list.item(indx).id.substring(this._id_prfx.length);
		}
	},

	getValue: function(_id) {
		var li = document.getElementById(this._id_prfx + _id);
		var title = li.getElementsByTagName("span").item(0).innerHTML;
		var i = title.lastIndexOf("&nbsp;");
		return title.substring(i + 6);
	},

	getNode: function(_id) {
		return document.getElementById(this._id_prfx + _id);
	},

	setHandler: function(_handler) {
		this.handler = _handler;
	},

	open: function(_id) {
		var li = this._listenif(_id, "close");
		if(li) {
			var par = li.parentNode;
			var ul;
			while(par != this.div) {
				if(par.tagName == "LI") {
					par.className = par.className.replace("close", "open");
					ul = document.getElementById(par.id + "_ul");
					ul.style.display = "";
				}
				par = par.parentNode;
			}
		}
	},

	close: function(_id) {
		this._listenif(_id, "open");
	},

	getNodeid: function(_id) {
		return _id.substring(this._id_prfx.length);
	},

//--------------------------------------------------------------------------------
//  Private functions
//--------------------------------------------------------------------------------

	_init: function() {
		this._mar_left = (_isIE) ? "20px": "-20px";
		this._id_prfx = this.div.id + "_";
		this.div.className += " xtree_cz";
		this._space_folder = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		this._space_file = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		this._init_actions();
	},

	_add_to_par: function(list, par) {
		var ul = document.createElement("ul");
		var _html = this._form_html(list);
		ul.innerHTML = _html;
		par.appendChild(ul);
		ul.style.marginLeft = this._mar_left;
		ul.setAttribute("id", par.id + "_ul");
	},

	_add_to_li: function(list, par) {
		if(par.className.indexOf("file") > -1) {
			par.className = par.className.replace("file", "folder");
			par.innerHTML = this._form_uls(par.id, par.title) + this._form_html(list) + "</ul>";
		} else {
			var par_ul = document.getElementById(par.id + "_ul");
			par_ul.innerHTML += this._form_html(list);
		}
	},

	_remove_ul: function(ul) {
		var li = ul.parentNode;
		li.removeChild(ul);
		li.className = li.className.replace("folder", "file");
		li.innerHTML = this._form_lis(li.id, li.title);
	},

	_form_html: function(list) {
		var _html = "";
		var li, _id;
		for(var key in list) {
			li = list[key];
			_id = this._id_prfx + key;
			_html += "<li id='" + _id + "' url='" + li[0] + "' title='" + li[1] + "' class='";
			if(li.length == 2) {
				_html += "file_close_cz'>" + this._form_lis(_id, li[1]) + "</li>";
			} else {
				_html += "folder_close_cz'>" + this._form_uls(_id, li[1]);
				_html += this._form_html(li[2]) + "</ul></li>";
			}
		}
		return _html;
	},

	_form_lis: function(_id, lbl) {
		return "<a href='javascript:void(0)' _href='fresh_open'><span>" + 
				this._space_file + lbl + "</span></a>";
	},

	_form_uls: function(_id, lbl) {
		return "<a href='javascript:void(0)' _href='exp_coll'><span>" + 
				this._space_folder + "</span></a>\
				<a href='javascript:void(0)' _href='fresh_open'>" + lbl + 
				"</a><ul id='" + _id + "_ul' style='display:none;margin-left:" + 
				this._mar_left + "'>";
	},

	_init_actions: function() {
		var self = this;
		this.div.onclick = _isIE ? function() { self._listen(window.event.srcElement); }
				: function(e) { self._listen(e.target); }
	},

	_listen: function(_ap) {
		if(_ap.tagName == "A") {
			var fn = _ap.getAttribute("_href");
			this["_" + fn](_ap.parentNode);
		} else if(_ap.parentNode.tagName == "A") {
			_ap = _ap.parentNode;
			var fn = _ap.getAttribute("_href");
			this["_" + fn](_ap.parentNode);		
		}
	},

	_listenif: function(_id, _if) {
		var li = document.getElementById(this._id_prfx + _id);
		if(li.className.indexOf(_if) > -1) {
			var _a = li.getElementsByTagName("a").item(0)
			var fn = _a.getAttribute("_href");
			this["_" + fn](li);
			return li;
		}
		return false;
	},

	_fresh_open: function(_li) {
		if(_li.className.indexOf("close") > -1) {
			_li.className = _li.className.replace("close", "open");
			if(_li.className.indexOf("folder") != -1) {
				document.getElementById(_li.id + "_ul").style.display = "";
			}
			if(this.handler) {
				var url = _li.getAttribute("url");
				var id = _li.id.substring(this._id_prfx.length);
				var l = this._getlevel(_li);
				if(l == 3) {
					if(this._prev) {
						this._prev.className = this._prev.className.replace("open", "close");
					}			
					this._prev = _li;
				}
				this.handler(url, id, l);
			}
		}
	},

	_getlevel: function(_li) {
		var l = 1;
		par = _li.parentNode;
		while(par != this.div) {
			if(par.tagName == "LI") {
				l++;
			}
			par = par.parentNode;
		}
		return l;
	},

	_exp_coll: function(_li) {
		if(_li.className.indexOf("open") > -1) {
			_li.className = _li.className.replace("open", "close");
			document.getElementById(_li.id + "_ul").style.display = "none";
		} else {
			_li.className = _li.className.replace("close", "open");
			document.getElementById(_li.id + "_ul").style.display = "";
		}
	}

};

});
