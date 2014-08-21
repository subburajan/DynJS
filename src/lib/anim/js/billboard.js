
/**
 *  Ajax methods
 *
 *  @author subburajan
 *  @date   march 2011
 *
 ****************************************************************************/
 
$2("billboard", ["lang"], function(S) {
 
 	function CircularIterator(arr) {
 		this.arr = arr;
 		this.i = -1;
 		return this;
 	}
 	
 	CircularIterator.prototype = {
 		next: function() {	
 			if(this.i == this.arr.length - 1) {
 				this.i = -1;
 			}
 			this.i++;
 			return this.arr[this.i];
 		},
 		current: function() {
 			if(this.i > -1) {
 				return this.arr[this.i];
 			}
 		},
 		previous: function() {
 			if(this.i <= 0) {
 				this.i = this.arr.length;
 			}
 			this.i--;
 			return this.arr[this.i];
 		}
 	}
	
	function BillBoard(idOrObj, iclassArr) {
		this.div = S.Lang.getObj(idOrObj);
		this.pieces = 55;
		this.delay1 = 3000;
		this.delay2 = 50;
		this._create(iclassArr);
		return this;
	}
	
	BillBoard.prototype = {
		_create: function(iclassArr) {
			this.itr = new CircularIterator(iclassArr);
			var d = this.div;
			var n = this.pieces;
			var cwid = d.clientWidth/n;
			var bp = 0;
			var c = this.itr.next();
			for(var i = 0; i < n; i++) {
				var cd1 = document.createElement("DIV");
				cd1.style.width = cwid + "px";
				cd1.style.backgroundPosition = bp + "px 0px";
				cd1.className = c;
				d.appendChild(cd1);

				var cd2 = document.createElement("DIV");
				cd2.style.width = "0px";
				cd2.style.backgroundPosition = bp + "px 0px";
				cd2.className = c;
				d.appendChild(cd2);

				bp -= cwid;
			}
		},
		
		start: function() {
			this._animate(this.delay1, this.delay2);
		},

		_animate: function(delay1, delay2) {
			var d = this.div;
			var cns = d.getElementsByTagName("DIV");
			var n = cns.length;
			var cwid = (d.clientWidth/(n/2));
			var ccwid = cwid / 10;
			var ow = cns.item(0).clientWidth;
			var ew = cns.item(1).clientWidth;
			d.style.width = d.clientWidth + 20;

			this.odd = true;
			var delay = delay2;
			function anim2() {
				window.setTimeout(function() {
					if(ow == 0) {
						ccwid = -ccwid;
					}
					ow -= ccwid;
					ew += ccwid;
					for(var i = 0; i < n; i+=2) {
						cns.item(i).style.width = ow + "px";
						cns.item(i + 1).style.width = ew + "px";
					}
					if(ew == 0) {
						ccwid = -ccwid;
					}
					delay = delay2;
					if(ew == 0 || ow == 0) {
						delay = delay1;
						switchClass();
					}
					anim2();
				}, delay);
			}
			anim2();
			
			var self = this;
			function switchClass() {
				var k = 1;
				if(self.odd) {
					k = 0;	
				}
				self.odd = !self.odd;
				var c = self.itr.next();
				for(var i = k; i < n; i+=2) {
					cns.item(i).className = c;
				}
			}
		}
	}
	
	S.namespace("S.Anim");
	S.Anim.BillBoard = BillBoard;
	
});
