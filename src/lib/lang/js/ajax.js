/**
 *  Ajax methods
 *
 *  @author subburajan
 *  @date   march 2011
 *
 ****************************************************************************/

$2("ajax", ["base"], function(S) {

S.Ajax = {

	getXMLHttpRequest: function() {
		var xmlHttp;
		if (window.XMLHttpRequest) {
			xmlHttp = new XMLHttpRequest();
		} else if (window.ActiveXObject) {
			try {
				xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {	
				try	{    
					xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
				} catch (e) {
					throw "Browser does not support AJAX!";
					return false;
				}
			}
		}
		return xmlHttp;
	},
	
	get: function(uri, cb, reqHeaders) {
		this._send("get", uri, null, cb, reqHeaders);
	},

	post: function(uri, data, cb, reqHeaders) {
		this._send("post", uri, data, cb, reqHeaders);
	},
	
	put: function(uri, data, cb, reqHeaders) {
		this._send("put", uri, data, cb, reqHeaders);
	},
	
	_send: function(ctype, uri,  data, cb, reqHeaders) {
		var xmlHttp = this.getXMLHttpRequest();
		xmlHttp.onreadystatechange = function() {
			if(xmlHttp.readyState == 4) {
				if(xmlHttp.status == 200) {
					if(cb) {
						cb(xmlHttp);
					}
				} else {
					throw "Server is not reachable";
				}
			}
		}
		
		xmlHttp.open(ctype, uri, true);
		var rh = reqHeaders || {"Content-Type": "text/xml;charset=UTF-8"};
		for(var key in rh) {
			xmlHttp.setRequestHeader(key, rh[key]);
		}
		xmlHttp.send(data);
	},
	
	send: function(uri, syncType, data, reqHeaders, successCB, failureCB, _ctype) {
		var xmlHttp = this.getXMLHttpRequest();
		xmlHttp.onreadystatechange = function() {
			if(xmlHttp.readyState == 4) {
				if(xmlHttp.status == 200) {
					if(successCB) {
						successCB(xmlHttp);
					}
				} else {
					if(failureCB) {
						failureCB(xmlHttp);
					}
				}
			}
		}
		
		xmlHttp.open(_ctype || "post", uri, syncType);
		if(reqHeaders) {
			for(var key in reqHeaders) {
				xmlHttp.setRequestHeader(key, reqHeaders[key]);
			}
		}
		xmlHttp.send(data);
	},
	
	toJson: function(resp) {
		try {
			return eval("(" + resp.responseText + ")");
		} catch(e) {
			return {"status": "FAIL", "err": "NOT FOUND" };
		}		
	}
}

});
