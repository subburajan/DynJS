/**
 *
 * Smyle Developer common
 *
 * @author Subburajan Mayilandan
 * @date   February 2013
 *
 ***************************************************************************************8***/

$2("validator", ["lang", "date-format"], function(S) {

	function Base_V() {
		return this;
	}

	Base_V.prototype = {
		validate: function(e) {
			var m = S.Lang.getDataSet(e, "mandatory");

			var val = this._getVal(e);
			if(this._chkMandtryFurther(val, m, e)) {
				return "";
			}
			if(!this._RegX.test(val)) {
				throw "Invalid " + e.getAttribute("title");
			}
			return val;
		},

		_RegX: "",

		_chkMandtryFurther: function(v, m, e) {
			if(v.length == 0) {
				if(m === "true") {
					throw "Must Enter " + e.getAttribute("title");
				}
				return true; //not to continue further
			}
			return false;
		},

		_getVal: function(e) {
			return e.value.trim();
		}
	}

	function URL_V() {
		return this;
	}

	URL_V.prototype = new Base_V();

	URL_V.prototype._RegX = /(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

	URL_V.prototype._getVal = function(e) {
		var v = e.value.trim();
		return v.replace("https", "").replace("http", "");
	}


	function PastDate_V() {
		return this;
	}

	PastDate_V.prototype = new Base_V();

	PastDate_V.prototype._RegX = /^\d{4}-(0?[1-9]|1[01])-(0{1,2}|0?[1-9]|[12][0-9]|3[01]) (0{1,2}|0?[1-9]|1[0-9]|2[0-3]):(0{1,2}|0?[1-9]|[1-5][0-9]):(0{1,2}|0?[1-9]|[1-5][0-9])$/;

	PastDate_V.prototype.validate = function(e) {
		var r = Base_V.prototype.validate.apply(this, arguments);
		if(!r) {
			return r;
		}
		var date = S.DateFormat._formatDateStr(e.value);
		var curr = new Date();
		if(date.getTime() > curr.getTime()) {
			throw "Date should be in past";
		}
		return date;
	}

	PastDate_V.prototype.validateBefore = function(d1, d2) {
		if(d1.getTime() > d2.getTime()) {
			throw "From Date should be less than To Date";
		}
	}

	S.Base_V = Base_V;
	S.URL_V = URL_V;
	S.PastDate_V = PastDate_V;

});
