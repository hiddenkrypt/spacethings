<?php
//db_info.php
	ini_set( 'display_error', 'on' );
	$db_server = "localhost";
	$db_user = "";
	$db_password = "";
	$db_name = "GA_Space";
	$mysql = new mysqli($db_server, $db_user, $db_password, $db_name);
	if( $mysql->connect_error){
		die( "{error:\"DB connection failure\",serverCode:500" );
	}
?>