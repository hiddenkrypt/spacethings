
//st_engine.js
//the core UI engine, mostly calling on attached modules. 

var st_engine = st_engine || function(){
	"use strict";
	
	var DEBUG = st_DEBUG.engine;
	var Overlay = {};
	var Canvas = {};
	var Context = {};
	var hexHighlight = { x:-1, y:-1 };
	var lastClickedHex = { x:-1, y:-1 };
	var doubleclick = false;
	var dClickWindow = 300;
	var dClickTimeout = {};
	
	
	var engine = {
		init: function(){
			Overlay =  document.getElementById( 'overlay' );
			Canvas = document.getElementById( "c" );
			Context = Canvas.getContext( "2d" );
			Canvas.style.width = Canvas.width = window.innerWidth;
			Canvas.style.height = Canvas.height = window.innerHeight;

			st_graphics.initialize(); // start graphics module
			st_uas.initialize(); // start user account service module
			st_data.initialize(); // start game data module
			st_hud.initialize(); // start heads up display module
			
			window.addEventListener  ( "mouseup", handleMouseUp, false);
			if( DEBUG ){ document.body.addEventListener( "keydown", handleKeyDown, false ); }
			Canvas.setAttribute("tabindex", 0);
			Canvas.addEventListener( "contextmenu", handleMouseMenu, false ); 
			Canvas.addEventListener( "mousedown", c_handleMouseDown, false );
			Canvas.addEventListener( "mousemove", handleMouseMove, false );
			Canvas.addEventListener( "mousewheel", handleScroll, false );
			Canvas.addEventListener( "DOMMouseScroll", handleScroll, false );  //firefox
			
			if( DEBUG ){ console.log( "Initialized Engine and all submodules. Kicking off renderer." ); }
			this.render();
		}
		,render: function(){		
			Canvas.style.width = Canvas.width = window.innerWidth;
			Canvas.style.height = Canvas.height = window.innerHeight;
			Context.clearRect( 0, 0, Canvas.width, Canvas.height ) ;
			
			st_graphics.render( Context );
			
			st_hud.render( ); // the hud has it's own canvas and context
			
			requestAnimationFrame( this.render.bind(this) );
		}
		,getHighlightedHex: function(){ return hexHighlight; }
		,canvas: function(){ return Canvas; }
		,ctx: function(){ return Context; }
		,loadComplete: function(){
			st_uas.hide();
			st_engine.hideOverlay();
			document.body.addEventListener( "keydown", handleKeyDown, false ); 
			st_graphics.selectHex( st_data.getHomeworld() );
			st_hud.show();
			st_hud.highlightHexAtGrid( st_data.getHomeworld() );
			st_hud.loadSidebar( st_data.getPlayerData() );
		}
		,showOverlay: function(){
			Overlay.style.display = 'block';
		}
		,hideOverlay: function(){
			Overlay.style.display = 'none';
		}
		,start: function(){
		}
	};
	
	
	var handleMouseMenu = function( event ){
			event.preventDefault();
	}; //handleMouseMenu()
	
	var c_handleMouseDown = function( event ){  
		st_hud.disableMouse();
		st_graphics.dragging = true;
		var rect = Canvas.getBoundingClientRect();
		var x = event.pageX - rect.left + st_graphics.camera.x();
		var y = event.pageY - rect.top - ( st_graphics.hex.h() / 2 ) + st_graphics.camera.y();
		var hexY = Math.floor( y / ( st_graphics.hex.h() + st_graphics.hex.sideLength() ) );
		var hexX = Math.floor( ( x - ( hexY % 2 ) * st_graphics.hex.rad() ) / st_graphics.hex.rect().w );
		st_graphics.drag_prev_x = event.pageX;
		st_graphics.drag_prev_y = event.pageY;
		if( DEBUG ){ 
			console.log( "click: virtual canvas("+x+","+y+");  grid("+hexX+","+hexY+");  literal canvas("+( event.pageX - rect.left )+","+( event.pageY - rect.top )+")" );
		}
		if( lastClickedHex.x == hexX && lastClickedHex.y == hexY && doubleclick ) {
			if( DEBUG ){ console.log( "SELECTED: (" + hexX + "," + hexY + ")" ); }
			st_graphics.selectHex( {x:hexX, y:hexY} );
			st_hud.selectHexAtGrid( {x:hexX, y:hexY} );
		} 
		lastClickedHex.x = hexX;
		lastClickedHex.y = hexY;
		doubleclick = true;
		clearTimeout( dClickTimeout );
		dClickTimeout = setTimeout( function(){ doubleclick = false; }, dClickWindow ); 
	}; //handleMousedown()

	var handleMouseUp = function( event ){
		st_graphics.dragging = false;
		st_hud.enableMouse();
	}; // private handleMouseUp()

	var handleKeyDown = function( event ){
		var keyCode = event.keyCode;
		switch (keyCode){
			
			case key.NP_7:
				st_graphics.camera.dx( -st_graphics.camera.z() * st_graphics.camera.speed() );
			case key.NP_8:
			case key.UP:
				st_graphics.camera.dy( -st_graphics.camera.z() * st_graphics.camera.speed() );
				break;
				
			case key.NP_3:
				st_graphics.camera.dx(  st_graphics.camera.z() *  st_graphics.camera.speed() );
			case key.NP_2:	
			case key.DOWN:
				st_graphics.camera.dy(  st_graphics.camera.z() * st_graphics.camera.speed() );
				break;
				
			case key.NP_1:
				st_graphics.camera.dy(  st_graphics.camera.z() * st_graphics.camera.speed() );
			case key.NP_4:	
			case key.LEFT:
				st_graphics.camera.dx( -st_graphics.camera.z() * st_graphics.camera.speed() );
				break;
				
			case key.NP_9:
				st_graphics.camera.dy( -st_graphics.camera.z() * st_graphics.camera.speed() );
			case key.NP_6:	
			case key.RIGHT:
				st_graphics.camera.dx(  st_graphics.camera.z() *  st_graphics.camera.speed() );
				break;
				
			case key.NP_PLUS:
			case key.PAGE_UP:
				st_graphics.camera.dzoom( st_graphics.camera.z() / 8 ); 
				break;
				
			case key.NP_MINUS:
			case key.PAGE_DOWN:
				st_graphics.camera.zoom( st_graphics.camera.z() / ( 9/8 ) );
				break;
				
			case key.HOME:
			case key.ENTER:
			case key.SPACE:
				st_graphics.camera.returnToInitialZoom();
				st_graphics.camera.returnToInitialPosition();
				break;
				
			case key.END:
				st_graphics.camera.returnToInitialZoom();
				break;
		}
		if( DEBUG ){
			console.log( "Camera:("+st_graphics.camera.x()+","+st_graphics.camera.y()+")" );
		}
	}; // handleKeyDown()

	var handleMouseMove = function( event ){
		var rect = Canvas.getBoundingClientRect();
		var x=event.pageX - rect.left + st_graphics.camera.x();
		var y=event.pageY - rect.top - ( st_graphics.hex.h() / 2 ) + st_graphics.camera.y();
		hexHighlight.y = Math.floor( y / ( st_graphics.hex.h() + st_graphics.hex.sideLength() ) );
		hexHighlight.x = Math.floor( ( x - ( hexHighlight.y % 2 ) * st_graphics.hex.rad() ) / st_graphics.hex.rect().w );
		st_hud.highlightHexAtGrid( hexHighlight );
		if( st_graphics.dragging ){
			st_graphics.camera.moveDelta( st_graphics.drag_prev_x - event.pageX, st_graphics.drag_prev_y - event.pageY );
			st_graphics.drag_prev_x = event.pageX;
			st_graphics.drag_prev_y = event.pageY;
		}
	}; // handeMouseMove()

	var handleScroll = function( event ) {
		var delta = Math.max( -1, Math.min( 1, ( event.wheelDelta || -event.detail ) ) );
		st_graphics.camera.dzoom( delta*st_graphics.camera.z() / 8 ); 
	}; // handleScroll()
	
	

	
	return engine;

}();


window.requestAnimationFrame = (function() {//animation shim
	return	window.requestAnimationFrame 
		|| 	window.mozRequestAnimationFrame 
		|| 	window.webkitRequestAnimationFrame 
		|| 	window.msRequestAnimationFrame
        || 	function( callback ){
				window.setTimeout(callback, 1000 / 60);
			};
})();