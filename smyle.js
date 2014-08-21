/**
 * Javascript Class Loading functions
 *
 *  @author Subburajan Mayilandan
 *  @date september 2012 
 */
(function() {

	var DEBUG = 1;

	window.Loader = {
		newList: {},
		forModules: {},
		
		addAllFor: function(unloaded, forModuleId) {
			var l = unloaded.length;
			for(var i = 0; i < l; i++) {
				this.newList[unloaded[i]] = 1;
			}
			if(!this.newList[forModuleId]) {
				this.forModules[forModuleId] = 1;
			}
		},
		
		loadJS: function() {
			var arr = [];
			var l = this.newList;
			for(var k in l) {
				arr.push(k);
			}
			if(arr.length == 0) {
				initModules(this.forModules);
				return;
			}
			var script = document.createElement("SCRIPT");
			script.src = "/ui/smyle/js.php?m=" + arr.join(",") + "&d=" + DEBUG;
			script.setAttribute("type", "text/javascript");
			
			this._attachOnLoad(script, function() {
				Loader.initJS();			
			});
		},

		initJS: function() {
			initModules(this.newList);
			initModules(this.forModules);
			
			modules["base"].getPack()._fireOnloads();
			
			delete this.newList;
			this.newList = [];
		},
		
		_attachOnLoad: function(elem, cb) {
			var complete = false;
			elem.onload = elem.onreadystatechange = function() {
				if(!complete && (!this.readyState || this.readyState == "complete" || this.readyState == "loaded")) {
					complete = true;
					elem.onload = elem.onreadystatechange = null;
					cb();
				}
			}
			document.getElementsByTagName("head").item(0).appendChild(elem);
		}
	}
	
	var stack;
	function initModules(l) {
		for(var k in l) {
			var m = modules[k];
			if(!m) {
				throw "Module '" + k + "' is not found";
			}
			if(!m.done) {
				stack = [];
				traverse(m);
			}
			if(!m.done) { //very rare
				throw "Module '" + m.id + "' dependency error";
			}
		}
	}
	
	function traverse(m) {
		if(window.ArrIndexOf(stack, m.id) > -1) {
			throw "Module '" + m.id + "' : Circular dependency Error";
		}
		
		stack.push(m.id)
		var ps = m.parents;
		for(var i = 0; i < ps.length; i++) {
			var pname = ps[i];    // pname = parent module name
			var pm = modules[pname];
			if(!pm) {
				throw "Module '" + pname + "' is not found. "; //return with error
			}

			if(pm.done) {
				continue;
			}

			traverse(pm);
		}
		m.load();
		stack.pop();
	}

	function copy(p1, p2) {
		if(!(p1 instanceof Pack)) {
			return;
		}
		if(!(p2 instanceof Pack)) {
			throw "Invalid namespace defined";
		}
		for(var k in p1) {
			if(p2[k]) {
				copy(p1[k], p2[k]);
			} else {
				p2[k] = p1[k];
			}
		}
	}
	
	function Pack() {
		return this;
	}
	
	var modules = {};
	
	function Module(id, module) {
		this.id = id;
		this.module = module;
		this.done = false;
		this.parents = null;
		this._pack = new Pack();
		return this;
	}

	Module.prototype = {
		dependsOn: function(parents) {
			var unloaded = [];
			for(var i = 0; i < parents.length; i++) {
				var m = modules[parents[i]];
				if(!m) {
					unloaded.push(parents[i]);
				}
			}
			this.parents = parents;
			return unloaded;
		},
		
		copy: function(_pack) {
			copy(this._pack, _pack);
		},
		
		/**
		 * Consider that this function will be called only when all it's parents are done
		 */
		load: function() {
			this.done = true;
			var ps = this.parents;
			try {
				for(var i = 0; i < ps.length; i++) {
					modules[ps[i]].copy(this._pack);
				}
			} catch(e) {
				throw e + " in module " + this.id;
			}
			this.module(this._pack);
		},
		
		getPack: function() {
			return this._pack;
		}
	}

	window.$2 = function(moduleId, parents, module) {
		if(modules[moduleId]) {
			return;
		}
	
		var m = new Module(moduleId, module);
		modules[m.id] = m;
		
		var unloaded = m.dependsOn(parents);
		Loader.addAllFor(unloaded, moduleId);
	}
	
	window.onload = function() {
		Loader.loadJS();
	}

	window.ArrIndexOf = function(arr, _text) {
		if(arr.indexOf) {
			return arr.indexOf(_text);
		}
		var l = arr.length;
		for(var ind = 0; ind < l; ind++) {
			if(arr[ind] == _text) {
				return ind;
			}
		}
		return -1;
	}

//---------------------------------------------------------------------------------------------------------------
//  Base module, the first module which has been loaded
//---------------------------------------------------------------------------------------------------------------

$2("base", [], function(S) {

	window._isIE = window.navigator.appName.indexOf("Microsoft") > -1;

	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g,"");
	}

	if(typeof $1 != "function") {
		window.$1 = function(id) {
			return (typeof(id) == "string")? document.getElementById(id): id;
		}
	}

//----------------------------------------------------------------------
//  Root Package definition
//----------------------------------------------------------------------

	S.namespace = function(ns) {
		var ns = ns.split(".");
		var nsl = ns.length;
		var p = arguments.callee.caller.arguments[0];
		var n;
		for(var i = 1; i < nsl; i++) {
			n = ns[i];
			if(!p[n]) {
				p = p[n] = new Pack();
			} else {
				p = p[n];	
			}		
		}
	}
	
	S.IMG_PATH = '/ui/sw/_images';

	var _onloads = [];
	S.onload = function(func) {
		_onloads.push(func);
	}
	
	S._fireOnloads = function() {
		var l = _onloads.length;
		for(var i = 0; i < l; i++) {
			_onloads[i]();
		}
		delete _onloads;
		_onloads = [];
	}
});

})();
