"use strict"
// st_hud.js

// Provides a Heads Up Display. This is the game stat viewer. A sidebar for civ stats, and a selection of 
// popup windows for displaying information on the map. Works closely with st_graphics, but also must provide
// DOM elements for forms. 

var st_hud = st_hud || function(){
	return {
		
		initialize: function(){}
		,starSystemPopupAtGrid: function( grid_x, grid_y ){}
		,starSystemPopupAtCanvas: function( canvas_x, canvas_y ){}
		,selectHex: function( coords ){}
	};

	
}();

// note for later
//never to be used for cryptography. I'm just using it to obfuscate coordinates and
// var hashids = new Hashids("this is my salt", 4, "0123456789ABCDEF");
// for(var i=0; i<300; i++){
  // console.log(hashids.encode(i));
// }
