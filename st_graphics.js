
//st_graphics.js

var st_graphics = st_graphics || function(){	
	"use strict";

	var DEBUG = st_DEBUG.graphics;
	
	var MAXZOOM = 150;
	var MINZOOM = 10;
	var bg_filename = 'images/stars.jpg';
	var imageLoaded = false;
	var background = {
		image: new Image()
		,x: 0
		,y: 0
		,parallax: 0.1
	};
	
	var graphics = {
		camera:				{}
		,hex:				{}
		,initialize: function(){
			var cameraInitalPosition = {x:50, y:50, z:75};
			st_graphics.camera = createCamera( cameraInitalPosition );
			st_graphics.hex = createHexagon( cameraInitalPosition.z );
			st_graphics.camera.centerOnHex( cameraInitalPosition );
			background.image.src = bg_filename;
			background.image.onload = function(){ 
				imageLoaded = true; 
			};
			if( DEBUG ) { console.log( "st_graphics initialized" ); }
		}
		,render: function( ctx ){
			
			if( imageLoaded ){
				drawBackground( ctx );
			}
			if( st_data.loaded() ){
				drawLoadedHexField( ctx );
			} else {
				drawDefaultHexField( ctx );
			}
			drawMouseCursor( ctx );
			if( DEBUG ){
				ctx.strokeStyle = "#00ff00";
				ctx.strokeRect( st_engine.canvas().width/2, st_engine.canvas().height/2, 2, 2); 
			}
		}
		,selectHex:	function( coords ){
			st_graphics.camera.centerOnHex( coords );
		}
	};



	var createCamera = function( initialPosition){
		var camera_speed = 2/3
			,pos_x = initialPosition.x
			,pos_y = initialPosition.y
			,pos_z = initialPosition.z
			,initial_position = initialPosition;
		return {
			x: function(){ return pos_x; }
			,y: function(){ return pos_y; }
			,z: function(){ return pos_z; }
			,speed: function(){ return camera_speed; }
			,dx: function( dx ){ pos_x += dx; }
			,dy: function( dy ){ pos_y += dy; }
			,move: function(new_x,new_y){
				pos_x = new_x;
				pos_y = new_y;
			}
			,moveDelta: function(dx, dy){
				if( typeof dx === 'number' ){ pos_x += dx; }
				if( typeof dy === 'number' ){ pos_y += dy; }
				
				background.x += -dx * background.parallax;
				background.y += -dy * background.parallax;
			}
			,centerOnHex: function( coords ){  
				pos_y = ( coords.y  * ( st_graphics.hex.rect().w - ( st_graphics.hex.h() / 2 ) +(0.015*st_graphics.hex.sideLength()) ) ) - ( st_engine.canvas().height/2 ) + ( st_graphics.hex.h() + st_graphics.hex.sideLength()/2 );
				pos_x = ( coords.x *  st_graphics.hex.rect().w ) - ( st_engine.canvas().width/2 ) + st_graphics.hex.rect().w/(coords.y%2?1:2);
			}
			,returnToInitialZoom: function(){
				this.zoom( initial_position.z );
			}
			,returnToInitialPosition: function(){
				if( st_data.loaded() ){
					st_graphics.camera.centerOnHex( st_data.getHomeworld() );
				} else{
					this.centerOnHex( initial_position.x, initial_position.y  );
				}
			}
			,dzoom: function( dz ){ 				
				this.zoom( dz + pos_z );
			}
			,zoom: function( newZ ){ 
				var centerX = false, centerY = false, targetY = false, targetX = false;
				if( typeof newZ !== 'number' ) {
					throw new Exception( "Invalid zoom level: "+newZ );
				}
				newZ = (newZ > MAXZOOM)? MAXZOOM : (newZ < MINZOOM)? MINZOOM : newZ;
				if( newZ !== pos_z ){
					centerX = st_engine.canvas().width/2 + pos_x;
					centerY = st_engine.canvas().height/2 + pos_y;
					targetY = Math.floor( centerY / ( st_graphics.hex .h() + st_graphics.hex .sideLength() ) );
					targetX = Math.floor( ( centerX - ( targetY % 2 ) * st_graphics.hex .rad() ) / st_graphics.hex .rect().w );
					pos_z = newZ; 
					st_graphics.hex.setSideLength( newZ );
					this.centerOnHex( {x: targetX, y: targetY } );
				};
				
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
			sideLength: function(){ return hex_side_length; }
			,rad: function(){ return hex_rad; }
			,h: function(){ return hex_h; }
			,rect: function(){ 
				return{
					h:hex_rect_h
					,w:hex_rect_w
				};
			}
			,setSideLength:	function( newLength ){
				hex_side_length = newLength;
				hex_rad = 		hex_side_length * Math.sqrt( 3 ) / 2;
				hex_h = 		hex_side_length / 2;
				hex_rect_h = 	hex_side_length + ( 2 * hex_h );
				hex_rect_w = 	hex_rad * 2;
			}
			
			,draw:   function( ctx, x, y, stroke, fill, alpha, lineWidth){
				fill = fill || false; // if no fill provided, hex will be drawn empty
				stroke = stroke || "#efefef"; // default stroke if none provided
				alpha = typeof alpha === "number"? alpha : 1; // alpha defaults to 1 if none defined, or if not a number
				lineWidth = typeof lineWidth === "number"? lineWidth : 2;
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
				ctx.lineWidth = lineWidth;
				ctx.strokeStyle = stroke;
				ctx.stroke();
				if( DEBUG ){
					ctx.lineWidth = lineWidth;
					ctx.strokeStyle = "#ff0000";
					ctx.strokeRect( x, y + ( hex_h / 2 ), hex_rect_w, hex_rect_w - ( hex_h / 2 ));  
				}
			}
			,drawAtGrid: function(ctx, coords, stroke, fill, alpha, lineWidth){
				var canvasCoords = gridCoordinatesToCanvas( coords );
				this.draw(ctx, canvasCoords.x, canvasCoords.y, stroke, fill, alpha);
			}
			,drawScaledAtGrid:    function( scale, ctx, coords, stroke, fill, alpha, lineWidth){

				var canvasCoords = gridCoordinatesToCanvas( coords );
				
				var normal_size = hex_side_length;
				var normal_hex_width = hex_rect_w;
				var normal_hex_h = hex_h;
				
				this.setSideLength( normal_size*scale );	
					var adj_x =  canvasCoords.x + ( ( normal_hex_width - hex_rect_w ) / 2 * ( ( scale > 1 ) ? -1 : 1) );
					var adj_y = canvasCoords.y + ( ( ( normal_size + ( normal_hex_h * 2 ) )  - ( hex_side_length + ( hex_h * 2 ) ) ) / 2  * ( ( scale > 1 ) ? -1 : 1) );
					this.draw(ctx, adj_x, adj_y, stroke, fill, alpha, lineWidth);
				this.setSideLength( normal_size );
			}
			,visible: function( x, y ){
				return x < st_engine.canvas().width
					&& x > -hex_rect_w
					&& y < st_engine.canvas().height
					&& y > -( hex_rect_w * 2 + hex_side_length );
			}
			,visibleAtGrid: function( coords ){
				var canvasCoords = gridCoordinatesToCanvas( coords );
				return this.visible( canvasCoords.x, canvasCoords.y );
			}
		};
	}; //private createHexagon() hex constructor
		
	var drawBackground = function( ctx ){
		ctx.drawImage(background.image, background.x - background.image.width, background.y + background.image.height);
		ctx.drawImage(background.image, background.x - background.image.width, background.y);
		ctx.drawImage(background.image, background.x - background.image.width, background.y - background.image.height);
		ctx.drawImage(background.image, background.x, background.y + background.image.height);
		ctx.drawImage(background.image, background.x, background.y);
		ctx.drawImage(background.image, background.x, background.y - background.image.height);
		ctx.drawImage(background.image, background.x + background.image.width, background.y + background.image.height);
		ctx.drawImage(background.image, background.x + background.image.width, background.y);
		ctx.drawImage(background.image, background.x + background.image.width, background.y - background.image.height);
	}; // private drawBackground()
	
	var drawDefaultHexField = function( ctx ){
		for( var i = 0; i < 100; i++){
			for( var j = 0; j < 100; j++){
				if( st_graphics.hex.visibleAtGrid( {x:i, y:j} ) ){
					st_graphics.hex.drawAtGrid(ctx, {x:i, y:j} );
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
				
					st_graphics.hex.drawAtGrid( ctx, map[i], false, false,  0.1 ); 
					st_graphics.hex.drawScaledAtGrid(0.85, ctx, map[i], ownerColor, ownerColor, .15, 6);
				//	,drawScaledAtGrid:    function( scale, ctx, coords, stroke, fill, alpha, lineWidth){
					drawStarAtGrid( ctx, map[i], system );
				} else {
					st_graphics.hex.drawAtGrid( ctx, map[i], false, ownerColor,  0.5 ); 
				}
			}
		}		
	}; // private drawLoadedHexField()
	
	var drawMouseCursor = function( ctx ){
		st_graphics.hex.drawAtGrid( ctx, st_engine.getHighlightedHex(), "#ffff00", false, 0 );
	}; // private drawMouseCursor()

	var drawStarAtGrid = function( ctx, coords, star ){
		var canvasCoords = gridCoordinatesToCanvas( coords );
		drawStar( ctx, canvasCoords.x, canvasCoords.y, star );		
	}; // private drawStarAtGrid()
	
	var drawStar = function( ctx, canv_x, canv_y, star ){
		var color = "0,0,0";
		switch(star.mkSpectrum){
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
			default:
				color = "255,255,255";
				break;
		}
		
		canv_x += st_graphics.hex.rect().w / 2 + ((star.offset<3)?-st_graphics.hex.h()/2:(star.offset>4)?st_graphics.hex.h()/2:0);
		canv_y += st_graphics.hex.sideLength() / 2 + st_graphics.hex.h() + ((star.offset%2==1)?-st_graphics.hex.h()/2:st_graphics.hex.h()/2);

		ctx.save();
			ctx.beginPath();
			ctx.arc(canv_x, canv_y, (st_graphics.hex.h()*(( 30 - star.magnitude )/20))/4, 0, 2*Math.PI, false);
			ctx.fillStyle = "rgba(" + color + ", 1)";
			ctx.shadowColor = "rgba(" + color + ", 1)";
			ctx.shadowBlur = 50;//st_graphics.hex.rect().w*(30-star.magnitude)*50;
			ctx.fill();
			ctx.fill();
		ctx.restore();
	}; // private drawStar()
	
	var gridCoordinatesToCanvas = function( coords ){
		return {
			x: ( coords.x * st_graphics.hex.rect().w + ( ( coords.y % 2 ) * st_graphics.hex.rad() ) ) - st_graphics.camera.x()
			,y: ( coords.y * ( st_graphics.hex.sideLength() + st_graphics.hex.h() ) ) - st_graphics.camera.y()
		}
	}
	
	return graphics;
}(); // IIFE creating st_graphics
