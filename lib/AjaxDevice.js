"use strict"
//AjaxDevice.js


var AjaxDevice = AjaxDevice || function( ){
	var XHR = new XMLHttpRequest( );
	var state = "unsent";
	var callback = function( ){null;}
	XHR.onreadystatechange = function( ){
		switch ( XHR.readyState ){
			case 0:
				state = "unsent";
				break;
			case 1:
				state = "opened";
				break;
			case 2:
				state = "headers_recieved";
				break;
			case 3:
				state = "loading";
				break;
			case 4:
				state = "done";
				callback(XHR.responseText);
				// JSON.Parse(XHR.responseText));
				break;
		}
	}
	return {
		unsent: function(){ return state === "unsent"; }
		,opened: function(){ return state === "opened"; }
		,headers_recieved: function(){ return state === "headers_recieved"; }
		,loading: function(){ return state === "loading"; }
		,done: function(){ return state === "done"; }
		,send: function( url, data, recvCallback){
			callback = recvCallback;
			XHR.open( "POST", url );
			XHR.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			XHR.send( "data=" + JSON.stringify( data ) );
		}
	}
	
};