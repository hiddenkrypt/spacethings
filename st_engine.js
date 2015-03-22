
//st_engine.js
//the core UI engine, mostly calling on attached modules. 

var st_engine = st_engine || function(){
	"use strict";
	
	var authentication = { username:"", hashword:"" };
	var DEBUG = st_DEBUG.engine;
	var Canvas = {};
	var Context = {};
	
	var engine = {
		init: function(){
			
			Canvas = document.getElementById( "c" );
			Context = Canvas.getContext( "2d" );
			
			st_graphics.initialize(); // start graphics module
			st_uas.initialize(); // start user account service module
			st_data.initialize(); // start game data module
			st_hud.initialize(); // start heads up display module
			
			window.addEventListener  ( "mouseup", handleMouseUp, false);
			document.body.addEventListener( "keydown", handleKeyDown, false ); 
			Canvas.setAttribute("tabindex", 0);
			Canvas.addEventListener( "contextmenu", handleMouseMenu, false ); 
			Canvas.addEventListener( "mousedown", handleMouseDown, false );
			Canvas.addEventListener( "mousemove", handleMouseMove, false );
			Canvas.addEventListener( "mousewheel", handleScroll, false );
			Canvas.addEventListener( "DOMMouseScroll", handleScroll, false );  //firefox
			this.render();
		}
		,render: function(){		
			
			Canvas.style.width = Canvas.width = window.innerWidth -25;
			Canvas.style.height = Canvas.height = window.innerHeight -25;
			
			Context.clearRect( 0, 0, Canvas.width, Canvas.height ) ;
			
			st_graphics.render( Context );
			st_hud.render( Context );
			
			requestAnimationFrame( this.render.bind(this) );
		}
		,setAuthentication: function( auth ){
			authentication.username = auth.username;
			authentication.hashword = auth.hashword;
		}
		,getAuthentication: function(){ return authentication; }
		,canvas: function(){ return Canvas; }
		,ctx: function(){ return Context; }
	};
	
	
	var handleMouseMenu = function( event ){
			event.preventDefault();
	}; //handleMouseMenu()
	
	var handleMouseDown = function( event ){  
		st_graphics.dragging = true;
		var rect = Canvas.getBoundingClientRect();
		var x = event.pageX - rect.left + st_graphics.camera.x();
		var y = event.pageY - rect.top - ( st_graphics.hex.h() / 2 ) + st_graphics.camera.y();
		var hexY = Math.floor( y / ( st_graphics.hex.h() + st_graphics.hex.side_length() ) );
		var hexX = Math.floor( ( x - ( hexY % 2 ) * st_graphics.hex.rad() ) / st_graphics.hex.rect_w() );
		st_graphics.drag_prev_x = event.pageX;
		st_graphics.drag_prev_y = event.pageY;
		if( DEBUG ){ 
			console.log( "click: virtual canvas("+x+","+y+");  grid("+hexX+","+hexY+");  literal canvas("+( event.pageX - rect.left )+","+( event.pageY - rect.top )+")" );
		}
		if( st_graphics.click_prev_hex.x == hexX && st_graphics.click_prev_hex.y == hexY && st_graphics.doubleclick ) {
			if( DEBUG ){ console.log( "SELECTED:("+hexX+","+hexY+")" ); }
			st_graphics.selectHex( {x:hexX, y:hexY} );
			st_hud.selectHexAtGrid( {x:hexX, y:hexY} );
		} 
		st_graphics.click_prev_hex.x = hexX;
		st_graphics.click_prev_hex.y = hexY;
		st_graphics.doubleclick = true;
		clearTimeout(st_graphics.dClickTimeout);
		st_graphics.dClickTimeout = setTimeout( function(){ st_graphics.doubleclick = false; }, st_graphics.dClickWindow ); 
	}; //handleMousedown()

	var handleMouseUp = function( event ){
		st_graphics.dragging = false;
	}; // private handleMouseUp()

	var handleKeyDown = function( event ){
		var keyCode = event.keyCode;
		var retval = {change:false};
		switch (keyCode){
			case key.NP_8:	
			case key.UP:
				st_graphics.camera.dy( -st_graphics.hex.side_length() * st_graphics.camera.speed() );
				break;
			case key.NP_2:	
			case key.DOWN:
				st_graphics.camera.dy(  st_graphics.hex.side_length() * st_graphics.camera.speed() );
				break;
			case key.NP_4:	
			case key.LEFT:
				st_graphics.camera.dx( -st_graphics.hex.side_length() * st_graphics.camera.speed() );
				break;
			case key.NP_6:
			case key.RIGHT:
				st_graphics.camera.dx(  st_graphics.hex.side_length() *  st_graphics.camera.speed() );
				break;
			case key.NP_9:
			case key.PAGE_UP:
				retval = st_graphics.hex.setSideLength( st_graphics.hex.side_length() + st_graphics.hex.side_length() / 8 ); 
				if (retval.change){ st_graphics.camera.centerOnHex( retval.x, retval.y ); }
				break;
			case key.NP_3:
			case key.PAGE_DOWN:
				retval = st_graphics.hex.setSideLength( st_graphics.hex.side_length() / ( 9/8 ) );
				if (retval.change){ st_graphics.camera.centerOnHex( retval.x, retval.y ); }
				break;
			case key.NP_7:
			case key.HOME:
				retval = st_graphics.hex.setSideLength( st_graphics.initialHexSize );
				if (retval.change){ st_graphics.camera.centerOnHex( retval.x, retval.y ); }
				break;
			case key.NP_1:
			case key.END:
				st_graphics.camera.move( st_graphics.initialCameraX, st_graphics.initialCameraY );
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
		st_graphics.select.y = Math.floor( y / ( st_graphics.hex.h() + st_graphics.hex.side_length() ) );
		st_graphics.select.x = Math.floor( ( x - ( st_graphics.select.y % 2 ) * st_graphics.hex.rad() ) / st_graphics.hex.rect_w() );
		if( st_graphics.dragging ){
			st_graphics.camera.moveDelta( st_graphics.drag_prev_x - event.pageX, st_graphics.drag_prev_y - event.pageY );
			st_graphics.drag_prev_x = event.pageX;
			st_graphics.drag_prev_y = event.pageY;
		}
	}; // handeMouseMove()

	var handleScroll = function( event ) {
		var delta = Math.max( -1, Math.min( 1, ( event.wheelDelta || -event.detail ) ) );
		var retval = st_graphics.hex.setSideLength( st_graphics.hex.side_length() + ( st_graphics.hex.side_length()*delta)/8 );
		if (retval.change){ st_graphics.camera.centerOnHex( retval.x, retval.y ); }
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