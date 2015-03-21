#!/usr/bin/perl -w
use strict; 
use warnings;
#authenticate.php
# a module just for verifying a username/hashword combob

package spaceTHINGS::Authenticate

use DBI;



sub authenticate{
	my $username = $_[0];
	my $hashword = $_[1];
	my $database = DBI->connect('DBI:mysql:GA_Space','','')
		|| die "Could not connect to DB GA_Space!";

	print "Connected!\n\n";
	
	
	$database->disconnect();
	$result
}



1;