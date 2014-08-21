/**
 *  web os, parent to xtaskbar and xdesktop javascript
 *
 *  @author subburajan
 *  @date   march 2011
 *
 ****************************************************************************/

$2("dnp", ["base"], function(S) {

	/**
	 * @ Drag and Pan constructor
	 */
	S.Dnp = function DragAndPan(_idOrObj) {
		this.panel = S.Lang.getObj(_idOrObj);
		this._init();
		return this;
	}

	var _dnp = S.Dnp;

	if(_isIE) {
		_dnp.prototype = {
			grap: function(evt) {
				this._grap(window.event.srcElement, window.event);
			},

			drop: function(evt) {
				this._drop(window.event);
			}
		}
	} else {
		_dnp.prototype = {
			grap: function(evt) {
				this._grap(evt.target, evt);
			},

			drop: function(evt) {
				this._drop(evt);
			}
		}
	}

	var _dnpp = _dnp.prototype;

	_dnpp._init = function() {
		var self = this;
		this.panel.onmousedown = function(evt) { self.grap(evt); };
		this.panel.onmousemove = function(evt) { self.drag(evt); };
		this.panel.onmouseup = function(evt) { self.drop(evt); };
	}

	_dnpp._grap = function(tr, e) {
		if(tr == this.panel) {
			this.grapped = true;
			this._scx = e.clientX;
		}
	}

	_dnpp.drag = function(tr, e) {

	}

	_dnpp._drop = function(e) {
		if(!this.grapped) {
			return;
		}
		var dx = e.clientX - this._scx;
		/*with(this.panel.style) {
			left = parseInt(left.replace("px")) + dx;
		}
		*/
		this._scx = 0;
		this.grapped = false;
	}

});
