"use strict"
//st_engine.js
//the core UI engine, mostly calling on attached modules. 

// var hashids = new Hashids("this is my salt", 4, "0123456789ABCDEF");
// for(var i=0; i<300; i++){
  // console.log(hashids.encode(i));
// }
//namespace st_engine
var st_engine = st_engine || function(){
	var authentication = { username:"", hashword:"" };
	var DEBUG = st_DEBUG;
	return {
		init: function(){
			st_graphics.initialize(); // start graphics module
			st_uas.initialize(); // start user account service module
			st_data.initialize();
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



//animation shim
window.requestAnimationFrame = (function() {
	return	window.requestAnimationFrame 
		|| 	window.mozRequestAnimationFrame 
		|| 	window.webkitRequestAnimationFrame 
		|| 	window.msRequestAnimationFrame
        || 	function( callback ){
				window.setTimeout(callback, 1000 / 60);
			};
})();