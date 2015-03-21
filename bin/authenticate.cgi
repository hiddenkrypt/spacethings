#!/usr/bin/perl -w
use strict; 
use warnings;

use CGI;
use CGI::Carp qw(fatalsToBrowser);
use DBI;

# Create the CGI object
my $query = new CGI;

my $database = DBI->connect('DBI:mysql:GA_Space','','')
	|| die "Could not connect to DB GA_Space!";

print "Connected!\n\n";
$database->disconnect();
