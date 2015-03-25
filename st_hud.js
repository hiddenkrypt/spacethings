"use strict"
// st_hud.js

// Provides a Heads Up Display. This is the game stat viewer. A sidebar for civ stats, and a selection of 
// popup windows for displaying information on the map. Works closely with st_graphics, but also must provide
// DOM elements for forms. 

var st_hud = st_hud || function(){

	var DEBUG = st_DEBUG.hud;

	var Hud = {
		initialize: function(){

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
				loadPopupData( st_data.getHexDataByGrid( coords ) );
				popup.active = true;
			}
		}
		,disablePopup: function(){ popup.active = false; }
	};
	var popup = {
		w: 	500
		,h: 100
		,x: 100
		,y: 100
		,lineSpacing: 15
		,border: {
			margin: 10
			,width: 3
			,padding: 15
		}
		,active: false
		,data:	false
	};

	var drawPopupBackground = function( ctx ){
		ctx.fillStyle = "rgba(255,255,255,.95)";
		ctx.fillRect( popup.x, popup.y, popup.w, popup.h );
		ctx.strokeStyle = "#101010";
		ctx.lineWidth = popup.border.width;
		ctx.strokeRect( 
			popup.x + popup.border.margin - popup.border.width/2,	
			popup.y + popup.border.margin - popup.border.width/2, 
			popup.w - popup.border.width*2 - popup.border.margin, 
			popup.h-popup.border.margin-popup.border.width*2 
		);
	}
	var	loadPopupData = function ( hexData ){
		var hashID = new Hashids("spaceTHINGS", 4, "0123456789ABCDEF");
		var homeworld = st_data.getHomeworld();
	
		popup.data = {
			localCoordinates:{ 
				x: -(homeworld.x - hexData.coords.x)
				,y: homeworld.y - hexData.coords.y
			}
			,universalCoordinates:{
				x: hashID.encode( hexData.coords.x + 100 )
				,y: hashID.encode( hexData.coords.y + 100 )	
			}
			,territoryOwner: {r:0, g:0, b:0}
			,system: hexData.system
			,systemName: "Unclaimed Space"
		}		
		if( popup.data.system && popup.data.system.name ){
			popup.data.systemName = popup.data.system.name;
		} else if( popup.data.system ){
			popup.data.systemName = "Unclaimed System";
		} else if( hexData.owner ){
			popup.data.systemName = hexData.owner.adjective + " Space";
		} 
		if( hexData.owner ){
			popup.data.territoryOwner = hexData.owner;
		}
	};
	var drawPopupData = function ( ctx ){
		var x = popup.x + popup.border.margin + popup.border.width/2 + popup.border.padding;
		var y = popup.y + popup.border.margin + popup.border.width/2 + popup.border.padding + popup.lineSpacing;
		var lines  = [
			{ size: "26", style:"#000", title: "", text:  popup.data.systemName },
			{ size: "16", bg: "rgba(0,0,0,.7)", style:"rgb("+popup.data.territoryOwner.r+","+popup.data.territoryOwner.g+","+popup.data.territoryOwner.b+")", title: "", text: popup.data.territoryOwner.name? popup.data.territoryOwner.name : "" },										
			{ size: "16", style:"#000", title: "Universal Coordinates: ", text: "[" + popup.data.universalCoordinates.x + ", " + popup.data.universalCoordinates.y + "]" },
			{ size: "16", style:"#000", title: "Local Coordinates : ", text: "[" + popup.data.localCoordinates.x + ", " + popup.data.localCoordinates.y + "]" },
		];
		for(var i = 0; i < lines.length; i++){
			ctx.font = lines[i].size+"px Courier";
			var position = y + popup.lineSpacing * i;
			if(i>0){
				position += lines[i-1].size;
			}
			ctx.fillStyle = lines[i].style;
			ctx.fillText( lines[i].title + lines[i].text, x, position);
		}		
		
		
		// ctx.fillStyle = "#000";

		// ctx.font = "20px Courier";
		// ctx.fillText( popup.data.systemName, x, y );
		// ctx.font = "11px Courier";
		// ctx.fillText( "Universal Coordinates: [" + popup.data.universalCoordinates.x + ", " + popup.data.universalCoordinates.y + "]", x, y + 20 + popup.lineSpacing ); 
		// ctx.fillText( "Local Coordinates: [" + popup.data.localCoordinates.x + ", " + popup.data.localCoordinates.y + "]", x, y + 20 + 11 + popup.lineSpacing ); 
	}
	
	return Hud;
}(); // IIFE to create st_hud



