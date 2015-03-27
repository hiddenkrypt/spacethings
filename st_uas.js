
//uas.js
// User account service: This module handles DOM elements that are initially hidden. It selectively reveals parts of the login, account creation, 
// and privacy statement pages. It also handles calls to the server through st_ajax.js. This module provides the login interface for the user. 
// The st_uas object will also hold the account name and hashword for authenticating other ajax requests. All ajax calls must include a username
// and hashword combination to authenticate the request.

//namespace uas
var st_uas = st_uas || function(){
	"use strict";
	var dom = {
		overlay:  {}
		,accountContainer: {}
		,loginSection: {}
		,login: {
			username: {}
		}
	};
	var uas = {
		credentials: null
		,DEBUG: st_DEBUG.uas
		,initialize: function(){
			loadDom();
			dom.login_createSwitch.addEventListener  ( "mousedown", st_uas.switchToCreate );
			dom.login_privacySwitch.addEventListener ( "mousedown", st_uas.switchToPrivacy );
			dom.login_submit.addEventListener  		 ( "mousedown", st_uas.login );
			dom.create_submit.addEventListener  	 ( "mousedown", st_uas.create );
			dom.create_loginSwitch.addEventListener  ( "mousedown", st_uas.switchToLogin );
			dom.create_privacySwitch.addEventListener( "mousedown", st_uas.switchToPrivacy );
			dom.privacy_loginSwitch.addEventListener ( "mousedown", st_uas.switchToLogin );
			dom.privacy_createSwitch.addEventListener( "mousedown", st_uas.switchToCreate );
			if( st_uas.DEBUG ){  
				dom.overlay.style.display = "none";
			} else {
				st_uas.switchToLogin();
			}
		}
		,switchToLogin: function(){
			dom.accountContainer.style.width = '40%';
			dom.accountContainer.style.marginTop = '4em';
			dom.privacy_section.style.display = 'none';
			dom.create_section.style.display = 'none';
			dom.login_section.style.display = 'inline';
		}
		,switchToCreate: function(){
			dom.accountContainer.style.width = '40%';
			dom.accountContainer.style.marginTop = '4em';
			dom.privacy_section.style.display = 'none';
			dom.create_section.style.display = 'inline';
			dom.login_section.style.display = 'none';
		}
		,switchToPrivacy: function(){
			dom.accountContainer.style.width = '90%';
			dom.accountContainer.style.marginTop = '1em';
			dom.privacy_section.style.display = 'inline';
			dom.create_section.style.display = 'none';
			dom.login_section.style.display = 'none';
		}
		,login: function(){
			dom.create_error.style.display='none';
			var sendQuery = { 
				username: 	dom.login_username.value
				,hashword:	Sha1.hash(dom.login_password.value)
			};
			ajax.send( 'src/login.php', sendQuery, function( response ){
				console.log(response);
				// if( response.serverCode === 401 ){
					// dom.login_error.innerText = response.error;
					// dom.login_error.style.display='inline';
				// } else if( response.serverCode = 200 ){
					// console.log( "login success" );
					// st_uas.credentials = sendQuery;
					// //hide entire overlay
					// //display loading graphic
					// //ajax gamedata
					// //gtfo
				// } else{
					// dom.login_error.innerText = "Unknown Error. If this error persists contact administrator. {"+response.error+"}";
					// dom.login_error.style.display='inline';
				// }
				
			});
		}
		,create: function(){
			dom.create_error.style.display='none';
			if(dom.create_password.value.length === 0
				|| dom.create_passwordConfirm.value.length === 0
				|| dom.create_username.value.length === 0
				|| dom.create_inviteCode.value.length === 0
				){
				dom.create_error.innerHTML = "Empty field detected. All fields are mandatory.";
				dom.create_error.style.display='inline';
			} else if(dom.create_password.value != dom.create_passwordConfirm.value){
				dom.create_error.innerHTML = "Confirmation Password does not match initial password!";
				dom.create_error.style.display='inline';
			} else{	
				var sendQuery = {
					username: dom.create_username.value
					,hashword: Sha1.hash(dom.create_password.value)
					,inviteCode: Sha1.hash(dom.create_inviteCode.value)
				};
				ajax.send( 'src/create_account.php', sendQuery, function( response ){
					console.log( response );
				});
			}
		}
	};
	
	var loadDom = function(){
		dom.overlay = document.getElementById( "overlay" );
		dom.accountContainer = document.getElementById( "account_container" );
		
		dom. = document.createElement( 'div' );
		dom.loginSection.setAttribute( "id", "login_section" );
		doom.accountContainer.appendChild( dom.loginSection );
		
		dom.account.username = document.createElement( 'input' );
		dom.account.username.setAttribue( "id",  "login_username" );
		dom.account.username.setAttribue( "type",  "text" );
		
		dom.account.password = document.createElement( 'input' );
		dom.account.password.setAttribue( "id", "login_password" );
		dom.account.password.setAttribue( "type", "password" );
		
		dom.account.submit = document.createElement('
		dom.account.submit.setAttribue( "id", "login_submit" );
		
		dom.account.error = document.createElement('
		dom.account.error.setAttribue( "id", "login_error" );
		
		dom.login.privacySwitch = document.createElement('
		dom.login.privacySwitch.setAttribue( "id", "login_privacySwitch" );
		
		dom.login.createSwitch = document.createElement('
		dom.login.createSwitch.setAttribue( "id", "login_createSwitch" );
		
		
		dom.create_section = document.getElementById("createSection");
		dom.create_username = document.getElementById("create_username");
		dom.create_password = document.getElementById("create_password");
		dom.create_passwordConfirm = document.getElementById("create_passwordConfirm");
		dom.create_inviteCode = document.getElementById("create_inviteCode");
		dom.create_submit = document.getElementById("create_submit");
		dom.create_error = document.getElementById("create_error");
		dom.create_loginSwitch = document.getElementById("create_loginSwitch");
		dom.create_privacySwitch = document.getElementById("create_privacySwitch");

		dom.privacy_section = document.getElementById("privacySection");
		dom.privacy_loginSwitch = document.getElementById("privacy_loginSwitch");
		dom.privacy_createSwitch = document.getElementById("privacy_createSwitch");
			
	};
	
	return uas;
}();


