<?php

	if(!isset($_REQUEST["set"])) {
		echo "<h3>Parameter expected to set/unset Debug mode<br></h2>";
		echo "<b>Usage: www.smyledev.com/ui/smyle/debug.php?set=1|0<br></b><br>";
		echo "where> set = 1 to set debug mode<br>";
		echo "where> set = 0 to unset debug mode<br>";
		exit;
	}

	if(isset($_REQUEST['sek']) && $_REQUEST['sek'] == 'manimegalai') {
		setDebugCookie();
		exit;
	}

	$ips = array(
		"127.0.0.1",
		"192.168.1.3"
	);

	$cip = $_SERVER["REMOTE_ADDR"];

	foreach($ips as $ip) {
		if($ip == $cip) {
			setDebugCookie();
			echo " for your IP " . $cip;
			exit;
		}
	}
	echo "Permission denied for setting Debug mode: IP: " . $cip;

	function setDebugCookie() {
		$set = $_REQUEST["set"];
		if($set == 1) {
			if(!isset($_COOKIE["debug"])) {
				$to = time() + (86400 * 10);
				setcookie("debug",  "1", $to, "/");
				echo "Debug mode enabled";
			} else {
				echo "Debug mode enabled already";
			}
		} else {
			 if(!isset($_COOKIE["debug"])) {
			 	echo "Debug mode disabled already";
			 } else {
				setCookie("debug", "", time() - 3600, "/");
				unset($_COOKIE["debug"]);
				echo "Debug mode disabled";
			 }
		}
	}

?>
