/**
 *
 * Smyle Developer common
 *
 * @author Subburajan Mayilandan
 * @date   September 2012
 *
 ***************************************************************************************8***/
 
$2("sw-overlay", ["sw-common"], function(S) {

	var ESCAPE = 27;
	
	S.Overlay = {
		open: function(id, title, butts) {
			var div = document.createElement("DIV");
			div.className = "ol shadow";
			div.innerHTML = "<div class='ol-hdr'><span class='ol-title'>" + title + "</span></div>\
							<div class='ol-body'><div id='" + id + "'></div></div>";
			var self = this;
			if(butts.length > 0) {
				var l = butts.length;				
				var ftr = document.createElement("DIV");
				ftr.className = "ol-ftr";
				for(var i = 0; i < l; i++) {
					var butt = butts[i];
					this._configureButt(id, butt, ftr);
				}
				div.appendChild(ftr);
			}
			
			var closeSpan = document.createElement("SPAN");
			closeSpan.className = "ol-close";
			closeSpan.appendChild(document.createTextNode("X"));
			div.childNodes.item(0).appendChild(closeSpan);			
			closeSpan.onclick = function() {
				self.close(id);
			}
			
			this.hideBG(id);
			div.style.zIndex = 200;
			document.body.appendChild(div);			
			document.body.onkeydown = function(e) {
				var kc = S.Lang.getKeyCode(e);
				if(kc == ESCAPE) {
					self.close(id);
				}
			}
			return $1(id);
		},
		
		_configureButt: function(id, butt, ftr) {
			var self = this;
			var span = document.createElement("span");
			span.className = "butt butt-blue ol-butt";
			var a = document.createElement("A");
			a.href = "javascript:void(0)";
			a.appendChild(document.createTextNode(butt.name));
			span.appendChild(a);
			span.onclick = function() {
				var div = self.getCntr(id);
				S.Busy.start(div);
				butt.event(function(isOk, msg, _close) {
					var msgSpan = getMsgSpan(ftr);					
					if(isOk) {
						msgSpan.className = "ol-msg";
					} else {
						msgSpan.className = "ol-err";
					}
					msgSpan.firstChild.nodeValue = msg;
					S.Busy.stop(div);
					if(_close) {
						self.close(id);
					}
				});
			}
			ftr.appendChild(span);
		},
		
		hideBG: function(id) {
			var e = document.body;
			var div = document.createElement("DIV");
			div.className = "busy";
			div.style.left = "0px";
			div.style.top = "0px";
			div.style.width = e.clientWidth + "px";
			div.style.height = e.clientHeight + "px";
			e.appendChild(div);
			div.id = id + "_hide";
			div.style.zIndex = 100;
		},
		
		close: function(id) {
			var e = this.getCntr(id);
			e.parentNode.removeChild(e);
			e = $1(id + "_hide");
			e.parentNode.removeChild(e);			
		},
		
		getCntr: function(id) {
			return e = $1(id).parentNode.parentNode;		
		}
	}
	
	function getMsgSpan(ftr) {
		var spans = ftr.getElementsByTagName("span");
		if(spans.length > 0) {
			var span = spans.item(0);
			var cn = span.className;
			if(cn == "ol-msg" || cn == "ol-err") {
				return span;
			}
		}
		var span = document.createElement("span");
		span.appendChild(document.createTextNode(""));
		ftr.insertBefore(span, ftr.firstChild);	
	    span.className = "ol-msg";
	    return span;
	}

});

