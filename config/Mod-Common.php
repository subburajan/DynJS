<?php


	if(isset($_COOKIE["debug"]) && $_COOKIE["debug"] == 1) {
		$common_path = $path . "/src";
		$path .= "/../..";
	} else {
		$common_path = $path . "/min";
		$path .= "/min";
	}

	$modules = explode(",", $_REQUEST["m"]);

	$mods = array();
	foreach($modules as $m) {
		if(isset($deps[$m])) {
			$mods = array_merge($mods, $deps[$m]);
		}
		$mods[] = $m;
	}

	$mods = array_values(array_unique($mods));

	foreach($mods as $m) {
		if(isset($common_paths[$m])) {
			$p = $common_path . $common_paths[$m];
		} else if(isset($paths[$m])) {
			$p = $path . $paths[$m];
		}
		if($p != NULL) {
			?>
<?php include $p;?><?php

		}
	}
?>
