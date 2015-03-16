<?php //login.php

	require( "authenticate.php" );
	$data = json_decode( $_POST["data"], true );
	$username = $data["username"];
	$hashword = $data["hashword"];
	$login = authenticate( $username, $hashword );
	if($login){
		print("{serverStatus:200, error:\"\", login:true}");
	} else {
		print("{serverStatus:403, error:\"Incorrect Username or Password\", login:false}");
	}
		
?>