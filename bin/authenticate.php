<?php
// authenticate.php
	function authenticate( $username, $password ){
		require( "db_info.php" );
		$username = $mysql->real_escape_string( htmlentities( $username ) );
		
		$query = "SELECT hashword FROM GA_Space.users WHERE username = \"".$username."\"";
		$result = $mysql->query( $query );
		if ( $result === false ){
			die("{serverCode:500,error:\" Query Error: ".$mysql->error."\"}" );
		} else {
			if( $result->num_rows == 1 ){
				$result->data_seek( 0 );
				$row = $result->fetch_assoc();
				return password_verify( $password, $row['hashword'] );
			}
			else{
				die("{serverCode:500,error:\" incorrect row result: ".$result->num_rows." rows returned\"}" );
			}
		}
		return false;
	}
	

	
?>