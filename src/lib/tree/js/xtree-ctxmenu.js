/**
 *
 * @author subburajan mayilandan
 * @date   september 2012
 */
 
$2("xtree-ctxmenu", ["xtree", "xctxmenu"], function(S) {

	S.UI.XTree.attachMenu = function() {
		return _createCtxMenu(this.div.id + "_ctxm", this);
	}

	/**
	 * XTree Context menu
	 */
	function _createCtxMenu(_id, _xtree) {

		function _XTreeContextMenu(_id, _xtree) {
			this.xtree = _xtree;
			this._init(_id, _xtree.div.id);
			return this;
		}

		S.Lang.inherit(_XTreeContextMenu, S.UI.XContextMenu, {
			show_ctx_menu: function(evt, elem) {
				if(elem.tagName == "SPAN") {
					this._cs = elem;
					S.UI.XContextMenu.prototype.show_ctx_menu.call(this, evt, elem);
				}
			},

			hide_ctx_menu: function() {
				this._cs = null;
				S.UI.XContextMenu.prototype.hide_ctx_menu.call(this);
			},

			_invokeListnr: function(elem) {
				var menuid = this._findMenuid(elem);
				if(menuid) {
					this.listnr.listen(menuid, 
						this.xtree.getNodeid(this._cs.parentNode.parentNode.id));
				}
				this.hide_ctx_menu();
			}
		});
		return new _XTreeContextMenu(_id, _xtree);
	}

});
