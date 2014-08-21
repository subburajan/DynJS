/**
 *  Editor javascript function
 *
 *  @author subburajan
 *  @date   march 2011
 *
 ****************************************************************************/

$2("editor-ext", ["ed-lang-ta", "ed-util"], function(S) {

S.namespace("S.Ed");

var KeyCode = S.Lang.KeyCode;

S.Ed._Editor = function(_xwnd_hi) {	
	this.wnd = new S.Desk.XWindow(_xwnd_hi);
	this._init();
	return this;
}

S.Ed._Editor.prototype = {
	_init: function() {
		var _id = this.wnd.wnddiv.id;
		this.titleFd = document.getElementById(_id + "_title");
		this.groupFd = document.getElementById(_id + "_group");
		this.board = document.getElementById(_id + "_board");

		this._init_window();
		var self = this;
		this.board.onkeydown = function(e) { 
			var ev = (e || window.event);
			ev.cancelBubble = true;
			self._keydown(ev);
		}
		this._init_evts();
	},

	_keydown: function(e) {
		if(e.keyCode == KeyCode.SPACE || e.keyCode == KeyCode.ENTER) {
			this.showChoice();
		} else if(e.keyCode == KeyCode.ALT) {
			this.transCEndEngLtrs();
		} else if(e.keyCode == KeyCode.BACKSPACE) {
			//this.showTranslitr();
		}
	},

	showChoice: function() {
		this.experiment();
	},

	transCEndEngLtrs: function() {
		this._transCEndEngLtrs();
	},

	experiment: function() {
		/*if(document.selection) {
			this.experiment = _experimentIE;
			this.experiment();
		} else if(this.board.selectionStart) { //Firefox {
			this.experiment = _experimentOther;
			this.experiment();
		} else {
			this.board.value += "#Implementation pending#";
		}*/
		this._experiment();
	},

	findTamTransTxt: function(engTxt) { //during 'SPACE' key press
		return S.Ed.Lang[this._tlang].trans(engTxt.trim());
	},

	findTamTransCh: function(engTxt) { //during 'ESC' key press
		return S.Ed.Lang[this._tlang].trans(engTxt.trim());
	}

	/*_Editor.prototype.insertTxt = function(txt) {
		if(document.selection) {
			this.insertTxt = _insertTxtIE;
			this.insertTxt(txt);
		} else if(this.board.selectionStart) { //Firefox {
			this.insertTxt = _insertTxtOther;
			this.insertTxt(txt);
		} else {
			this.board.value += txt;
		}
		this._insertTxt(txt);
	}*/
}

//-------------------------------------------------------------------------------
//	Private definitions
//-------------------------------------------------------------------------------

var browser_specific = (_isIE)? {
	/**
	 * IE 
	 */	
	_experiment: function() {
		this.board.focus();
		var sel = document.selection.createRange();
		sel.text = "#Implementation pending#";
		this.board.focus();
	},

	_insertTxtIE: function(txt) {
		this.board.focus();
		var sel = document.selection.createRange();
		sel.text = txt;
		this.board.focus();
	},

	insertTxt: function(txt) {
		this._insertTxtIE(txt);	
	}
}: 
{
	/**
	 * Other 
	 */
	_experiment: function() {
		if(this.board.selectionStart != this.board.selectionEnd) {
			return;
		}
		var boardValue = this.board.value;
		var targetChar = boardValue.charAt(this.board.selectionStart - 1);
		if(!S.Util.isEnglishChar(targetChar)) {
			return;
		}

		var testStartPos = this.board.selectionStart - 1;

		while(testStartPos > 0 && boardValue.charAt(--testStartPos) != " ");

		var testEndPos = this.board.selectionEnd;
		var scrollTop = this.board.scrollTop;

		var currentTxt = boardValue.substring(testStartPos, this.board.selectionStart);	
		var transTxt = this.findTamTransTxt(currentTxt);
		if(testStartPos > 0) {
			transTxt = " " + transTxt;
		}

		this.board.focus();
		this.board.value = boardValue.substring(0, testStartPos) + transTxt + 
								boardValue.substring(this.board.selectionEnd);

		this.board.selectionStart = testStartPos + transTxt.length;
		this.board.selectionEnd = this.board.selectionStart;

		this.board.scrollTop = scrollTop;
	},

	_insertTxtOther: function(_txt) {
		var boardValue = this.board.value;
		var testStartPos = this.board.selectionStart;
		var testEndPos = this.board.selectionEnd;
		var scrollTop = this.board.scrollTop;

		this.board.focus();
		this.board.value = boardValue.substring(0, testStartPos) + _txt + 
								boardValue.substring(this.board.selectionEnd);

		this.board.selectionStart = testStartPos + _txt.length;
		this.board.selectionEnd = this.board.selectionStart;

		this.board.scrollTop = scrollTop;
	},

	insertTxt: function(txt) {
		this._insertTxtOther(txt);
	},	

	/**
	 * find cursor ending english characters
	 */
	_transCEndEngLtrs: function() {
		if(this.board.selectionStart != this.board.selectionEnd) {
			return;
		}
		var boardValue = this.board.value;

		var targetChs = "", tch = "";
		var testStartPos = this.board.selectionStart; 
		do {
			testStartPos --;
			targetChs = tch + targetChs;
			tch = boardValue.charAt(testStartPos);
		} while(S.Util.isEnglishChar(tch));
		testStartPos++;

		if(targetChs.length == 0) {
			return;
		}

		var testEndPos = this.board.selectionEnd;
		var scrollTop = this.board.scrollTop;

		var transTxt = this.findTamTransCh(targetChs);

		this.board.focus();
		this.board.value = boardValue.substring(0, testStartPos) + transTxt + 
								boardValue.substring(this.board.selectionEnd);

		this.board.selectionStart = testStartPos + transTxt.length;
		this.board.selectionEnd = this.board.selectionStart;

		this.board.scrollTop = scrollTop;	
	}
}

S.Lang.derive(S.Ed._Editor.prototype, browser_specific);

});
