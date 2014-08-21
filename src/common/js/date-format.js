/**
 *
 * Smyle Developer common
 *
 * @author Subburajan Mayilandan
 * @date   February 2013
 *
 ***************************************************************************************8***/
 
$2("date-format", ["lang"], function(S) {
	
	var DateFormat = {
		formatDateStr: function(str) {
			if(PastDate_V.prototype._RegX.test(str)) {
				return this._formatDateStr(str);
			}
			throw "Invalid Date Format";
		},
		
		_formatDateStr: function(str) {
			var arr = str.split(" ");
			var d = arr[0].trim().split("-");
			var t = arr[1].trim().split(":");
			return new Date(parseInt(d[0]), parseInt(d[1]) - 1, parseInt(d[2]), parseInt(t[0]), parseInt(t[1]), parseInt(t[2]));
		},
		
		formatDate: function(dt) {
			return dt.getFullYear() + "-" + _2digit(dt.getMonth() + 1) + "-" +  _2digit(dt.getDate()) + 
					" " + _2digit(dt.getHours()) + ":" + _2digit(dt.getMinutes()) + ":" + _2digit(dt.getSeconds());
		},
		
		addToDate: function(y, m, d) {
			var dt = new Date();
			return new Date(dt.getFullYear(), y, dt.getMonth() + m, dt.getDate() + d, 0, 0, 0);
		},
		
		addToDateStr: function(y, m, d) {
			return this.formatDate(this.addToDate(y, m, d));
		}
	}
	
	function _2digit(v) {
		return (v < 9)? "0" + v: v;
	}

	S.DateFormat = DateFormat;

});

