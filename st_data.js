
// st_data.js

// Stores all game related data. Dynamically created and loaded with information only after a successful logon, game data must come from the server. 
// Will be accessed by st_graphics for displaying systems in hexes, and by st_hud for system and civ data. Any module can call the update() method to 
// force the data object to retrieve the most recent data from the database. 


var st_data = st_data || (function(){
	"use strict";
	var mapData = {},
		playerThingData = {},
		status = "uninitialized";
		
	return {
		DEBUG: st_DEBUG,
		initialize: function(){
			status = "initialized"; 
			if( this.DEBUG ){
				this.update();
			}
		}
		,update: function(){
			if( this.DEBUG ){
				console.log( "loading debug map" );
				setTimeout( function(){
					st_data.test_update();			
					if( mapData ){//if load success:
						status = "loaded";
						st_graphics.camera.centerOnHex( mapData.homeworld.x, mapData.homeworld.y );
					} else{
						status = "error";
					}
				}, 300);
			} else{
				//ajax request to server for absolutely everything. 
				//get mapData, get playerThingData
			}

		}
		,test_update: function(){
			mapData = {
				homeworld: { x: 22, y: 15 }
				,hexes: [
					 { x: 22, y: 15, owner: 13, system: 1234 }
					,{ x: 22, y: 16, owner: 13, system: false }
					,{ x: 22, y: 17, owner: 13, system: false }
					,{ x: 23, y: 16, owner: 13, system: false }
					,{ x: 24, y: 15, owner: 0, system: 1234 } 
					,{ x: 24, y: 16, owner: 13, system: 3456 } 
					,{ x: 25, y: 16, owner: 13, system: false } 
					,{ x: 25, y: 17, owner: 3, system: 2 } 
					,{ x: 23, y: 15, owner: 0, system: false } 
					,{ x: 24, y: 17, owner: 3, system: false }
				]
				,systems: {
					"1234": {magnitude:5, MKclass:"V", MKspectrum: "G", offset:Math.floor(Math.random()*7)+1}
					,"3456": {magnitude:-15, MKclass:"I", MKspectrum: "L", offset:Math.floor(Math.random()*7)+1}	
					,"2": {magnitude:15, MKclass:"V", MKspectrum: "B", offset:Math.floor(Math.random()*7)+1}
				}
				,owners: {
					"13": { r:153, g:23, b:77, name: "Alternian Empire", adjective: "Alternian"}
					,"3": { r:0, g:0, b:86, name: "Sontaran Empire", adjective: "Sontaran"}
					,"6": { r:0, g:0, b:86, name: "Centauri Republic", adjective: "Centauri"}
					,"7": { r:0, g:205, b:0, name: "Waaagh 'elmit'ead", adjective: "Ork"}
				}
			};
			playerThingData = {
				id: 7
				,name: "Waaagh 'elmit'ead"
				,race: "Da Orks"
				,military_power: 15
				,population: 23
				,resources: 24
				,homeworld: 66
			};
			console.log("Loaded test data");
		}
		,getRevealedHexes: function(){ return mapData.hexes; }
		,getMap: function(){ if( this.DEBUG ){ return mapData; } }
		,getStatus: function(){ return status; }
		,getOwnerById: function( id ){ return mapData.owners[id]; }
		,getSystemById: function( id ){ return mapData.systems[id]; }
		,loaded: function(){ return status === "loaded"; }
		,GetMapHexByGrid: function( coords ){
			this.hexes.forEach( function( element ){
				if( element.x === coords.x && element.y === coords.y ){
					return element;
				}
			});
		}
	};
	
})();

