<?php

	header("content-type: application/x-javascript");

	if(isset($_COOKIE["debug"]) && $_COOKIE["debug"] == 1) {
		echo file_get_contents(__DIR__ . "/src/smyle.js");
	} else {
		echo file_get_contents(__DIR__ . "/smyle.js");
	}

?>
