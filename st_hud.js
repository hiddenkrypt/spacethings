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
			ticker.hide();
			sidebar.hide();
			if( DEBUG ){ 
				ticker.show();
				sidebar.show();
				console.log( "st_hud initialized" ); 
			}
		}
		,render: function( ctx ){
		//	ticker.publish();
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
		,loadSidebar: function( playerData ){
			sidebar.update( playerData );
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
				lcoords.innerHTML = "HRC:["+ -(homeworld.x - hexData.coords.x) + ", " + (homeworld.y - hexData.coords.y) + "]";
				ucoords.innerHTML = "UC: ["+ hashID.encode( hexData.coords.x + 100 ) + ", " + hashID.encode( hexData.coords.y + 100 ) + "]";

				if( hexData.system && hexData.system.name ){
					title.innerHTML = hexData.system.name;
				} else if( !hexData.owner && hexData.system ){
					title.innerHTML = "Unclaimed System";
				} else if( hexData.owner && !hexData.system ){
					title.innerHTML = hexData.owner.adjective+" Space";
				} 
				if( hexData.owner && hexData.system ){
					owner.innerHTML = hexData.owner.name;
				} else{
					owner.innerHTML = "&nbsp;";
				}
				// ticker.publish();
			}
			
			,load: function(){
				container = createHudElement( 'div', 'hud_ticker_container', '', document.getElementById( 'b' ) );
				
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
				container.style["pointer-events"] = 'none'; 	
			}
			,enableMouse: function(){
				container.style["pointer-events"] = 'auto'; 
			}
			,hide: function(){
				container.style.display = 'none';
			}
			,show: function(){
				container.style.display = 'block';
			}
		};
	})(); 
	var sidebar = (function(){
		var active = true
			,container = {}
			,logo = {}
			,name = {}
			,military = {
				container: {}
				,label: {}
				,value: {}
			}
			,population = {
				container: {}
				,label: {}
				,value: {}
			}
			,resources = {
				container: {}
				,label: {}
				,value: {}
			}
			,orders = [{},{},{},{}]
			,collapseIcon = {};
		return {
			load: function(){
				container = createHudElement( 'div', 'hud_sidebar_container', '', document.getElementById( 'b' ) );
				collapseIcon = createHudElement( 'div', 'hud_sidebar_collapse_icon', 'Hide / Show', container );
				logo = createHudElement( 'img', 'hud_sidebar_thing_logo', 'Your THING', container );
				name = createHudElement( 'div', 'hud_sidebar_thing_name', 'Your THING', container );				
				military.container = createHudElement( 'div', 'hud_sidebar_military_container', 'Current Military Score', container );
				resources.container = createHudElement( 'div', 'hud_sidebar_resources_container', 'Current THING-wide resource level', container );
				population.container = createHudElement( 'div', 'hud_sidebar_population_container', 'Current Galactic Population', container );
				orders[0] = createHudElement( 'div', '', 'Orders', container );
				orders[1] = createHudElement( 'div', '', 'Orders', container );
				orders[2] = createHudElement( 'div', '', 'Orders', container );
				orders[3] = createHudElement( 'div', '', 'Orders', container );
				military.label = createHudElement( 'span', 'hud_sidebar_military_label', 'Current Military Score', military.container );
				resources.label = createHudElement( 'span', 'hud_sidebar_resources_label', 'Current Military Score', resources.container );
				population.label = createHudElement( 'span', 'hud_sidebar_population_label', 'Current Military Score', population.container );
				military.value = createHudElement( 'span', 'hud_sidebar_military_value', 'Current Military Score', military.container );
				resources.value = createHudElement( 'span', 'hud_sidebar_resources_value', 'Current Military Score', resources.container );
				population.value = createHudElement( 'span', 'hud_sidebar_population_value', 'Current Military Score', population.container );
				
				orders[0].setAttribute( 'class', 'hud_orders' );
				orders[1].setAttribute( 'class', 'hud_orders' );
				orders[2].setAttribute( 'class', 'hud_orders' );
				orders[3].setAttribute( 'class', 'hud_orders' );
						
				orders[0].innerHTML = "&nbsp;";
				orders[1].innerHTML = "&nbsp;";
				orders[2].innerHTML = "&nbsp;";
				orders[3].innerHTML = "&nbsp;";
				military.label.innerHTML = "Military Strength: ";
				resources.label.innerHTML = "Resources: "; 
				population.label.innerHTML = "Total Population: ";
				
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
			,update: function( playerData ){ 
				logo.setAttribute( 'src', playerData.logo );
				logo.style["border-color"] = "rgb(" + playerData.color + ")";
				name.innerHTML = playerData.name;
				military.value.innerHTML = playerData.militaryPower;
				population.value.innerHTML = playerData.population;
				resources.value.innerHTML = playerData.resources;
			}
			,hide: function(){
				container.style.display = 'none';
			}
			,show: function(){
				container.style.display = 'block';
			}
		};
	})();
			// playerData = {
			// loaded: true
			// ,id: 7
			// ,name: "Waaagh 'elmit'ead"
			// ,race: "Da Orks"
			// ,adjective: "Ork"
			// ,homeworld: { x: 21, y: 15, id:66}
			// ,military_power: 15
			// ,population: 23
			// ,resources: 24
			// ,logo:".\7_logo_test.png"

	return hud;
}(); // IIFE to create st_hud



