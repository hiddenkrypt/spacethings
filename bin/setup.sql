DROP DATABASE GA_Space;
CREATE DATABASE GA_Space;

CREATE TABLE GA_Space.users ( 
	id 				INT 			NOT NULL PRIMARY KEY
,	username		VARCHAR(50)		NOT NULL
,	hashword		VARCHAR(512)	NOT NULL
);

CREATE TABLE GA_Space.civs(
	id				INT				NOT NULL PRIMARY KEY
,	user_id			INT				NOT NULL FOREIGN KEY REFERENCES GA_Space.users(id)
,	name			VARCHAR(256)	NOT NULL
,	shortname		VARCHAR(32)		NOT NULL
,	race			VARCHAR(256)	NOT NULL
,	race_desc		VARCHAR(2048)	
,	homeworld_id	INT				NOT NULL FOREIGN KEY REFERENCES GA_Space.systems(id)
,	homeworld_desc	VARCHAR(2048)
,	major_merit_1	VARCHAR(128)	
,	major_merit_2	VARCHAR(128)
,	minor_merit		VARCHAR(128)
,	minor_flaw		VARCHAR(128)
);

--gross?
CREATE TABLE GA_Space.coords(
	id				INT				NOT NULL PRIMARY KEY
,	x				INT				NOT NULL
,	y				INT 			NOT NULL		
);

CREATE TABLE GA_Space.territory(
	id				INT				NOT NULL PRIMARY KEY
,	civ_id			INT				NOT NULL FOREIGN KEY REFERENCES GA_Space.civs(id)
,	coordinates		INT				NOT NULL FOREIGN KEY REFERENCES GA_Space.coords(id)
);

--gross.
CREATE TABLE GA_Space.exploration(
	id				INT				NOT NULL PRIMARY KEY
,	civ_id			INT				NOT NULL FOREIGN KEY REFERENCES GA_Space.civs(id)
,	coordinates		INT				NOT NULL FOREIGN KEY REFERENCES GA_Space.coords(id)
);

CREATE TABLE GA_Space.systems(
	id				INT				NOT NULL PRIMARY KEY
,	coordinates		INT				NOT NULL FOREIGN KEY REFERENCES GA_Space.coords(id)
,	name			VARCHAR(32)
,	owner_id		INT				FOREIGN KEY REFERENCES GA_Space.civs(id)
,	planets			INT
,	star_magnitude	INT				NOT NULL
,	mk_class		INT				NOT NULL
,	mk_spectrum		INT				NOT NULL
);

CREATE TABLE GA_Space.planets(
	id				INT				NOT NULL PRIMARY KEY
,	system_id		INT				NOT NULL FOREIGN KEY REFERENCES GA_Space.systems(id)
,	orbit			INT				NOT NULL
,	population		INT		
,	name			VARCHAR(32)
,	worldtype		VARCHAR(32)
,	utilization		VARCHAR(32)
,	spare_fluff		VARCHAR(256)
);

CREATE TABLE GA_Space.messages(
	id				INT				NOT NULL PRIMARY KEY
,	send_time		DATETIME		NOT NULL DEFAULT GETDATE()
,	from_id			INT				NOT NULL FOREIGN KEY REFERENCES	GA_Space.civs(id)	
,	to_id			INT				NOT NULL FOREIGN KEY REFERENCES	GA_Space.civs(id)	
,	message			VARCHAR(1024)	NOT NULL
,	to_read			INT				NOT NULL DEFAULT 0
,	admin_read		INT				NOT NULL DEFAULT 0		
);

CREATE TABLE GA_Space.interceptedmessages(
	id				INT				NOT NULL PRIMARY KEY
,	message_id		INT				NOT NULL FOREIGN KEY REFERENCES GA_Space.messages(id)
,	interceptor_id	INT				NOT NULL FOREIGN KEY REFERENCES	GA_Space.civs(id)
);
