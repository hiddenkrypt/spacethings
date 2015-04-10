"use strict"
// st_hud.js

// Provides a Heads Up Display of game data

var st_hud = st_hud || function(){
	var DEBUG = st_DEBUG.hud;

	var hashID = new Hashids("spaceTHINGS", 4, "0123456789ABCDEF");
	
	var hud = {
		initialize: function(){
			ticker.load();
			sidebar.load();
			if( DEBUG ){ console.log( "st_hud initialized" ); }
		}
		,render: function( ctx ){
			ticker.publish();
		}
		,selectHexAtGrid: function( coords ){
			if( st_data.loaded() ){
				ticker.update( st_data.getHexDataByGrid( coords ) );
			}
		}
		,disableMouse: function(){ 
		
			ticker.disableMouse();
			sidebar.disableMouse();
		}
		,enableMouse: function(){ 
			ticker.enableMouse();
			sidebar.enableMouse();
		}
	};
	
	var createHudElement = function( tag, id, title, parent){
		var element = document.createElement( tag );
		element.setAttribute( 'id', id );
		element.setAttribute( 'title', title );
		parent.appendChild( element );
		return element;
	};
	
	var ticker = (function(){
		var active = true
			,container = {}
			,title = {}
			,owner = {}
			,ucoords = {}
			,lcoords = {}
			,collapseIcon = {};
		
		return {
			data: {
				localCoordinates:{ x:-100, y:-100 }
				,universalCoordinates:{ x:-100, y:-100 }
				,territoryOwner: { r:0, g:0, b:0, name:"" }
				,system: {}
				,systemName: ""
			}
			,collapseIcon: {}
			,toggle: function(){
				if( active ){
					for( var i = 0; i < container.childNodes.length; i++){
						container.childNodes[i].style.display = 'none';
					}
					container.style.width = '1em';
					collapseIcon.innerHTML = '>>';
					collapseIcon.style.display = 'block';
				} else{
					for( var i = 0; i < container.childNodes.length; i++){
						container.childNodes[i].style.display = 'block';
					}
					container.style.width = '13em';
					collapseIcon.innerHTML = '<<';
				}
				active = !active;
			}
			,update: function( hexData ){
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
			}
			,publish: function(){
				title.innerHTML = ticker.data.systemName;
				owner.style.color = "rgb("+ticker.data.territoryOwner.r+","+ticker.data.territoryOwner.g+","+ticker.data.territoryOwner.b+")";
				owner.innerHTML = ticker.data.territoryOwner.name || "&nbsp;";
				lcoords.innerHTML = "HRC:["+ticker.data.localCoordinates.x + ", " + ticker.data.localCoordinates.y + "]";
				ucoords.innerHTML = "UC: ["+ticker.data.universalCoordinates.x + ", " + ticker.data.universalCoordinates.y + "]";
			}
			,load: function(){
				container = document.getElementById( 'hud_ticker_container' );
				title = createHudElement( 'div', 'hud_ticker_title', 'System/Sector Name', container );
				owner = createHudElement( 'div', 'hud_ticker_owner', 'System Owner', container );
				lcoords = createHudElement( 'div', 'hud_ticker_lcoords', 'Homeworld Relative Coordinates', container );
				ucoords = createHudElement( 'div', 'hud_ticker_ucoords', 'Universal Coordinates', container );
				collapseIcon = createHudElement( 'div', 'hud_ticker_collapse_icon', 'Hide / Show', container );
				collapseIcon.innerHTML = '<<';
				collapseIcon.addEventListener('mousedown', function(e){ticker.toggle();});
				container.style.display = 'inline-block';
			}
			,disableMouse: function(){
				container.style["pointer-events"] = "none"; 	
			}
			,enableMouse: function(){
				container.style["pointer-events"] = "auto"; 
			}
		};
	})(); 
	var sidebar = (function(){
		var active = true
			,container = {}
			,collapseIcon = {};
		return {
			load: function(){
				container = document.getElementById( 'hud_sidebar_container' );
				collapseIcon = createHudElement( 'div', 'hud_sidebar_collapse_icon', 'Hide / Show', container );
				collapseIcon.innerHTML = '>>';
				collapseIcon.addEventListener( 'mousedown', function(e){ sidebar.toggle(); } );
				container.style.display = 'inline-block';
			}
			,toggle: function(){
				if( active ){ //hide
					for( var i = 0; i < container.childNodes.length; i++){
						container.childNodes[i].style.display = 'none';
					}
					container.style.width = '1em';
					collapseIcon.innerHTML = '<<';
					collapseIcon.style.display = 'block';
				} else{ 
					for( var i = 0; i < container.childNodes.length; i++){
						container.childNodes[i].style.display = 'block';
					}
					container.style.width = '15em';
					collapseIcon.innerHTML = '>>';
				}
				active = !active;
			}
			,disableMouse: function(){
				container.style["pointer-events"] = "none"; 	
			}
			,enableMouse: function(){
				container.style["pointer-events"] = "auto"; 
			}
		};
	})();
	
	return hud;
}(); // IIFE to create st_hud



