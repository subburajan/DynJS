/**
 *
 * Smyle Developer common
 *
 * @author Subburajan Mayilandan
 * @date   September 2012
 *
 ***************************************************************************************8***/

$2("sw-common", ["lang"], function(S) {

	var Busy = {

		start: function() {
			var l = arguments.length;
			if(l == 0) {
				throw "Atleast one argument expected";
			}
			for(var i = 0; i < l; i++) {
				this._start(arguments[i]);
			}
		},

		_start: function(id) {
			if(this.isBusy(id)) {
				return;
			}
			var e = $1(id);
			//e.style.position = "relative";
			var div = document.createElement("DIV");
			e.setAttribute("_busy", this._newId(div));
			div.className = "busy";
			div.style.left = "0px";
			div.style.top = "0px";
			div.style.width = e.clientWidth + "px";
			div.style.height = e.clientHeight + "px";
			div.innerHTML = "<img src='/ui/sw/_images/common/busy.gif'>";
			e.appendChild(div);
		},

		stop: function() {
			var l = arguments.length;
			if(l == 0) {
				throw "Atleast one argument expected";
			}
			for(var i = 0; i < l; i++) {
				this._stop(arguments[i]);
			}
		},

		_stop: function(id) {
			var e = $1(id);
			if(e.hasAttribute("_busy")) {
				be = $1(e.getAttribute("_busy"));
				if(be) {
					be.parentNode.removeChild(be);
				}
				e.removeAttribute("_busy");
			}
		},

		isBusy: function(id) {
			return $1(id).hasAttribute("_busy");
		},

		_newId: function(div) {
			return div.id = "busy_" + (this._id++);
		},

		_id: 1
	}

	S.Busy = Busy;

	S.namespace("S.Common");

	S.Common.blurOut = function(elem, cb, _chkcnt) {
		var ev = S.Lang.addEvent(document.body, "click", function(e) {
			var t = S.Lang.getTargetElem(e);
			if(elem != t && !S.Common.isChild(t, elem, _chkcnt)) {
				cb();
				ev.remove();
			}
		});
	}

	S.Common.isChild = function(c, parent, _chkcnt) {
		var b = document.body;
		if(parent == c || c == b) return false;
		_chkcnt = _chkcnt || 5;
		do {
			c = c.parentNode;
			if(c == b) {
				return false;
			}
		} while(c != parent && _chkcnt-- > 0);
		return c == parent;
	}

});

