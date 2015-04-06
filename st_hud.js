"use strict"
// st_hud.js

// Provides a Heads Up Display of game data

var st_hud = st_hud || function(){

	var DEBUG = st_DEBUG.hud;
	var popuphaseverbeenactive = false;
	var hud = {
		initialize: function(){
			loadTicker();
		}
		,render: function( ctx ){
		//	if( popup.active ){
		//		drawPopupBackground( ctx );
		//		drawPopupData( ctx );
		//	}
			if( popuphaseverbeenactive ){
				updateTicker();
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
			popup.data.systemName = "Claimed Space";
		} 
		if( hexData.owner ){
			popup.data.territoryOwner = hexData.owner;
		}
		popuphaseverbeenactive = true;
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
	}
	var ticker = {
		container: {}
		,title: {}
		,owner: {}
		,ucoords: {}
		,lcoords: {}
	}; 
	
	var loadTicker = function(){
		ticker.container = document.getElementById( 'hud_ticker_container' );
		ticker.title = document.createElement( 'div' );
		ticker.owner = document.createElement( 'div' );
		ticker.lcoords = document.createElement( 'div' );
		ticker.ucoords = document.createElement( 'div' );		
		
		ticker.title.setAttribute( 'id', 'hud_ticker_title' );
		ticker.owner.setAttribute( 'id', 'hud_ticker_owner' );
		ticker.lcoords.setAttribute( 'id', 'hud_ticker_lcoords' );
		ticker.ucoords.setAttribute( 'id', 'hud_ticker_ucoords' );
		
		ticker.container.appendChild( ticker.lcoords );
		ticker.container.appendChild( ticker.title );
		ticker.container.appendChild( ticker.owner );
		ticker.container.appendChild( ticker.ucoords );
		
		ticker.container.style.display = 'inline-block';
	};
	
	var updateTicker = function(){
		ticker.title.innerHTML = popup.data.systemName;
		ticker.owner.style.color = "rgb("+popup.data.territoryOwner.r+","+popup.data.territoryOwner.g+","+popup.data.territoryOwner.b+")";
		ticker.owner.innerHTML = popup.data.territoryOwner.name || "";
		ticker.lcoords.innerHTML = "local: ["+popup.data.localCoordinates.x + ", " + popup.data.localCoordinates.y + "]";
		ticker.ucoords.innerHTML = "Universal: ["+popup.data.universalCoordinates.x + ", " + popup.data.universalCoordinates.y + "]";
	};
	return hud;
}(); // IIFE to create st_hud



