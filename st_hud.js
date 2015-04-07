"use strict"
// st_hud.js

// Provides a Heads Up Display of game data

var st_hud = st_hud || function(){
	var DEBUG = st_DEBUG.hud;

	var hashID = new Hashids("spaceTHINGS", 4, "0123456789ABCDEF");
	
	var hud = {
		initialize: function(){
			loadTickerDom();
			loadSidebarDom();
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
			,systemName: "Unclaimed Space"
		}		
		if( hexData.system && hexData.system.name ){
			ticker.data.systemName = hexData.system.name;
		} else if( !hexData.owner && hexData.system ){
			ticker.data.systemName = "Unclaimed System";
		} else if( hexData.owner && !hexData.system ){
			ticker.data.systemName = hexData.owner.adjective+" Space";
		} 
		if( hexData.owner && hexData.system ){
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
			localCoordinates:{ x:-100, y:-100 }
			,universalCoordinates:{ x:-100, y:-100 }
			,territoryOwner: { r:0, g:0, b:0, name:"" }
			,system: {}
			,systemName: ""
		}
		,collapseIcon: {}
	}; 
	
	var loadTickerDom = function(){
		ticker.container = document.getElementById( 'hud_ticker_container' );
		ticker.title = document.createElement( 'div' );
		ticker.owner = document.createElement( 'div' );
		ticker.lcoords = document.createElement( 'div' );
		ticker.ucoords = document.createElement( 'div' );		
		ticker.collapseIcon = document.createElement( 'div' );
		
		ticker.title.setAttribute( 'id', 'hud_ticker_title' );
		ticker.owner.setAttribute( 'id', 'hud_ticker_owner' );
		ticker.lcoords.setAttribute( 'id', 'hud_ticker_lcoords' );
		ticker.ucoords.setAttribute( 'id', 'hud_ticker_ucoords' );
		ticker.collapseIcon.setAttribute( 'id', 'hud_ticker_collapse_icon' ); 
		
		ticker.title.setAttribute( 'title', 'System/Sector name' );
		ticker.owner.setAttribute( 'title', 'System Owner' );
		ticker.lcoords.setAttribute( 'title', 'Homeworld Relative Coordinates' );
		ticker.ucoords.setAttribute( 'title', 'Universal Coordinates' );
		ticker.collapseIcon.setAttribute( 'title', 'Hide / Show' );
		
		ticker.collapseIcon.innerHTML = '<<';
		
		ticker.container.appendChild( ticker.title );
		ticker.container.appendChild( ticker.owner );
		ticker.container.appendChild( ticker.lcoords );
		ticker.container.appendChild( ticker.ucoords );
		ticker.container.appendChild( ticker.collapseIcon );
		
		ticker.container.style.display = 'inline-block';
	};
	
	var updateTickerDisplay = function(){
		ticker.title.innerHTML = ticker.data.systemName;
		ticker.owner.style.color = "rgb("+ticker.data.territoryOwner.r+","+ticker.data.territoryOwner.g+","+ticker.data.territoryOwner.b+")";
		ticker.owner.innerHTML = ticker.data.territoryOwner.name || "&nbsp;";
		ticker.lcoords.innerHTML = "HRC:["+ticker.data.localCoordinates.x + ", " + ticker.data.localCoordinates.y + "]";
		ticker.ucoords.innerHTML = "UC: ["+ticker.data.universalCoordinates.x + ", " + ticker.data.universalCoordinates.y + "]";
	};
	var sidebar = {
		container: {}
		,collapseIcon: {}
	};
	var loadSidebarDom = function(){
		
		sidebar.container = document.getElementById( 'hud_sidebar_container' );
		
		sidebar.collapseIcon = document.createElement( 'div' );
		
		sidebar.collapseIcon.setAttribute( 'id', 'hud_sidebar_collapse_icon' ); 
		
		sidebar.collapseIcon.setAttribute( 'title', 'Hide / Show' );
		
		sidebar.collapseIcon.innerHTML = '>>';
		
		sidebar.container.appendChild( sidebar.collapseIcon );
		
		sidebar.container.style.display = 'inline-block';
	};
	return hud;
}(); // IIFE to create st_hud



