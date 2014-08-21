/**
 *  Keyboard object definitions  
 *
 *  @author subburajan
 *  @date   march 2011
 *
 ****************************************************************************/

$2("keyboard", ["xwindow"], function(S) {

	S.namespace("S.Ed");

	S.Ed.Keyboard = function(_hi) {
		this.init(_hi);
		return this;
	}

	S.Ed.Keyboard.prototype = {
		init: function(_hi) {
			var _id = _hi.wnddiv.id;
			_hi.xbody = "<table id='" + _id + "_ltrs' class='langkb_cz text_13_cz'>" + _hi.xbody + "</table>";
			_hi.xbody += 
					"<div class='kb_ftr_cz'>\
						<div class='left'>\
							<span><input type='text' class='kbtext_cz' id='" + _id + "_inp'></input></span>\
						</div>\
						<div class='right'>\
							<span><input id='" + _id + "_write' type='image' class='kbimgbutt_cz' src='" + S.IMG_PATH + "/butt/add.png'/></span>\
							<span><input id='" + _id + "_clear' type='image' class='kbimgbutt_cz' src='" + S.IMG_PATH + "/butt/subtract.png'/></span>\
							<span><input id='" + _id + "_transli' type='image' class='kbimgbutt_cz' src='" + S.IMG_PATH + "/butt/transli_text.png'/></span>\
							<span><input id='" + _id + "_ucode' type='image' class='kbimgbutt_cz' src='" + S.IMG_PATH + "/butt/ucode_text.png'/></span>\
						<div>\
					</div>";

			this.wnd = new S.Desk.XWindow(_hi);

			this.txtfield = document.getElementById(_id + "_inp");
			var self = this;

			var _write = document.getElementById(_id + "_write");
			_write.onclick = function(evt) {
				self._setOnWriteCB(self.txtfield.value);
				S.Desk.Taskbar.setActive(_id, false);
			}

			var _transli = document.getElementById(_id + "_transli");
			_transli.onclick = function(evt) {
				alert("transli impl pending");
			}
			var _ucode = document.getElementById(_id + "_ucode");	
			_ucode.onclick = function(evt) {
				alert("ucode impl pending");
			}	

			var _clear = document.getElementById(_id + "_clear");
			_clear.onclick = function(evt) {
				self.txtfield.value = "";
			}

			var table = document.getElementById(_id + "_ltrs");
			table.onclick = function(evt) {
				evt = _checkKBEvt(evt);
				if(evt) {
					//self.txtfield.value += evt.target.firstChild.nodeValue;
					self.insertTxt(evt.target.firstChild.nodeValue);
				}
			}

			var self = this;
			this.wnd.addOnCloseCB(function() {	self.close(); });
		},

		setOnWriteCB: function(_cb) {
			this._setOnWriteCB = _cb;
		},

		insertTxt: function(txt) {
			this.board = this.txtfield;
			if(document.selection) {
				this.insertTxt = _insertTxtIE;
				this.insertTxt(txt);
			} else if(this.board.selectionStart) { //Firefox 
				this.insertTxt = _insertTxtOther;
				this.insertTxt(txt);
			} else {
				this.board.value += txt;
			}	
		},

		close: function() {

		}
	}

	function _insertTxtIE(txt) {
		this.board.focus();
		var sel = document.selection.createRange();
		sel.text = txt;
		this.board.focus();
	}

	function _insertTxtOther(_txt) {
		var boardValue = this.board.value;
		var testStartPos = this.board.selectionStart;		
		var testEndPos = this.board.selectionEnd;
		//var scrollTop = this.board.scrollTop;

		this.board.focus();
		this.board.value = boardValue.substring(0, testStartPos) + _txt + 
								boardValue.substring(this.board.selectionEnd);

		this.board.selectionStart = testStartPos + _txt.length;
		this.board.selectionEnd = this.board.selectionStart;
		//this.board.scrollTop = scrollTop;
	}

	function _checkKBEvt(evt) {
		evt = evt || window.event;
		if(evt.target &&  evt.target.firstChild) {
			var tname = evt.target.tagName.toUpperCase();
			if(tname == "TD" || tname == "TH") {
				return evt;
			}
		}
		return false;
	}

});
