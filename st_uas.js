"use strict"
//uas.js
// User account service: This module handles DOM elements that are initially hidden. It selectively reveals parts of the login, account creation, 
// and privacy statement pages. It also handles calls to the server through st_ajax.js. This module provides the login interface for the user. 
// The st_uas object will also hold the account name and hashword for authenticating other ajax requests. All ajax calls must include a username
// and hashword combination to authenticate the request.

//namespace uas
var st_uas = st_uas || function(){
	return	{
		credentials: null
		,DEBUG: st_DEBUG
		,initialize: function(){
			st_uas.loadDom();
			st_uas.dom.login_createSwitch.addEventListener  ( "mousedown", st_uas.switchToCreate );
			st_uas.dom.login_privacySwitch.addEventListener ( "mousedown", st_uas.switchToPrivacy );
			st_uas.dom.login_submit.addEventListener  		 ( "mousedown", st_uas.login );
			st_uas.dom.create_submit.addEventListener  	 ( "mousedown", st_uas.create );
			st_uas.dom.create_loginSwitch.addEventListener  ( "mousedown", st_uas.switchToLogin );
			st_uas.dom.create_privacySwitch.addEventListener( "mousedown", st_uas.switchToPrivacy );
			st_uas.dom.privacy_loginSwitch.addEventListener ( "mousedown", st_uas.switchToLogin );
			st_uas.dom.privacy_createSwitch.addEventListener( "mousedown", st_uas.switchToCreate );
			if( st_uas.DEBUG ){  
				st_uas.dom.overlay.style.display = "none";
			} else {
				st_uas.switchToLogin();
			}
		}
		,switchToLogin: function(){
			st_uas.dom.accountContainer.style.width = '40%';
			st_uas.dom.accountContainer.style.marginTop = '4em';
			st_uas.dom.privacy_section.style.display = 'none';
			st_uas.dom.create_section.style.display = 'none';
			st_uas.dom.login_section.style.display = 'inline';
		}
		,switchToCreate: function(){
			st_uas.dom.accountContainer.style.width = '40%';
			st_uas.dom.accountContainer.style.marginTop = '4em';
			st_uas.dom.privacy_section.style.display = 'none';
			st_uas.dom.create_section.style.display = 'inline';
			st_uas.dom.login_section.style.display = 'none';
		}
		,switchToPrivacy: function(){
			st_uas.dom.accountContainer.style.width = '90%';
			st_uas.dom.accountContainer.style.marginTop = '1em';
			st_uas.dom.privacy_section.style.display = 'inline';
			st_uas.dom.create_section.style.display = 'none';
			st_uas.dom.login_section.style.display = 'none';
		}
		,login: function(){
			st_uas.dom.create_error.style.display='none';
			var sendQuery = { 
				username: 	st_uas.dom.login_username.value
				,hashword:	Sha1.hash(st_uas.dom.login_password.value)
			};
			ajax.send( 'src/login.php', sendQuery, function( response ){
				console.log(response);
				// if( response.serverCode === 401 ){
					// st_uas.dom.login_error.innerText = response.error;
					// st_uas.dom.login_error.style.display='inline';
				// } else if( response.serverCode = 200 ){
					// console.log( "login success" );
					// st_uas.credentials = sendQuery;
					// //hide entire overlay
					// //display loading graphic
					// //ajax gamedata
					// //gtfo
				// } else{
					// st_uas.dom.login_error.innerText = "Unknown Error. If this error persists contact administrator. {"+response.error+"}";
					// st_uas.dom.login_error.style.display='inline';
				// }
				
			});
		}
		,create: function(){
			st_uas.dom.create_error.style.display='none';
			if(st_uas.dom.create_password.value.length == 0
				|| st_uas.dom.create_passwordConfirm.value.length == 0
				|| st_uas.dom.create_username.value.length == 0
				|| st_uas.dom.create_inviteCode.value.length == 0
				){
				st_uas.dom.create_error.innerHTML = "Empty field detected. All fields are mandatory.";
				st_uas.dom.create_error.style.display='inline';
			} else if(st_uas.dom.create_password.value != st_uas.dom.create_passwordConfirm.value){
				st_uas.dom.create_error.innerHTML = "Confirmation Password does not match initial password!";
				st_uas.dom.create_error.style.display='inline';
			} else{	
				var sendQuery = {
					username: st_uas.dom.create_username.value
					,hashword: Sha1.hash(st_uas.dom.create_password.value)
					,inviteCode: Sha1.hash(st_uas.dom.create_inviteCode.value)
				};
				ajax.send( 'src/create_account.php', sendQuery, function( response ){
					console.log( response );
				});
			}
		}
		,loadDom: function(){
			var dom = {};
			dom.overlay = document.getElementById("overlay");
			dom.accountContainer = document.getElementById("account");
			
			dom.login_section = document.getElementById("loginSection");
			dom.login_username = document.getElementById("login_username");
			dom.login_password = document.getElementById("login_password");
			dom.login_submit = document.getElementById("login_submit");
			dom.login_error = document.getElementById("login_error");
			dom.login_privacySwitch = document.getElementById("login_privacySwitch");
			dom.login_createSwitch = document.getElementById("login_createSwitch");
			
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
			
			st_uas.dom = dom;
		}
	}; // object return
}();


