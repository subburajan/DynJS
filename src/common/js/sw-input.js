/*************************************************************************************************
 * Input UI classes definitions
 *
 * @author Subburajan Mayilandan
 * @date   september 2012
 *
 *************************************************************************************************/

 $2("sw-input", ["lang", "sw-common"], function(S) {

 	function AbstractInp(id) {
 		this.id = id;
 		var err = this.id + "_err";
 		if(!$1(err)) {
			var d = document.createElement("DIV");
			d.id = err;
			d.className = "I-err";
			d.style.display = "none";
			$1(this.id).parentNode.appendChild(d);
		}
		var lbl = $1(this.id + "_lbl");
		if(lbl && lbl.className.indexOf("imp") > -1) {
			this.imp = true;
		}
 	}

 	AbstractInp.prototype = {
 		set: function(map) {
 			$1(this.id).value = map[this.id] || "";
 		},

 		get: function(map) {
 			map[this.id] = this.getValue();
 		},

 		getValue: function() {
 			return $1(this.id).value;
 		},

 		getValidVal: function(noerr) {
			this.setErr("");
			try {
				return this._validVal();
			} catch(e) {
				if(!noerr) {
					this.setErr(e);
					throw e;
				}
			}
		},

 		getv: function() {
 			var m = {};
 			this.get(m);
 			return m[this.id];
 		},

 		setErr: function(msg) {
			S.Inputs.setErr(this.id + "_err", msg);
		},

		_validVal: function() {
			var v = this.getValue().trim();
			if(v.length == 0) {
				if(this.imp) {
					throw 'Please Enter "' + $1(this.id).title + '"';
				}
			} else {
				v = this.validVal(v);
			}
			return v;
		},

		validVal: function(v) {
			return v;
		}
 	};

 	function TextInp(id, size, valRegex) {
 		TextInp.superclass.apply(this, arguments);
 		this.size = size;
 		this.valRegex = valRegex || "";
 		return this;
 	}

 	S.Lang.inherit(TextInp, AbstractInp, {

 	});

 	function EmailInp(id, size) {
 		TextInp.superclass.apply(this, arguments);
 		this.size = size;
 		return this;
 	}

 	S.Lang.inherit(EmailInp, TextInp, {
		validVal: function(v) {
			 if(v.indexOf(".") == -1 || v.indexOf("@") == -1) {
				 throw "Invalid Email id - Ex: xyz@abc.com";
			 }
			 return v;
		}
 	});

 	function PasswordInp(id, size) {
 		PasswordInp.superclass.apply(this, arguments);
 		this.valRegex = "";
 		return this;
 	}

 	S.Lang.inherit(PasswordInp, TextInp, {
		validVal: function(v) {
			 if(v.length < 8) {
				 throw "Password should be 8 characters";
			 }
			 return v;
		}
 	});

 	function ChkboxInp(id) {
 		ChkboxInp.superclass.apply(this, arguments);
 		this.valRegex = "";
 		return this;
 	}

 	S.Lang.inherit(ChkboxInp, AbstractInp, {
 		set: function(map) {
 			var v = map[this.id];
 			$1(this.id).checked = (v == "y" || v == "Y");
 		},

 		getValue: function() {
			return $1(this.id).checked ? "Y": "N";
 		}

 	});

 	function SelectInp(id) {
 		SelectInp.superclass.apply(this, arguments);
 		return this;
 	}

 	S.Lang.inherit(SelectInp, AbstractInp, {
 		set: function(map) {
 			var v = map[this.id];
 			if(!v) {
 				return;
 			}
 			var obj = $1(this.id);
 			var o = obj.options;
 			var l = o.length;
 			for(var i = 0; i < l; i++) {
 				if(o[i].value == v) {
 					obj.selectedIndex = i;
 				}
 			}
 		},

 		getValue: function() {
			var obj = $1(this.id);
 			return obj.options[obj.selectedIndex].value;
 		},

		_validVal: function() {
			var v = this.getValue().trim();
			if(v == "-1" && this.imp) {
				throw 'Please Choose "' + $1(this.id).title + '"';
			}
			return v;
		}
 	});

 	function TextAreaInp(id, maxLength) {
 		TextAreaInp.superclass.apply(this, arguments);
 		this.maxL = maxLength;
 		return this;
 	}

 	S.Lang.inherit(TextAreaInp, TextInp, {
		validVal: function(v) {
			if(v.length > this.maxL) {
				throw "Length of the value should not exceed " + this.maxL + " characters";
			}
			return v;
		}
 	});

 	function CaptchaInp(id) {
 		CaptchaInp.superclass.apply(this, arguments);
 		this.imp = true;
 		return this;
 	}

 	S.Lang.inherit(CaptchaInp, TextInp, {


 	});

 	S.Input = {
 		AbstractInp: AbstractInp,
		PasswordInp: PasswordInp,
		TextInp: TextInp,
 		ChkboxInp: ChkboxInp,
 		SelectInp: SelectInp,
 		EmailInp: EmailInp,
 		TextAreaInp: TextAreaInp,
 		CaptchaInp: CaptchaInp
 	}

 	S.Inputs = {
		err_reg: {},

		validMap: function(inps) {
			this.clearErrs();
 			var map = {};
 			var valid = true;
 			for(var k in inps) {
 				try {
 					//map[k] = inps[k].getValue();
 					map[k] = inps[k].getValidVal();
				} catch(e) {
					valid = false;
				}
 			}
 			if(valid) {
				return map;
			}
		},

		setErr: function(id, msg) {
			var e = $1(id);
			if(e) {
				if(msg && msg.length > 0) {
					e.innerHTML = msg;
					e.style.display = "block";
					this.err_reg[id] = 1;
				} else {
					e.innerHTML = "";
					e.style.display = "none";
					delete this.err_reg[id];
				}
			}
		},

		clearErrs: function() {
			var arr = [];
			for(var k in this.err_reg) {
				arr.push(k);
			}
			for(var i = 0; i < arr.length; i++) {
				this.setErr(arr[i]);
			}
		},

		setErrs: function(map) {
			for(var k in map) {
				var t = $1(k);
				t = (t? t.title: "") + ": ";
				this.setErr(k + "_err", t + map[k]);
			}
		}
	}
 });
