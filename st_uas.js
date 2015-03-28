
//uas.js
// User account service: This module handles DOM elements that are initially hidden. It selectively reveals parts of the login, account creation, 
// and privacy statement pages. It also handles calls to the server through st_ajax.js. This module provides the login interface for the user. 
// The st_uas object will also hold the account name and hashword for authenticating other ajax requests. All ajax calls must include a username
// and hashword combination to authenticate the request.

//namespace uas
var st_uas = st_uas || function(){
	"use strict";
	var DEBUG = st_DEBUG.uas;
	
	var uas = {
		initialize: function(){
			loadDom();
			if( DEBUG ){  
				dom.overlay.style.display = "none";
			} else {
				switchToLogin();
			}
		}
		,dom: function(){ return dom; }
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
	var dom = {
		overlay:  {}
		,uasContainer: 	{}
		,title:			{}
		,error:			{}
		,submit:		{}
		,inputFields: 	{
			username: 		{}
			,password:		{}
			,passwordVerify:{}
			,inviteCode:	{}
		}
		,inputLabels:	{
			username: 		{}
			,password:		{}
			,passwordVerify:{}
			,inviteCode:	{}
		}
		,modeSwitch: {		
			privacy:		{}
			,create:		{}
			,login:			{}
		}
		,modeSubtitle: {
			login:			{}
			,create:		{}
		}
		,privacyStatment:{
			container:		{}
			,title:			{}
			,paragraphs:	[]
		}
	};
	
	var loadDom = function(){
		console.log( "loading dynamic uas dom" );
		dom.overlay = document.getElementById( "overlay" );
		dom.uasContainer = document.getElementById( "uas_container" );
		
		dom.title = document.createElement( 'img' );
		dom.title.setAttribute( "src", "images/title.png");
		dom.title.setAttribute( "id", "title");
		
		dom.inputFields.username = document.createElement( 'input' );
		dom.inputFields.username.setAttribute( "id",  "username" );
		dom.inputFields.username.setAttribute( "type",  "text" );
		dom.inputLabels.username = document.createElement( 'img' );
		dom.inputLabels.username.setAttribute( "id",  "username_label" );
		dom.inputLabels.username.setAttribute( "src", "images/username.png" );
		
		dom.inputFields.password = document.createElement( 'input' );
		dom.inputFields.password.setAttribute( "id", "password" );
		dom.inputFields.password.setAttribute( "type", "password" );
		dom.inputLabels.password = document.createElement( 'img' );
		dom.inputLabels.password.setAttribute( "id", "password_label" );
		dom.inputLabels.password.setAttribute( "src", "images/password.png" );
		
		dom.inputFields.verifyPassword = document.createElement( 'input' );
		dom.inputFields.verifyPassword.setAttribute( "id", "verify_password" );
		dom.inputFields.verifyPassword.setAttribute( "type", "password" );
		dom.inputLabels.verifyPassword = document.createElement( 'img' );
		dom.inputLabels.verifyPassword.setAttribute( "id", "verify_password_label" );
		dom.inputLabels.verifyPassword.setAttribute( "src", "images/verifypassword.png" );
		
		dom.inputFields.inviteCode = document.createElement( 'input' );
		dom.inputFields.inviteCode.setAttribute( "id", "invite_code" );
		dom.inputFields.inviteCode.setAttribute( "type", "password" );
		dom.inputLabels.inviteCode = document.createElement( 'img' );
		dom.inputLabels.inviteCode.setAttribute( "id", "invite_code_label" );
		dom.inputLabels.inviteCode.setAttribute( "src", "images/invitecode.png" );
				
		dom.submit = document.createElement( 'input' );
		dom.submit.setAttribute( "id", "submit" );
		dom.submit.setAttribute( "type", "button" );
		dom.submit.setAttribute( "value", "Submit" );
		
		dom.error = document.createElement( 'div' );
		dom.error.setAttribute( "id", "uas_error" );

		
		dom.modeSubtitle.create = document.createElement( 'img' );
		dom.modeSubtitle.create.setAttribute( "src", "images/create.png" )
		dom.modeSubtitle.create.setAttribute( "id", "createSubtitle" );
		dom.modeSubtitle.create.className = "subtitle";
		
		dom.modeSubtitle.login = document.createElement( 'img' );
		dom.modeSubtitle.login.setAttribute( "src", "images/login.png" );
		dom.modeSubtitle.login.setAttribute( "id", "loginSubtitle" );
		dom.modeSubtitle.login.className = "subtitle";
		
		dom.modeSwitch.privacy = document.createElement( 'img' );
		dom.modeSwitch.privacy.setAttribute( "src", "images/switchprivacy.png" );
		dom.modeSwitch.privacy.setAttribute( "id", "privacySwitch" );
		
		dom.modeSwitch.create = document.createElement( 'img' );
		dom.modeSwitch.create.setAttribute( "src", "images/switchcreate.png" )
		dom.modeSwitch.create.setAttribute( "id", "createSwitch" );
		
		dom.modeSwitch.login = document.createElement( 'img' );
		dom.modeSwitch.login.setAttribute( "src", "images/switchlogin.png" );
		dom.modeSwitch.login.setAttribute( "id", "loginSwitch" );
		
		dom.privacyStatement = document.createElement( 'div' );
		
	};
	
	
	var switchToLogin = function(){
	
		console.log( "switching to login" );
		dom.uasContainer = scrubElement( dom.uasContainer );
		dom.uasContainer.style.width = '40%';
		dom.uasContainer.style.marginTop = '4em';
		dom.uasContainer.appendChild( dom.title );
		dom.uasContainer.appendChild( dom.modeSubtitle.login );
		dom.uasContainer.appendChild( dom.inputLabels.username );
		dom.uasContainer.appendChild( dom.inputFields.username );
		dom.uasContainer.appendChild( document.createElement( 'br' ) );
		dom.uasContainer.appendChild( dom.inputLabels.password );
		dom.uasContainer.appendChild( dom.inputFields.password );
		dom.uasContainer.appendChild( document.createElement( 'br' ) );
		dom.uasContainer.appendChild( dom.submit );
		dom.uasContainer.appendChild( document.createElement( 'br' ) );
		dom.uasContainer.appendChild( dom.modeSwitch.create );
		dom.uasContainer.appendChild( dom.modeSwitch.privacy );
		

		dom.uasContainer.style.display = "block";
	};
	
	var scrubElement = function( element ) {
		element.style.display = 'none';
		while( element.fistChild){
			element.removeChild( element.firstChild );
		}
		return element;
	}
	
	
	return uas;
}();



