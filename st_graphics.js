
//st_graphics.js


var st_graphics = st_graphics || function(){	
	"use strict";
	var graphicsModule = {
		DEBUG:				false//st_DEBUG
		,ctx:  				{}
		,canvas: 			{}
		,camera:			{}
		,canvas_w:			window.innerWidth
		,canvas_h:			window.innerHeight
		,hex:				{}
		,h:					10
		,w:					10
		,line_w:			1
		,max_zoom:			100
		,min_zoom:			10
		,select:			{x:-1, y:-1}
		,dragging:			false
		,drag_prev_x:		0
		,drag_prev_y:		0
		,click_prev_hex:	{ x:-1, y:-1 }
		,bg_filename:		'images/stars.jpg'
		,imageLoaded: 		false
		,background: 		new Image()
		,parallax_d: 		0.1
		,doubleclick:		false
		,dClickWindow:		300
		,dClickTimeout: 	{}
		,initialHexSize:	90
		,initialCameraX:	100
		,initialCameraY:	100
		,initialize:		function(){}
		,render:			function(){}
		,getNewHex:			function(){}
		,selectHex:			function(){}
	};

	graphicsModule.initialize = function(){
		st_graphics.hex = createHexagon( st_graphics.initialHexSize );
		st_graphics.camera = createCamera( 100,100 );
		st_graphics.camera.move(100,100);
		st_graphics.background.src = st_graphics.bg_filename;
		st_graphics.background.onload = function(){ 
			st_graphics.imageLoaded = true; 
			if(st_graphics.DEBUG){
				console.log("image:("+st_graphics.background.width+","+st_graphics.background.height+")"); 
				console.log("canvas:("+st_graphics.canvas_w+","+st_graphics.canvas_h+")");
			}
		};
		st_graphics.canvas = document.getElementById( "c" );
		st_graphics.ctx = st_graphics.canvas.getContext( "2d" );
	}; // public initialize()
	
	graphicsModule.render = function(){
		st_graphics.canvas_w = window.innerWidth -25;
		st_graphics.canvas_h = window.innerHeight -25;
		st_graphics.canvas.style.width = st_graphics.canvas.width = st_graphics.canvas_w;
		st_graphics.canvas.style.height = st_graphics.canvas.height = st_graphics.canvas_h;
		st_graphics.ctx.clearRect( 0, 0, st_graphics.canvas_w, st_graphics.canvas_h ) ;
		if( st_graphics.imageLoaded ){
			drawBackground( st_graphics.ctx );
		}
		if( !st_data.loaded() ){
			drawDefaultHexField( st_graphics.ctx );
		} else {
			drawLoadedHexField( st_graphics.ctx );
		}
		drawMouseCursor( st_graphics.ctx );
	}; // public render()
	graphicsModule.getNewHex = function(){
		return createHexagon();
	};
	var createCamera = function(){
		var camera_speed = 2/3
			,pos_x = 100
			,pos_y = 100;
		return {
			x: function(){ return pos_x; }
			,y: function(){ return pos_y; }
			,speed: function(){ return camera_speed; }
			,move: function(new_x,new_y){
				pos_x = new_x;
				pos_y = new_y;
			}
			,moveDelta: function(dx, dy){
				if( typeof dx === 'number' ){ pos_x += dx; }
				if( typeof dy === 'number' ){ pos_y += dy; }
			}
			,dx: function( dx ){ pos_x += dx; }
			,dy: function( dy ){ pos_y += dy; }
			,centerOnHex: function( hex_x, hex_y ){  
				pos_y = ( hex_y * ( st_graphics.hex.rect_w() - ( st_graphics.hex.h() / 2 ) +(0.015*st_graphics.hex.side_length()) ) ) - ( st_graphics.canvas_h/2 ) + ( st_graphics.hex.h() + st_graphics.hex.side_length()/2 );
				pos_x = ( hex_x *  st_graphics.hex.rect_w() ) - ( st_graphics.canvas_w/2 ) + st_graphics.hex.rect_w()/(hex_y%2?1:2);
			}
		};
	}; //private createCamera() camera constructor
	
	var createHexagon = function( size ){
		var hex_side_length=	size;
		var hex_rad =  			hex_side_length * Math.sqrt( 3 ) / 2;
		var hex_h = 			hex_side_length / 2;
		var hex_rect_h =  		hex_side_length + ( 2 * hex_h );
		var hex_rect_w =  		hex_rad * 2;
		return {
			side_length: function(){ return hex_side_length; }
			,rad: function(){ return hex_rad; }
			,h: function(){ return hex_h; }
			,rect_h: function(){ return hex_rect_h; }
			,rect_w: function(){ return hex_rect_w; }
			
			,setSideLength:	function( newLength ){
				var changed = true;
				if( newLength > st_graphics.max_zoom ){
					newLength = st_graphics.max_zoom;
				} else if ( newLength < st_graphics.min_zoom ){
					newLength = st_graphics.min_zoom; 
				}
				if( hex_side_length === newLength ){
					changed = false;
				}
				var centerX = st_graphics.canvas_w/2 + st_graphics.camera.x();
				var centerY = st_graphics.canvas_h/2 + st_graphics.camera.y();
				var targetY = Math.floor( centerY / ( hex_h + hex_side_length ) );
				var targetX = Math.floor( ( centerX - ( targetY % 2 ) * hex_rad ) / hex_rect_w );
				
				hex_side_length = newLength;
				hex_rad = 		hex_side_length * Math.sqrt( 3 ) / 2;
				hex_h = 		hex_side_length / 2;
				hex_rect_h = 	hex_side_length + ( 2 * hex_h );
				hex_rect_w = 	hex_rad * 2;
				return {change:changed, x:targetX, y:targetY};
			}
			
			,draw:   function( ctx, x, y, stroke, fill, alpha, line_width){
				fill = fill || false; // if no fill provided, hex will be drawn empty
				stroke = stroke || "#efefef"; // default stroke if none provided
				alpha = typeof alpha === "number"? alpha : 1; // alpha defaults to 1 if none defined, or if not a number
				line_width = typeof line_width === "number"? line_width : 2;
				ctx.beginPath();
				ctx.moveTo( x + hex_rad, y );
				ctx.lineTo( x + hex_rect_w, y+hex_h );
				ctx.lineTo( x + hex_rect_w, y + hex_h + hex_side_length );
				ctx.lineTo( x + hex_rad,	y + hex_rect_h );
				ctx.lineTo( x, y + hex_h + hex_side_length );
				ctx.lineTo( x, y + hex_h );
				ctx.closePath();
				if(fill){
					if( alpha !== 1){
						ctx.save();
						ctx.globalAlpha = alpha;
					}
					ctx.fillStyle= fill;
					ctx.fill();
					if( alpha !== 1){
						ctx.restore();
					}
				}
				ctx.lineWidth = 2;
				ctx.strokeStyle = stroke;
				ctx.stroke();
				if( st_graphics.DEBUG ){
					ctx.lineWidth = line_width;
					ctx.strokeStyle = "#ff0000";
					ctx.strokeRect( x, y + ( hex_h / 2 ), hex_rect_w, hex_rect_w - ( hex_h / 2 )); 
				}
			}
			,drawAtGrid: function(ctx, coords, stroke, fill, alpha){
				var canvas_x = ( coords.x * hex_rect_w + ( ( coords.y % 2 ) * hex_rad ) ) - st_graphics.camera.x();
				var canvas_y = ( coords.y * ( hex_side_length + hex_h ) ) - st_graphics.camera.y();
				this.draw(ctx, canvas_x, canvas_y, stroke, fill, alpha);
			}
			,drawScaledAtGrid:    function( scale, ctx, coords, stroke, fill, alpha){

				var canvas_x = ( coords.x * hex_rect_w + ( ( coords.y % 2 ) * hex_rad ) ) - st_graphics.camera.x();
				var canvas_y = ( coords.y * ( hex_side_length + hex_h ) ) - st_graphics.camera.y();
				
				var normal_size = hex_side_length;
				var normal_hex_width = hex_rect_w;
				var normal_hex_h = hex_h;
				
				this.setSideLength( normal_size*scale );	
					var adj_x =  canvas_x + ( ( normal_hex_width - hex_rect_w ) / 2 * ( ( scale > 1 ) ? -1 : 1) );
					var adj_y = canvas_y + ( ( ( normal_size + ( normal_hex_h * 2 ) )  - ( hex_side_length + ( hex_h * 2 ) ) ) / 2  * ( ( scale > 1 ) ? -1 : 1) );
					this.draw(ctx, adj_x, adj_y, stroke, fill, alpha);
				this.setSideLength( normal_size );
			}
			,visible: function( x, y ){
				return x < st_graphics.canvas_w 
					&& x > -hex_rect_w
					&& y < st_graphics.canvas_h 
					&& y > -( hex_rect_w * 2 + hex_side_length );
			}
			,visibleAtGrid: function( coords ){
				var hex_x = ( coords.x * st_graphics.hex.rect_w() + ( ( coords.y % 2 ) * st_graphics.hex.rad() ) ) - st_graphics.camera.x();
				var hex_y = ( coords.y * ( st_graphics.hex.side_length() + st_graphics.hex.h() ) ) - st_graphics.camera.y();
				return this.visible( hex_x, hex_y );
			}
		};
	}; //private createHexagon() hex constructor
		
	var drawBackground = function( ctx ){
		var bg_x = -st_graphics.camera.x() * st_graphics.parallax_d;
		var bg_y = -st_graphics.camera.y() * st_graphics.parallax_d;
		ctx.drawImage(st_graphics.background, bg_x - st_graphics.background.width, bg_y + st_graphics.background.height);
		ctx.drawImage(st_graphics.background, bg_x - st_graphics.background.width, bg_y);
		ctx.drawImage(st_graphics.background, bg_x - st_graphics.background.width, bg_y - st_graphics.background.height);
		ctx.drawImage(st_graphics.background, bg_x, bg_y + st_graphics.background.height);
		ctx.drawImage(st_graphics.background, bg_x, bg_y);
		ctx.drawImage(st_graphics.background, bg_x, bg_y - st_graphics.background.height);
		ctx.drawImage(st_graphics.background, bg_x + st_graphics.background.width, bg_y + st_graphics.background.height);
		ctx.drawImage(st_graphics.background, bg_x + st_graphics.background.width, bg_y);
		ctx.drawImage(st_graphics.background, bg_x + st_graphics.background.width, bg_y - st_graphics.background.height);
	}; // private drawBackground()
	
	var drawDefaultHexField = function( ctx ){
		for( var i = 0; i < st_graphics.w; i++){
			for( var j = 0; j < st_graphics.h; j++){
				// var hex_x = ( i * st_graphics.hex.rect_w() + ( ( j % 2 ) * st_graphics.hex.rad() ) ) - st_graphics.camera.x();
				// var hex_y = ( j * ( st_graphics.hex.side_length() + st_graphics.hex.h() ) ) - st_graphics.camera.y();
				if( st_graphics.hex.visibleAtGrid( {x:i, y:j} ) ){
					st_graphics.hex.drawAtGrid(st_graphics.ctx, i, j);
				}
			}
		}
	}; // private drawDefaultHexField()
	
	var drawLoadedHexField = function( ctx ){
		var map = st_data.getRevealedHexes();
		for( var i = 0; i < map.length; i++ ){
			if( st_graphics.hex.visibleAtGrid( map[i] ) ){
				var owner = st_data.getOwnerById( map[i].owner );
				var system = st_data.getSystemById( map[i].system );
				var ownerColor = owner? "rgb(" + owner.r + ", " + owner.g + ", "+owner.b + ")"	: false;
				if( system ){ //there is a system there
				
					st_graphics.hex.drawAtGrid( st_graphics.ctx, map[i], false, ownerColor,  0.1 ); 
					st_graphics.hex.drawScaledAtGrid(0.9, st_graphics.ctx, map[i], ownerColor, false,  0.5 );
					drawStarAtGrid( st_graphics.ctx, map[i].x, map[i].y, system );
				} else {
					st_graphics.hex.drawAtGrid( st_graphics.ctx, map[i], false, ownerColor,  0.5 ); 
				}
			}
		}		
	}; // private drawLoadedHexField()
	
	var drawMouseCursor = function( ctx ){
		// st_graphics.hex.draw(
			// ctx, 
			// st_graphics.select.x*st_graphics.hex.rect_w() + (( st_graphics.select.y % 2 ) * st_graphics.hex.rad() ) - st_graphics.camera.x(),
			// st_graphics.select.y * ( st_graphics.hex.side_length() + st_graphics.hex.h() ) - st_graphics.camera.y(), 
			// "#ffff00", //border in yellow
			// false, // no fill
			// 0 // 0% alpha (no fill)
		// );
		st_graphics.hex.drawAtGrid( ctx, {x:st_graphics.select.x, y:st_graphics.select.y}, "#ffff00", false, 0 );
	}; // private drawMouseCursor()
	var drawStarAtGrid = function( ctx, grid_x, grid_y, star ){
		var hex_x = ( grid_x * st_graphics.hex.rect_w() + ( ( grid_y % 2 ) * st_graphics.hex.rad() ) ) - st_graphics.camera.x();
		var hex_y = ( grid_y * ( st_graphics.hex.side_length() + st_graphics.hex.h() ) ) - st_graphics.camera.y();
		drawStar( ctx, hex_x, hex_y, star );		
	};
	var drawStar = function( ctx, canv_x, canv_y, star ){
		var color = "255,255,255";
		switch(star.MKspectrum){
			case "O":
				color = "130,130,255";
				break;
			case "B":
				color = "130,130,202";
				break;
			case "A":
				color = "162,162,210";
				break;
			case "F":
				color = "210,210,226";
				break;
			case "G":
				color = "239,239,239";
				break;
			case "K":
				color = "226,210,210";
				break;
			case "M":
				color = "210,162,162";
				break;
			case "L":
				color = "202,130,130";
				break;
			case "T":
				color = "255,130,130";
				break;
		}
		
		canv_x += st_graphics.hex.rect_w() / 2 + ((star.offset<3)?-st_graphics.hex.h()/2:(star.offset>4)?st_graphics.hex.h()/2:0);
		canv_y += st_graphics.hex.side_length() / 2 + st_graphics.hex.h() + ((star.offset%2==1)?-st_graphics.hex.h()/2:st_graphics.hex.h()/2);
		
		
		
		ctx.save();
			ctx.beginPath();
				ctx.arc(canv_x, canv_y, (st_graphics.hex.h()*(( 30 - star.magnitude )/20))/4, 0, 2*Math.PI, false);
				ctx.fillStyle = "rgba(" + color + ", 1)";
				ctx.shadowColor = "rgba(" + color + ", 1)";
				ctx.shadowBlur = 50;//st_graphics.hex.rect_w()*(30-star.magnitude)*50;
				ctx.fill();
				ctx.fill();
		ctx.restore();
	}; // private drawStar()
	
	
	
	graphicsModule.selectHex = function( coords ){
		st_graphics.camera.centerOnHex(coords.x, coords.y);
	}; // selectHex()
	
	
	return graphicsModule;
}(); // IIFE creating st_graphics
