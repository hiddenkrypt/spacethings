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
			updateTickerDisplay();
		}
		,selectHexAtGrid: function( coords ){
			if( DEBUG ){ console.log("st_hud: selecting hex"); }
			if( st_data.loaded() ){
				updateTickerData( st_data.getHexDataByGrid( coords ) );
			}
		}
		,disablePopup: function(){ popup.active = false; }
	};
	
	var	updateTickerData = function ( hexData ){
		var hashID = new Hashids("spaceTHINGS", 4, "0123456789ABCDEF");
		var homeworld = st_data.getHomeworld();
	
		ticker.data = {
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
		if( ticker.data.system && ticker.data.system.name ){
			ticker.data.systemName = ticker.data.system.name;
		} else if( ticker.data.system ){
			ticker.data.systemName = "Unclaimed System";
		} else if( hexData.owner ){
			ticker.data.systemName = "Claimed Space";
		} 
		if( hexData.owner ){
			ticker.data.territoryOwner = hexData.owner;
		}
	};
	
	var ticker = {
		container: {}
		,title: {}
		,owner: {}
		,ucoords: {}
		,lcoords: {}
		,data: {
			localCoordinates:{ 
				x: -100
				,y: -100
			}
			,universalCoordinates:{
				x: -100
				,y: -100 
			}
			,territoryOwner: {r:0, g:0, b:0}
			,system: {}
			,systemName: ""
		}
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
	
	var updateTickerDisplay = function(){
		ticker.title.innerHTML = ticker.data.systemName;
		ticker.owner.style.color = "rgb("+ticker.data.territoryOwner.r+","+ticker.data.territoryOwner.g+","+ticker.data.territoryOwner.b+")";
		ticker.owner.innerHTML = ticker.data.territoryOwner.name || "";
		ticker.lcoords.innerHTML = "local: ["+ticker.data.localCoordinates.x + ", " + ticker.data.localCoordinates.y + "]";
		ticker.ucoords.innerHTML = "Universal: ["+ticker.data.universalCoordinates.x + ", " + ticker.data.universalCoordinates.y + "]";
	};
	return hud;
}(); // IIFE to create st_hud



