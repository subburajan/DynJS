<?php

	$common_paths = array(
		"date-format" => "/common/js/date-format.js",
		"sw-overlay" => "/common/js/overlay.js",
		"sw-common" => "/common/js/sw-common.js",
		"sw-input" => "/common/js/sw-input.js",
		"validator" => "/common/js/validator.js",
		"billboard" => "/lib/anim/js/billboard.js",
		"xbutton" => "/lib/button/js/xbutton.js",
		"ed-trans" => "/lib/editor/js/ed-trans.js",
		"ed-util" => "/lib/editor/js/ed-util.js",
		"editor-ext" => "/lib/editor/js/editor-ext.js",
		"editor" => "/lib/editor/js/editor.js",
		"keyboard" => "/lib/editor/js/keyboard.js",
		"ed-kb-html" => "/lib/editor/js/ta/ed-kb-html.js",
		"ed-lang-ta" => "/lib/editor/js/ta/ed-lang-ta.js",
		"translitre" => "/lib/editor/js/translitre.js",
		"ajax" => "/lib/lang/js/ajax.js",
		"dnd" => "/lib/lang/js/dnd.js",
		"dnp" => "/lib/lang/js/dnp.js",
		"lang" => "/lib/lang/js/lang.js",
		"xctxmenu" => "/lib/menu/js/xctxmenu.js",
		"xtree-ctxmenu" => "/lib/tree/js/xtree-ctxmenu.js",
		"xtree" => "/lib/tree/js/xtree.js",
		"base" => "/lib/lang/js/base.js"
	);

	$paths = array(
		"none" => "none"
	);



	$deps = array(
		"cp-config" => array("base","lang"),
		"xdialog" => array("base","xctxmenu","xwindow","xtaskbar","xbutton","lang"),
		"xtree" => array("base","lang"),
		"changepwd" => array("sw-common","ajax","base","lang","sw-input"),
		"ajax" => array("base"),
		"ed-util" => array("base","lang"),
		"login" => array("base"),
		"dsk-rpc" => array("ajax","base"),
		"ed-kb-html" => array("base"),
		"marquee" => array("base","lang"),
		"xctxmenu" => array("lang"),
		"sw-overlay" => array("sw-common","base","lang"),
		"date-format" => array("lang"),
		"billboard" => array("base","lang"),
		"validator" => array("base","date-format","lang"),
		"lang" => array("base"),
		"xtree-ctxmenu" => array("xtree","xctxmenu","base","lang"),
		"dnd" => array("base","lang"),
		"blog-rpc" => array("ajax","base"),
		"dnp" => array("base"),
		"xbutton" => array("base","lang"),
		"sw-common" => array("base","lang"),
		"sw-input" => array("base","lang","sw-common"),
		""
	);

?>
