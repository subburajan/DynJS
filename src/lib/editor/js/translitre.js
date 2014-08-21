/**
 *  Translitre object definitions  
 *
 *  @author subburajan
 *  @date   march 2011
 *
 ****************************************************************************/

$2("translitre", ["base"], function(S) {

	S.namespace("S.Ed");

	S.Ed.Translitre = function(arr) {
		this._init(arr);
		return this;
	}

	S.Ed.Translitre.prototype = {
		_init: function(arr) {
			this.parent = new Node(".", -1);
			for(var ind = 0; ind < arr.length; ind++) {
				this.parent.add("." + arr[ind], ind);
			}
		},

		indexOf: function(_text) {
			return this.parent.indexOf("." + _text);
		},

		get: function(indx) {

		}
	}

	function Node(_text, _indx) {
		this.text = _text;
		this.indx = _indx;
		return this;
	}

	Node.prototype = {
		add: function(_text, _indx) {
			var i = 0;
			while(i < _text.length && i < this.text.length &&
						(this.text.charAt(i) == _text.charAt(i))) {
				i++;
			}

			if(i > 0) {
				if(i == _text.length) {
					return true;
				}

				if(i < this.text.length) {
					var _sub_text = this.text.substring(i);
					this.text = this.text.substring(0, i);

					var new_child = new Node(_sub_text, this.indx);
					new_child.childs = this.childs

					this.childs = [];
					this.childs.push(new_child);
					this.childs.push(new Node(_text.substring(i), _indx));
					this.indx = -1;
					return true;
				}

				var _sub_text = _text.substring(i);
				if(!this.childs) {
					this.childs = [new Node(_sub_text, _indx)];
					return true;
				}
				var s = this.childs.length;
				for(var j = 0; j < s; j++) {
					if(this.childs[j].add(_sub_text, _indx)) {
						return true;
					}
				}
				this.childs.push(new Node(_sub_text, _indx));
				return true;
			}
			return false;
		},

		indexOf: function(_text) {
			if(this.text == _text) {
				return this.indx;
			}

			var prefix = _text.substring(0, this.text.length);
			var suffix = _text.substring(this.text.length);
			var _indx = -1;

			if(this.childs && prefix == this.text) {
				var s = this.childs.length;
				for(var ind = 0; ind < s; ind++) {
					_indx = this.childs[ind].indexOf(suffix);
					if(_indx > -1) {
						return _indx;
					}
				}
			}
			return _indx;
		},

		serialize: function(list) {
			this._serialize("", list);
		},

		_serialize: function(prefix, list) {
			if(this.indx > -1) {
				list.push(prefix + this.text);
			}
			var txt = prefix + this.text;
			if(this.childs) {
				for(var ind = 0; ind < this.childs.length; ind++) {
					this.childs[ind]._serialize(txt, list);
				}
			}
		},

		print: function(sbuf) {
			this.print_internal(sbuf);
		},

		print_internal: function(sbuf) {
			if(this.childs) {
				sbuf.push("{'" + this.text + "'");
				if(this.indx > -1) {
					sbuf.push("." + this.indx);
				}
				sbuf.push(": [");
				var s = this.childs.length;
				for(var ind = 0; ind < s; ind++) {
					this.childs[ind].print_internal(sbuf);
				}
				sbuf.push("]}");
			} else {
				sbuf.push("'" + this.text + "'");
				if(this.indx > -1) {
					sbuf.push("." + this.indx);
				}
			}
			sbuf.push(",");
		}
	}

});
