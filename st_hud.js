"use strict"
// st_hud.js

// Provides a Heads Up Display. This is the game stat viewer. A sidebar for civ stats, and a selection of 
// popup windows for displaying information on the map. Works closely with st_graphics, but also must provide
// DOM elements for forms. 

var st_hud = st_hud || function(){

	var DEBUG = st_DEBUG.hud;
	var popup = {
		w: 300
		,h: 400
		,x: 100
		,y: 100
		,border: {
			spacing: 10
			,width: 3
		}
		,active: false
	};
	
	var Hud = {
		initialize: function(){
			if( DEBUG ){
				popup.active = true;
			}
		}
		,render: function( ctx ){
			if( popup.active ){
				drawPopupBackground( ctx );
				drawPopupData( ctx );
			}
		}
		,selectHexAtGrid: function( coords ){
			if( DEBUG ){ console.log("st_hud: selecting hex"); }
			if( st_data.loaded() ){
				loadPopupData( st_data.getMapHexByGrid( coords ) );
				popup.active = true;
			}
		}
	};
	
	var drawPopupBackground = function( ctx ){
		ctx.fillStyle = "rgba(230,230,230,.8)";
		ctx.fillRect( popup.x, popup.y, popup.w, popup.h );
		ctx.strokeStyle = "#101010";
		ctx.lineWidth = popup.border.width;
		ctx.strokeRect( 
			popup.x + popup.border.spacing - popup.border.width/2,	
			popup.y + popup.border.spacing - popup.border.width/2, 
			popup.w - popup.border.width*2 - popup.border.spacing, 
			popup.h-popup.border.spacing-popup.border.width*2 
		);
	}
	
	var	loadPopupData = function ( hexData ){};
	var drawPopupData = function ( ctx ){};
	return Hud;
}(); // IIFE to create st_hud




// note for later
//never to be used for cryptography. I'm just using it to obfuscate coordinates and
// var hashids = new Hashids("this is my salt", 4, "0123456789ABCDEF");
// for(var i=0; i<300; i++){
  // console.log(hashids.encode(i));
// }
