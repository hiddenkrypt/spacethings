"use strict"
// st_hud.js

// Provides a Heads Up Display of game data

var st_hud = st_hud || (function(){
	var DEBUG = st_DEBUG.hud;
	
	var hud = {
		initialize: function(){
			hexInfo.load();
			thingInfo.load();
			systemPopup.load();
			systemPopup.close();
			hexInfo.hide();
			thingInfo.hide();
			if( DEBUG ){ 
				hexInfo.show();
				thingInfo.show();
				// systemPopup.show();
				console.log( "st_hud initialized" ); 
			}
		}
		,highlightHexAtGrid: function( coords ){
			if( st_data.loaded() ){
				hexInfo.update( st_data.getHexDataByGrid( coords ) );
			}
		}
		,selectHexAtGrid: function( coords ){
			if( st_data.loaded() ){
				systemPopup.open( st_data.getSystemDataByGrid( coords ) );
			}
		}
		,disableMouse: function(){ 
			hexInfo.disableMouse();
			thingInfo.disableMouse();
		}
		,enableMouse: function(){ 
			hexInfo.enableMouse();
			thingInfo.enableMouse();
		}
		,loadSidebar: function( playerData ){
			thingInfo.update( playerData );
		}
		,render: function(){
			systemPopup.render();
		}
		,show: function(){
			hexInfo.show();
			thingInfo.show();
			systemPopup.close();
		}
		,hide: function(){
			hexInfo.hide();
			thingInfo.hide();
			systemPopup.close();
		}
	};
	
	var createHudElement = function( tag, id, title, parent){
		var element = document.createElement( tag );
		element.setAttribute( 'id', id );
		element.setAttribute( 'title', title );
		parent.appendChild( element );
		return element;
	};
	
	var hexInfo = (function(){
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
					for( let i = 0; i < container.childNodes.length; i++ ){
						container.childNodes[i].style.display = 'none';
					}
					container.style.width = '1em';
					collapseIcon.innerHTML = '>>';
					collapseIcon.style.display = 'block';
				} else{
					for( let i = 0; i < container.childNodes.length; i++ ){
						container.childNodes[i].style.display = 'block';
					}
					container.style.width = '13em';
					collapseIcon.innerHTML = '<<';
				}
				active = !active;
			}
			,update: function( hexData ){
				var homeworld = st_data.getHomeworld();
				lcoords.innerHTML = "HRC: "+hexData.coords.local;
				ucoords.innerHTML = "UC: "+hexData.coords.universal;
		
				title.innerHTML = hexData.name;
				owner.innerHTML = hexData.ownerName;
			}
			
			,load: function(){
				container = createHudElement( 'div', 'hud_hexInfo_container', '', document.getElementById( 'b' ) );
				
				title = createHudElement( 'div', 'hud_hexInfo_title', 'System/Sector Name', container );
				owner = createHudElement( 'div', 'hud_hexInfo_owner', 'System Owner', container );
				lcoords = createHudElement( 'div', 'hud_hexInfo_lcoords', 'Homeworld Relative Coordinates', container );
				ucoords = createHudElement( 'div', 'hud_hexInfo_ucoords', 'Universal Coordinates', container );
				collapseIcon = createHudElement( 'div', 'hud_hexInfo_collapse_icon', 'Hide / Show', container );
				collapseIcon.innerHTML = '<<';
				collapseIcon.addEventListener( 'mousedown', function(e){ hexInfo.toggle(); } );
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
	})(); //hexInfo IIFE
	
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
				
				orders[0].setAttribute( 'class', 'hud_thingInfo_orders' );
				orders[1].setAttribute( 'class', 'hud_thingInfo_orders' );
				orders[2].setAttribute( 'class', 'hud_thingInfo_orders' );
				orders[3].setAttribute( 'class', 'hud_thingInfo_orders' );
						
				orders[0].innerHTML = "&nbsp;";
				orders[1].innerHTML = "&nbsp;";
				orders[2].innerHTML = "&nbsp;";
				orders[3].innerHTML = "&nbsp;";
				military.label.innerHTML = "Military Strength: ";
				resources.label.innerHTML = "Resources: "; 
				population.label.innerHTML = "Total Population: ";
				
				collapseIcon.innerHTML = '>>';
				collapseIcon.addEventListener( 'mousedown', function(e){ thingInfo.toggle(); } );
			}
			,toggle: function(){
				if( active ){
					for( let i = 0; i < container.childNodes.length; i++){
						container.childNodes[i].style.display = 'none';
					}
					container.style.width = '1em';
					container.style.height = '3em';
					collapseIcon.innerHTML = '<<';
					collapseIcon.style.display = 'block';
				} else{ 
					for( let i = 0; i < container.childNodes.length; i++){
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
	})(); //thingInfo IIFE

	var systemPopup = (function(){
		var dom = {
			PopupContainer: {}
			,canvas: {}
			,closeButton: {}
		};
		var data = { 
			star: {}
			,planets: []
		};
		var ctx = {};
		var active = false;
		
		var planetInfo = (function(){
			var container = {};
			var name = {};
			var classification = {};
			var population = {};
			var resources = {};
			var selection = 0;
			return {
				load: function(){
					container = createHudElement( 'div', 'hud_systemPopup_planetInfo', '', dom.PopupContainer );
				}
				,update: function( planet ){
					
				}
				,show: function(){
					container.style.display = 'block';
				}
				,hide: function(){
					container.style.display = 'none';
				}
			}
		})(); // systemPopup::planetInfo IIFE
		var starInfo = (function(){
			var container = {};
			var ucoords = {};
			var title = {};
			var classification = {};
			var population = {};
			var resources = {};
			return {
				load: function(){					
					container = createHudElement( 'div', 'hud_systemPopup_starInfo', '', dom.PopupContainer );
					title = createHudElement( 'div', 'hud_systemPopup_starInfo_title', '', container ); 
					classification = createHudElement( 'div', 'hud_systemPopup_starInfo_classification', '', container ); 
					ucoords = createHudElement( 'div', 'hud_systemPopup_starInfo_ucoords', '', container ); 
					population = createHudElement( 'div', 'hud_systemPopup_starInfo_population', '', container ); 
					resources = createHudElement( 'div', 'hud_systemPopup_starInfo_resources', '', container ); 
					title.innerHTML = 'Title';
					classification.innerHTML = 'Classification: ';
					ucoords.innerHTML = 'Universal Coordinates: ';
					population.innerHTML = 'System Population: ';
					resources.innerHTML = 'System Net Resources: ';
					
				}
				,update: function( system ){
					title.innerHTML = system.adjective + " System";
					console.log( system.star );
					classification.innerHTML = system.star.mkSpectrum + system.star.magnitude + "-" + system.star.mkClass;
					ucoords.innerHTML = 'Universal Coordinates: '+system.coords.universal;
					population.innerHTML = 'System Population: '+system.population;
					resources.innerHTML = 'System Net Resources: '+system.resources;
				}
			};
		})(); // systemPopup::planetInfo IIFE
		
		return {
			load: function(){
				dom.PopupContainer = createHudElement( 'div', 'hud_systemPopup_container', '', document.getElementById( 'b' ) );
				dom.canvas = createHudElement( 'canvas', 'hud_systemPopup_canvas', '', dom.PopupContainer );
				dom.closeButton =  createHudElement( 'div', 'hud_systemPopup_closeButton', 'Close System View', dom.PopupContainer );
				ctx = dom.canvas.getContext( "2d" );
				dom.canvas.style.width = dom.canvas.width = dom.PopupContainer.clientwidth;
				dom.canvas.style.height = dom.canvas.height = dom.PopupContainer.clientheight;
				dom.closeButton.innerHTML = "X";
				dom.closeButton.addEventListener( 'mousedown', function(e){ 
					systemPopup.close(); 
				} );
				
				starInfo.load();
				//planetInfo.load();

			}
			,open: function( systemData ){ 
				if( !systemData ){
					systemPopup.hide();
					return;
				}
				active = true;
				starInfo.update( systemData );
				data.star = systemData.star;
				data.planets = systemData.planets;
				console.log( data.planets );
				dom.PopupContainer.style.display = 'block';
				hexInfo.hide();
				thingInfo.hide();
			}
			,close: function(){
				dom.PopupContainer.style.display = 'none';
				active = false;
				hexInfo.show();
				thingInfo.show();
			}
			,render: function( ){
				if( !active ){ return; }
				dom.canvas.width  = dom.canvas.offsetWidth;
				dom.canvas.height = dom.canvas.offsetHeight;
				var limitingEdge = dom.canvas.width/8;
				var starRadius = (data.star.magnitude+1)*(data.star.magnitude+1)*5;
				var starX = limitingEdge - starRadius;
				var starY = dom.canvas.height / 2;
				ctx.save();
					ctx.beginPath();
					ctx.arc(starX, starY, starRadius, 0, Math.PI*2, 1);
					ctx.fillStyle = "rgba(" + data.star.color + ", 1)";
					ctx.shadowColor = "rgba(" + data.star.color + ", 1)";
					ctx.shadowBlur = 50;
					ctx.fill();
					ctx.fill();
					ctx.closePath();
				ctx.restore();
				

				/*
					all orbitals have x,y of the star's center. 
					orbit radii are not to scale, and should adjust based on data.planets.length
					orbits aren't to scale, but drawing too close or too far from the star looks bad. 
					the goldilocks max and min aren't literally the goldilocks zone, but outside this 
					zone the planets risk being occluded by the star corona, or being drawn off canvas. 				
				*/				
				/*
					The number of planets defines how to space the orbits. Even spacing, centered in the zone
					follows the formula:
						planetX = KX / (N+1)
					where K is the index of the planet, N is the number of planets, and X is the width of the virtual goldilocks zone
					for one planet: X/2 is where the orbit should be in the middle of the screen
					
					The radii of the orbits is then the distance from starX to planetX
						orbitRadius = planetX - starX
					And we'll draw the arc from -90deg to +90deg (using radians as arguments) 
				*/
				var goldilocksMin = limitingEdge * 2;
				var goldilocksMax = limitingEdge * 7;
				var habitableZone = goldilocksMax - goldilocksMin;
					
				data.planets.forEach( function( planet, index ){
					var planetY = starY;
					var planetX = goldilocksMin + ( ( ( index + 1 ) * habitableZone ) / ( data.planets.length + 1 ) );
					var orbitRadius = planetX - starX;
					//draw Orbit
					ctx.beginPath();
						ctx.arc(starX, starY, orbitRadius, 0, Math.PI*2, false);
						ctx.strokeStyle = "#ffffff";
						ctx.stroke();
					ctx.closePath();
					//planet
					ctx.beginPath();
						ctx.arc(planetX, planetY, 15, 0, Math.PI*2, false);
						ctx.strokeStyle = "#ffffff";
						ctx.fillStyle = "#006600";
						ctx.fill();
						ctx.stroke();
					ctx.closePath();
				});
			}
		}
	})();
	
	return hud;
})(); // IIFE to create st_hud
