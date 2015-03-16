<?php //create_account.php

	require( "db_info.php" );
	$data = json_decode( $_POST["data"], true );
	$username = $data["username"];
	$hashword = $data["hashword"];
	$inviteCode = $data["inviteCode"];
	if($inviteCode !== "63b39f8272a751b760992db773c69eb77a416240"){ //fancybutts
		print("{serverStatus:403, error:\"Access Denied\"}");
	} else {
		
		$username = $mysql->real_escape_string( htmlentities( $username ) );
		$hashword = $mysql->real_escape_string( htmlentities( $hashword ) );
		$query = "SELECT id FROM GA_Space.users WHERE username = \"".$username."\"";
		$result = $mysql->query( $query );
		if ( $result === false ){
			print( "{serverCode:500,error:\" Query Error: ".$mysql->error."\"}" );
		} else {
			if( $result->num_rows > 0 ){
				print( "{serverCode:400, error:\"Name already in use\"}" );
			}
			else{
				//add to table and respond to user
				
				$query = "INSERT INTO GA_Space.users (username, hashword) VALUES (\"".$username."\",\"".$hashword."\");";
				$result = $mysql->query( $query );
				if ( $result === false ){
					print( "{serverCode:500,error:\" Query Error: ".$mysql->error."\"}" );
				} else{
					print( "{serverCode:200, error:\"\", login:true}"); 
				}
			}
		}
	}
?>