/**
 *  web os, parent to xtaskbar and xdesktop javascript
 *
 *  @author subburajan
 *  @date   march 2011
 *
 ****************************************************************************/

$2("dnd", ["base", "lang"], function(S) {

	/**
	 * @ Drag and Drop constructor
	 */
	S.Dnd = function(_idOrObj) {
		this.panel = S.Lang.getObj(_idOrObj);
		this._init();
		return this;
	}

	var _dnd = S.Dnd;

	if(_isIE) {
		_dnd.prototype = {
			grap: function(evt) {
				var tg = window.event.srcElement.getAttribute("draggable");
				if(this._grap(tg, window.event) == 2) {
					this.x1 = 0;
					this.y1 = 0;
					this.x2 = document.documentElement.offsetWidth;
					this.y2 = document.documentElement.offsetHeight;	
				}
			},

			drag: function(evt) {
				this._drag(window.event);
			},

			drop: function(evt) {
				this.target = false;
			}
		}
	} else {
		_dnd.prototype = {
			grap: function(evt) {
				var tg = evt.target.getAttribute("draggable");
				if(this._grap(tg, evt) == 2) {
					this.x1 = 0;
					this.y1 = 0;
					this.x2 = window.innerWidth;
					this.y2 = window.innerHeight;
				}
			},

			drag: function(evt) {
				this._drag(evt);
			},

			drop: function(evt) {
				this.target = false;
			}
		}
	}

	var _dndp = _dnd.prototype;

	_dndp._init = function() {
		var self = this;
		this.panel.onmousedown = function(evt) { self.grap(evt); };
		this.panel.onmousemove = function(evt) { self.drag(evt); };
		this.panel.onmouseup = function(evt) { self.drop(evt); };
	}

	_dndp._grap = function(t, e) {
		if(t) {
			this.target = $1(t);
			this.dX = e.clientX - parseInt(this.target.style.left.replace("px"));
			this.dY = e.clientY - parseInt(this.target.style.top.replace("px"));
			var vp = this.target.getAttribute("viewport");
			if(vp) {
				vp = $1(vp);
				if(vp) {
					var cw = this.target.clientWidth;
					var ch = this.target.clientHeight;
					with(vp.style) {
						this.x1 = ((left != "")? parseInt(left.replace("px")): 0) + cw;
						this.y1 = ((top != "")? parseInt(top.replace("px")): 0) + ch;
					}
					this.x2 = this.x1 + vp.clientWidth - cw;
					this.y2 = this.y1 + vp.clientHeight - ch;
					return 1;
				}
			}
			return 2;
		}
		return false;
	}

	_dndp._drag = function(e) {
		if(this.target && e.clientX > this.x1 && e.clientY > this.y1 
					   && e.clientX < this.x2 && e.clientY < this.y2) {
			this.target.style.left = (e.clientX - this.dX) + "px";
			this.target.style.top = (e.clientY - this.dY) + "px";
		}
	}

});
