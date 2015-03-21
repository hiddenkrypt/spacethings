#!/usr/bin/perl -w
use strict; 
use warnings;

use CGI;
use CGI::Carp qw(fatalsToBrowser);

# Create the CGI object
my $query = new CGI;