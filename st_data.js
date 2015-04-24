
// st_data.js

// Stores all game related data. Dynamically created and loaded with information only after a successful logon, game data must come from the server. 
// Will be accessed by st_graphics for displaying systems in hexes, and by st_hud for system and civ data. Any module can call the update() method to 
// force the data object to retrieve the most recent data from the database. 


var st_data = st_data || (function(){
	"use strict";
	
	var mapData = {};
	var playerData = {};
	var status = "uninitialized";
	var DEBUG = st_DEBUG.data;
	var hashID = new Hashids("spaceTHINGS", 4, "0123456789ABCDEF");
	
	var data = {
		initialize: function(){
			status = "initialized"; 
			if( DEBUG ){
				this.update();
			}
			
			if( DEBUG ){ console.log( "st_data initialized" ); }
		}
		,update: function( loadTest ){
			if( DEBUG || loadTest){
				console.log( "loading debug map" );
				setTimeout( function(){		
					if( testUpdate() ){//if load success:
						status = "loaded";
						st_engine.loadComplete();						
					} else{
						status = "error";
					}
					if( DEBUG ){ console.log( "test data: " + status ); }	
				}, 300);
			} 

		}
		,getPlayerData: function(){ return playerData; }
		,getRevealedHexes: function(){ return mapData.hexes; }
		,getMap: function(){ if( DEBUG ){ return mapData; } }
		,getStatus: function(){ return status; }
		,getOwnerById: function( id ){ return mapData.owners[id]; }
		,getSystemById: function( id ){ return mapData.systems[id]; }
		,getStarDataFromSystemId: function( id ){
			if( !id ){ return false; }
			return {
				magnitude: mapData.systems[id].magnitude
				,mkSpectrum: mapData.systems[id].mkSpectrum
				,mkClass: mapData.systems[id].mkClass
				,color: getColorFromMKSpectrum( mapData.systems[id].mkSpectrum )
				,offset: mapData.systems[id].offset
			};
		}
		,loaded: function(){ return status === "loaded"; }
		,getMapHexByGrid:function( coords ){
			for(var i = 0; i < mapData.hexes.length; i++){
				if( mapData.hexes[i].x === coords.x && mapData.hexes[i].y === coords.y ){
					return mapData.hexes[i];
				}
			}
			return false;
		}
		,getHomeworld: function(){ 			
			return st_data.getMapHexByGrid( playerData.homeworld );
		}
		,getHexDataByGrid: function( coordinates ){
			var hex = st_data.getMapHexByGrid( coordinates );
			if(!hex){
				return {
					coords:{
						x: coordinates.x
						,y: coordinates.y
						,universal: '[' + hashID.encode( coordinates.x + 100 ) + ', ' + hashID.encode( coordinates.y + 100 ) + ']'
						,local: '[' + -( playerData.homeworld.x - coordinates.x ) + ', ' + ( playerData.homeworld.y - coordinates.y ) + ']'
					}
					,name: "Unexplored Space"
					,ownerName: "&nbsp;"
				};
			} else{
				return {
					coords: {
						x: hex.x
						,y: hex.y
						,universal: '[' + hashID.encode( hex.x + 100 ) + ', ' + hashID.encode( hex.y + 100 ) + ']'
						,local: '[' + -( playerData.homeworld.x - hex.x ) + ', ' + ( playerData.homeworld.y - hex.y ) + ']'
					}
					,name: hex.system ? mapData.systems[hex.system].name : hex.owner? mapData.owners[hex.owner].adjective+" Space" : "Unclaimed Space"
					,ownerName: (hex.owner && hex.system) ? mapData.owners[hex.owner].name : "&nbsp;"
				}
			}			 
		}
		,getSystemDataByGrid: function( coordinates ){
			var hex = st_data.getMapHexByGrid( coordinates );
			if( !hex ){ return false; }
			console.log( hex );
			var aggregatePopulation = 0;
			var aggregateResources = 0;
			var aggregatePlanets = [];
			
			mapData.planets.forEach(
				function( planet ){
					if( planet.system == hex.system ){
						aggregatePopulation += planet.population;
						aggregateResources += planet.resources;
						aggregatePlanets.push( planet );
					}
				}
			);
			
			return {
				adjective: mapData.systems[hex.system].adjective
				,star: {
					magnitude:mapData.systems[hex.system].magnitude
					,mkSpectrum: mapData.systems[hex.system].mkSpectrum
					,mkClass: mapData.systems[hex.system].mkClass
					,color: getColorFromMKSpectrum( mapData.systems[hex.system].mkSpectrum )
				}
				,coords: {
					x: 			hex.x
					,y: 		hex.y
					,universal: '[' + hashID.encode( hex.x + 100 ) + ', ' + hashID.encode( hex.y + 100 ) + ']'
					,local: 	'[' + -( playerData.homeworld.x - hex.x ) + ', ' + ( playerData.homeworld.y - hex.y ) + ']'
				}
				,population: aggregatePopulation
				,resources: aggregateResources
				,planets: aggregatePlanets
				,owner: mapData.owners[hex.owner]
			};
		}
	};
	
	var testUpdate = function(){
		playerData = {
			loaded: true
			,id: 7
			,name: "Waaagh 'elmit'ead"
			,race: "Da Orks"
			,adjective: "Ork"
			,homeworld: { x: 21, y: 15, id:66}
			,militaryPower: 15
			,population: 13
			,resources: 6
			,color: "30, 230, 0"
			,logo:"logo_test.png"
		};
		mapData = {
			loaded: true,
			hexes: [
				 { x: 22, y: 15, owner: 7, 		system: false }
				,{ x: 22, y: 16, owner: 13, 	system: false }
				,{ x: 22, y: 17, owner: 13, 	system: false }
				,{ x: 23, y: 16, owner: 13, 	system: false }
				,{ x: 24, y: 15, owner: 13, 	system: 1234 } 
				,{ x: 24, y: 16, owner: 13, 	system: 3456 } 
				,{ x: 25, y: 16, owner: 13, 	system: false } 
				,{ x: 25, y: 17, owner: 3, 		system: 2 } 
				,{ x: 23, y: 15, owner: false, 	system: false } 
				,{ x: 24, y: 17, owner: 3, 		system: false }
				,{ x: 21, y: 15, owner: 7, 		system: 5}
				,{ x: 21, y: 16, owner: false,	system: false } 
				,{ x: 20, y: 15, owner: false,	system: false } 
				,{ x: 21, y: 14, owner: 8, 		system: 56 } 
				,{ x: 22, y: 14, owner: 8, 		system: false } 
				,{ x: 23, y: 14, owner: false, 	system: false }
				,{ x: 20, y: 16, owner: false, 	system: 10 } 
			]
			,systems: {
				"1234": { name: "Sol",				adjective:"Solar",			magnitude:2, 	mkClass: "V", 	mkSpectrum: "G", offset:3, planets:3 }
				,"3456":{ name: "Alternia",  		adjective:"Alternian",		magnitude:9,	mkClass: "I", 	mkSpectrum: "L", offset:4, planets:2 }	
				,"2": 	{ name: "Sontar",  			adjective:"Sontaran",		magnitude:1, 	mkClass: "V", 	mkSpectrum: "B", offset:1, planets:5 }
				,"5": 	{ name: "Orkus",   			adjective:"Orkusian",		magnitude:4, 	mkClass: "V", 	mkSpectrum: "A", offset:5, planets:1 }
				,"56":	{ name: "Conquered Gaul",	adjective:"Gallic",			magnitude:3,	mkClass: "V", 	mkSpectrum: "O", offset:2, planets:0 }
				,"10": 	{ name: "Unidentified", 	adjective:"Unidentified",	magnitude:7, 	mkClass: "III", mkSpectrum: "T", offset:6, planets:0 }
			}
			,planets: [
				{id:"612",		system: 1234, 	orbit: 0,	population: 0,	resources:2, 	name: "Mercury"}
				,{id:"413", 	system: 1234, 	orbit: 1,	population: 0,	resources:1, 	name: "Venus"}
				,{id:"1111",	system: 1234, 	orbit: 2,	population: 9,	resources:-4, 	name: "Earth"}
				,{id:"1111",	system: 1234, 	orbit: 3,	population: 2,	resources:1, 	name: "Mars"}				
				,{id:"1612",	system: 1234, 	orbit: 4,	population: 1,	resources:7, 	name: "Jupiter"}
				,{id:"1413", 	system: 1234, 	orbit: 5,	population: 1,	resources:6, 	name: "Saturn"}
				,{id:"11111",	system: 1234, 	orbit: 6,	population: 0,	resources:1, 	name: "Uranus"}
				,{id:"11111",	system: 1234, 	orbit: 7,	population: 0,	resources:1, 	name: "Neptune"}
				,{id:"82", 		system: 3456, 	orbit: 0,	population: 20,	resources:-4,	name: "Alternia"}
				,{id:"8", 		system: 2, 		orbit: 0,	population: 1,	resources:4}
				,{id:"9",		system: 2, 		orbit: 1,	population: 8,	resources:1}
				,{id:"10", 		system: 2, 		orbit: 2,	population: 9,	resources:2,	name: "Sontar"}
				,{id:"11",		system: 2, 		orbit: 3,	population: 10,	resources:2}
				,{id:"12", 		system: 2, 		orbit: 4,	population: 11,	resources:1}
				,{id:"13", 		system: 5, 		orbit: 1,	population: 13,	resources:6,	name: "Orkus"}
				,{id:"14",		system: 56,		orbit: 0,   population: 2,	resources:4,	name: "New Gaul"}
			]
			,owners: {
				"13": { r:153, g:23, b:77, name: "Alternian Empire", adjective: "Alternian"}
				,"3": { r:0, g:0, b:86, name: "Sontaran Empire", adjective: "Sontaran"}
				,"6": { r:0, g:0, b:86, name: "Centauri Republic", adjective: "Centauri"}
				,"7": { r:30, g:230, b:0, name: "Waaagh 'elmit'ead", adjective: "Ork", logo: "logo_test.png" }
				,"8": { r:127, g: 127, b:50, name: "Roman Empire", adjective: "Roman"}
			}
		};
		console.log("Loaded test map and player data");
		return true;
	};
	
	var getColorFromMKSpectrum = function( spectrum ){			
		var color = "0,0,0";
		switch( spectrum ){
			case "O":
				return "130,130,255";
			case "B":
				return "130,130,202";
			case "A":
				return "162,162,210";
			case "F":
				return color = "210,210,226";
			case "G":
				return color = "239,239,239";
			case "K":
				return color = "226,210,210";
			case "M":
				return color = "210,162,162";
			case "L":
				return color = "202,130,130";
			case "T":
				return color = "255,130,130";
			default:
				return color = "255,255,255";
		}
	};
	
	
	return data;
}());

