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
		}
		,render: function( ctx ){
			ticker.update();
		}
		,selectHexAtGrid: function( coords ){
			if( st_data.loaded() ){
				updateTickerData( st_data.getHexDataByGrid( coords ) );
			}
		}
		,disableMouse: function(){ ticker.container.style["pointer-events"] = "none"; }
		,enableMouse: function(){ ticker.container.style["pointer-events"] = "auto"; }
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
		active: true
		,container: {}
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
		,toggle: function(){
			if( this.active ){
				for( var i = 0; i < this.container.childNodes.length; i++){
					this.container.childNodes[i].style.display = 'none';
				}
				this.container.style.width = '1em';
				this.collapseIcon.innerHTML = '>>';
				this.collapseIcon.style.display = 'block';
			} else{
				for( var i = 0; i < this.container.childNodes.length; i++){
					this.container.childNodes[i].style.display = 'block';
				}
				this.container.style.width = '13em';
				this.collapseIcon.innerHTML = '<<';
			}
			this.active = !this.active;
		}
		,update: function(){
			this.title.innerHTML = this.data.systemName;
			this.owner.style.color = "rgb("+this.data.territoryOwner.r+","+this.data.territoryOwner.g+","+this.data.territoryOwner.b+")";
			this.owner.innerHTML = this.data.territoryOwner.name || "&nbsp;";
			this.lcoords.innerHTML = "HRC:["+this.data.localCoordinates.x + ", " + this.data.localCoordinates.y + "]";
			this.ucoords.innerHTML = "UC: ["+this.data.universalCoordinates.x + ", " + this.data.universalCoordinates.y + "]";
		}
		,load: function(){
			this.container = document.getElementById( 'hud_ticker_container' );
			this.title = document.createElement( 'div' );
			this.owner = document.createElement( 'div' );
			this.lcoords = document.createElement( 'div' );
			this.ucoords = document.createElement( 'div' );		
			this.collapseIcon = document.createElement( 'div' );	
			this.title.setAttribute( 'id', 'hud_ticker_title' );
			this.owner.setAttribute( 'id', 'hud_ticker_owner' );
			this.lcoords.setAttribute( 'id', 'hud_ticker_lcoords' );
			this.ucoords.setAttribute( 'id', 'hud_ticker_ucoords' );
			this.collapseIcon.setAttribute( 'id', 'hud_ticker_collapse_icon' ); 
			this.title.setAttribute( 'title', 'System/Sector name' );
			this.owner.setAttribute( 'title', 'System Owner' );
			this.lcoords.setAttribute( 'title', 'Homeworld Relative Coordinates' );
			this.ucoords.setAttribute( 'title', 'Universal Coordinates' );
			this.collapseIcon.setAttribute( 'title', 'Hide / Show' );
			this.collapseIcon.innerHTML = '<<';
			this.collapseIcon.addEventListener('mousedown', function(e){ticker.toggle();});
			this.container.appendChild( this.title );
			this.container.appendChild( this.owner );
			this.container.appendChild( this.lcoords );
			this.container.appendChild( this.ucoords );
			this.container.appendChild( this.collapseIcon );	
			this.container.style.display = 'inline-block';
		}
	}; 
	
	var sidebar = {
		active: true
		,container: {}
		,collapseIcon: {}
		,hide: function(){}
		,show: function(){}
		,load: function(){
			sidebar.container = document.getElementById( 'hud_sidebar_container' );
			
			sidebar.collapseIcon = document.createElement( 'div' );
			
			sidebar.collapseIcon.setAttribute( 'id', 'hud_sidebar_collapse_icon' ); 
			
			sidebar.collapseIcon.setAttribute( 'title', 'Hide / Show' );
			
			sidebar.collapseIcon.innerHTML = '>>';
			
			sidebar.collapseIcon.addEventListener('mousedown', function(e){sidebar.toggle();});
			sidebar.container.appendChild( sidebar.collapseIcon );
			
			sidebar.container.style.display = 'inline-block';
		}
		,toggle: function(){
			if( sidebar.active ){ //hide
				for( var i = 0; i < sidebar.container.childNodes.length; i++){
					sidebar.container.childNodes[i].style.display = 'none';
				}
				sidebar.container.style.width = '1em';
				sidebar.collapseIcon.innerHTML = '<<';
				sidebar.collapseIcon.style.display = 'block';
			} else{ 
				for( var i = 0; i < this.container.childNodes.length; i++){
					this.container.childNodes[i].style.display = 'block';
				}
				sidebar.container.style.width = '15em';
				sidebar.collapseIcon.innerHTML = '>>';
			}
			sidebar.active = !sidebar.active;
		}
	};
	return hud;
}(); // IIFE to create st_hud



