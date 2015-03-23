
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
	return {
		initialize: function(){
			status = "initialized"; 
			if( DEBUG ){
				this.update();
			}
		}
		,update: function(){
			if( DEBUG ){
				console.log( "loading debug map" );
				setTimeout( function(){
					st_data.test_update();			
					if( mapData ){//if load success:
						status = "loaded";
						st_graphics.camera.centerOnHex( playerData.homeworld.x, playerData.homeworld.y );
					} else{
						status = "error";
					}
				}, 300);
			} else{
				//ajax request to server for absolutely everything. 
				//get mapData, get playerThingData
				//get CommunicationData
			}

		}
		,test_update: function(){
			mapData = {
				hexes: [
					 { x: 22, y: 15, owner: 13, system: false }
					,{ x: 22, y: 16, owner: 13, system: false }
					,{ x: 22, y: 17, owner: 13, system: false }
					,{ x: 23, y: 16, owner: 13, system: false }
					,{ x: 24, y: 15, owner: false, system: 1234 } 
					,{ x: 24, y: 16, owner: 13, system: 3456 } 
					,{ x: 25, y: 16, owner: 13, system: false } 
					,{ x: 25, y: 17, owner: 3, system: 2 } 
					,{ x: 23, y: 15, owner: false, system: false } 
					,{ x: 24, y: 17, owner: 3, system: false }
					,{ x: 21, y: 15, owner: 7, system: 5}
					,{ x: 21, y: 16, owner: false, system: false } 
					,{ x: 20, y: 15, owner: false, system: false } 
					,{ x: 21, y: 14, owner: false, system: false } 
					,{ x: 22, y: 14, owner: false, system: false } 
				]
				,systems: {
					"1234": {magnitude:5, MKclass:"V", MKspectrum: "G", offset:Math.floor(Math.random()*7)+1, planets:3 }
					,"3456": {magnitude:-15, MKclass:"I", MKspectrum: "L", offset:Math.floor(Math.random()*7)+1, planets:2 }	
					,"2": {magnitude:15, MKclass:"V", MKspectrum: "B", offset:Math.floor(Math.random()*7)+1, planets:5 }
					,"5": {magnitude: 0, MKClass: "V", MKSpecturm: "A", offset:Math.floor(Math.random()*7)+1, planets:1 }
				}
				,planets: {
					"612": { system: 1234, orbit: 0}
					,"413": { system: 1234, orbit: 1}
					,"1111": { system: 1234, orbit: 2}
					,"82": { system: 3456, orbit: 0}
					,"72": { system: 3456, orbit: 1}
					,"8": { system: 2, orbit: 0}
					,"9": { system: 2, orbit: 1}
					,"10": { system: 2, orbit: 2}
					,"11": { system: 2, orbit: 3}
					,"12": { system: 2, orbit: 4}
					,"13": { system: 5, orbit: 0}
				}
				,owners: {
					"13": { r:153, g:23, b:77, name: "Alternian Empire", adjective: "Alternian"}
					,"3": { r:0, g:0, b:86, name: "Sontaran Empire", adjective: "Sontaran"}
					,"6": { r:0, g:0, b:86, name: "Centauri Republic", adjective: "Centauri"}
					,"7": { r:0, g:205, b:0, name: "Waaagh 'elmit'ead", adjective: "Ork"}
				}
			};
			playerData = {
				id: 7
				,name: "Waaagh 'elmit'ead"
				,race: "Da Orks"
				,adjective: "Ork"
				,homeworld: { x: 21, y: 15, id:66}
				,military_power: 15
				,population: 23
				,resources: 24
			};
			console.log("Loaded test data");
		}
		,getRevealedHexes: function(){ return mapData.hexes; }
		,getMap: function(){ if( DEBUG ){ return mapData; } }
		,getStatus: function(){ return status; }
		,getOwnerById: function( id ){ return mapData.owners[id]; }
		,getSystemById: function( id ){ return mapData.systems[id]; }
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
			return this.getMapHexByGrid( playerData.homeworld ); 
		}
		,getHexDataByGrid: function( coords ){
			var hex = this.getMapHexDataByGrid();
			var hexData = {
				coords: {
					x: hex.x
					,y: hex.y
				}
				,system: false
				,owner: false
				,planets: false
			}
			if( hex.system ){
				hexData.system = mapData.systems[hex.system];
			}
			if( hex.owner ){
				hexData.owner = mapData.owners[hex.owner];
			}
			return hexData;
		}
	};
	
})();

