"use strict"
// st_hud.js

// Provides a Heads Up Display of game data

var st_hud = st_hud || function(){
	var DEBUG = st_DEBUG.hud;

	var hashID = new Hashids("spaceTHINGS", 4, "0123456789ABCDEF");
	
	var hud = {
		initialize: function(){
			highlightedHexInfo.load();
			thingInfo.load();
			highlightedHexInfo.hide();
			thingInfo.hide();
			if( DEBUG ){ 
				highlightedHexInfo.show();
				thingInfo.show();
				console.log( "st_hud initialized" ); 
			}
		}
		,selectHexAtGrid: function( coords ){
			if( st_data.loaded() ){
				highlightedHexInfo.update( st_data.getHexDataByGrid( coords ) );
			}
		}
		,disableMouse: function(){ 
		
			highlightedHexInfo.disableMouse();
			thingInfo.disableMouse();
		}
		,enableMouse: function(){ 
			highlightedHexInfo.enableMouse();
			thingInfo.enableMouse();
		}
		,loadSidebar: function( playerData ){
			thingInfo.update( playerData );
		}
	};
	
	var createHudElement = function( tag, id, title, parent){
		var element = document.createElement( tag );
		element.setAttribute( 'id', id );
		element.setAttribute( 'title', title );
		parent.appendChild( element );
		return element;
	};
	
	var highlightedHexInfo = (function(){
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
				title.innerHTML = hexData.name;
				owner.innerHTML = hexData.ownerName;
			}
			
			,load: function(){
				container = createHudElement( 'div', 'hud_highlightedHexInfo_container', '', document.getElementById( 'b' ) );
				
				title = createHudElement( 'div', 'hud_highlightedHexInfo_title', 'System/Sector Name', container );
				owner = createHudElement( 'div', 'hud_highlightedHexInfo_owner', 'System Owner', container );
				lcoords = createHudElement( 'div', 'hud_highlightedHexInfo_lcoords', 'Homeworld Relative Coordinates', container );
				ucoords = createHudElement( 'div', 'hud_highlightedHexInfo_ucoords', 'Universal Coordinates', container );
				collapseIcon = createHudElement( 'div', 'hud_highlightedHexInfo_collapse_icon', 'Hide / Show', container );
				collapseIcon.innerHTML = '<<';
				collapseIcon.addEventListener('mousedown', function(e){highlightedHexInfo.toggle();});
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
	var thingInfo = (function(){
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
				container = createHudElement( 'div', 'hud_thingInfo_container', '', document.getElementById( 'b' ) );
				collapseIcon = createHudElement( 'div', 'hud_thingInfo_collapse_icon', 'Hide / Show', container );
				logo = createHudElement( 'img', 'hud_thingInfo_thing_logo', 'Your THING', container );
				name = createHudElement( 'div', 'hud_thingInfo_thing_name', 'Your THING', container );				
				military.container = createHudElement( 'div', 'hud_thingInfo_military_container', 'Current Military Score', container );
				resources.container = createHudElement( 'div', 'hud_thingInfo_resources_container', 'Current THING-wide resource level', container );
				population.container = createHudElement( 'div', 'hud_thingInfo_population_container', 'Current Galactic Population', container );
				orders[0] = createHudElement( 'div', '', 'Orders', container );
				orders[1] = createHudElement( 'div', '', 'Orders', container );
				orders[2] = createHudElement( 'div', '', 'Orders', container );
				orders[3] = createHudElement( 'div', '', 'Orders', container );
				military.label = createHudElement( 'span', 'hud_thingInfo_military_label', 'Current Military Score', military.container );
				resources.label = createHudElement( 'span', 'hud_thingInfo_resources_label', 'Current Military Score', resources.container );
				population.label = createHudElement( 'span', 'hud_thingInfo_population_label', 'Current Military Score', population.container );
				military.value = createHudElement( 'span', 'hud_thingInfo_military_value', 'Current Military Score', military.container );
				resources.value = createHudElement( 'span', 'hud_thingInfo_resources_value', 'Current Military Score', resources.container );
				population.value = createHudElement( 'span', 'hud_thingInfo_population_value', 'Current Military Score', population.container );
				
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
				collapseIcon.addEventListener( 'mousedown', function(e){ thingInfo.toggle(); } );
				container.style.display = 'inline-block';
			}
			,toggle: function(){
				if( active ){
					for( var i = 0; i < container.childNodes.length; i++){
						container.childNodes[i].style.display = 'none';
					}
					container.style.width = '1em';
					container.style.height = '3em';
					collapseIcon.innerHTML = '<<';
					collapseIcon.style.display = 'block';
				} else{ 
					for( var i = 0; i < container.childNodes.length; i++){
						container.childNodes[i].style.display = 'block';
					}
					container.style.width = '15em';
					container.style.height = '';
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

	return hud;
}(); // IIFE to create st_hud



