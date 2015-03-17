"use strict"
//st_engine.js
//the core UI engine, mostly calling on attached modules. 


//namespace st_engine
var st_engine = st_engine || function(){
	var authentication = { username:"", hashword:"" };
	var DEBUG = st_DEBUG;
		
	var handleMouseMenu = function( event ){
			event.preventDefault();
	}; //handleMouseMenu()
	
	var handleMouseDown = function( event ){  
		st_graphics.dragging = true;
		var rect = st_graphics.canvas.getBoundingClientRect();
		var x = event.pageX - rect.left + st_graphics.camera.x();
		var y = event.pageY - rect.top - ( st_graphics.hex.h() / 2 ) + st_graphics.camera.y();
		var hexY = Math.floor( y / ( st_graphics.hex.h() + st_graphics.hex.side_length() ) );
		var hexX = Math.floor( ( x - ( hexY % 2 ) * st_graphics.hex.rad() ) / st_graphics.hex.rect_w() );
		st_graphics.drag_prev_x = event.pageX;
		st_graphics.drag_prev_y = event.pageY;
		if( st_graphics.DEBUG ){ 
			console.log( "click: virtual canvas("+x+","+y+");  grid("+hexX+","+hexY+");  literal canvas("+( event.pageX - rect.left )+","+( event.pageY - rect.top )+")" );
		}
		if( st_graphics.click_prev_hex.x == hexX && st_graphics.click_prev_hex.y == hexY && st_graphics.doubleclick ) {
			if( st_graphics.DEBUG ){console.log( "SELECTED:("+hexX+","+hexY+")");}
			st_graphics.selectHex({x:hexX, y:hexY});
			st_hud.selectHex({x:hexX, y:hexY});
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
				var retval = st_graphics.hex.setSideLength( st_graphics.hex.side_length() + st_graphics.hex.side_length() / 8 ); 
				if (retval.change){ st_graphics.camera.centerOnHex( retval.x, retval.y ); }
				break;
			case key.NP_3:
			case key.PAGE_DOWN:
				var retval = st_graphics.hex.setSideLength( st_graphics.hex.side_length() / ( 9/8 ) );
				if (retval.change){ st_graphics.camera.centerOnHex( retval.x, retval.y ); }
				break;
			case key.NP_7:
			case key.HOME:
				var retval = st_graphics.hex.setSideLength( st_graphics.initialHexSize );
				if (retval.change){ st_graphics.camera.centerOnHex( retval.x, retval.y ); }
				break;
			case key.NP_1:
			case key.END:
				st_graphics.camera.move( st_graphics.initialCameraX, st_graphics.initialCameraY );
				break;
		}
		if( st_graphics.DEBUG ){
			console.log( "Camera:("+st_graphics.camera.x()+","+st_graphics.camera.y()+")" );
		}
	}; // handleKeyDown()

	var handleMouseMove = function( event ){
		var rect = st_graphics.canvas.getBoundingClientRect();
		var x=event.pageX - rect.left + st_graphics.camera.x();
		var y=event.pageY - rect.top - ( st_graphics.hex.h() / 2 ) + st_graphics.camera.y();
		st_graphics.select.y = Math.floor( y / ( st_graphics.hex.h() + st_graphics.hex.side_length() ) );
		st_graphics.select.x = Math.floor( ( x - ( st_graphics.select.y % 2 ) * st_graphics.hex.rad() ) / st_graphics.hex.rect_w() );
		if( st_graphics.dragging ){
			st_graphics.camera.moveDelta( st_graphics.drag_prev_x - event.pageX, st_graphics.drag_prev_y - event.pageY );
			st_graphics.drag_prev_x = event.pageX;
			st_graphics.drag_prev_y = event.pageY;
		}
	} // handeMouseMove()

	var handleScroll = function( event ) {
		var delta = Math.max( -1, Math.min( 1, ( event.wheelDelta || -event.detail ) ) );
		var retval = st_graphics.hex.setSideLength( st_graphics.hex.side_length() + ( st_graphics.hex.side_length()*delta)/8 );
		if (retval.change){ st_graphics.camera.centerOnHex( retval.x, retval.y ); }
	}; // handleScroll()
	
	
	return {
		init: function(){
			st_graphics.initialize(); // start graphics module
			st_uas.initialize(); // start user account service module
			st_data.initialize();
			
			window.addEventListener  ( "mouseup", handleMouseUp, false);
			document.body.addEventListener( "keydown", handleKeyDown, false ); 
			st_graphics.canvas.setAttribute("tabindex", 0);
			st_graphics.canvas.addEventListener( "contextmenu", handleMouseMenu, false ); 
			st_graphics.canvas.addEventListener( "mousedown", handleMouseDown, false );
			st_graphics.canvas.addEventListener( "mousemove", handleMouseMove, false );
			st_graphics.canvas.addEventListener( "mousewheel", handleScroll, false );
			st_graphics.canvas.addEventListener( "DOMMouseScroll", handleScroll, false );  //firefox
			this.render();
		}
		,render: function(){
			st_graphics.render();
			
			if( DEBUG ){
				st_graphics.ctx.strokeStyle = "#00ff00";
				st_graphics.ctx.strokeRect( st_graphics.canvas_w/2, st_graphics.canvas_h/2, 2, 2); 
			}
			requestAnimationFrame( this.render.bind(this) );
		}
		,setAuthentication: function( auth ){
			if(typeof auth.username === "string" && typeof auth.hashword === "string"){
				this.authentication.username = auth.username;
				this.authentication.hashword = auth.hashword;
			} else{
				throw "st_engine:: Invalid Authentication";
			}
		}
		,getAuthentication: function(){
			return this.authentication;
		}
	};
			

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