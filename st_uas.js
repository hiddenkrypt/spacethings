
//uas.js
// User account service: dom elements for creating an account, logging in, etc. 

var st_uas = st_uas || function(){
	"use strict";
	var DEBUG = st_DEBUG.uas;
	
	
	var uas = {
		initialize: function(){
			loadUasDom();
			if( DEBUG ){  
				uasDom.container.style.display = "none";
				st_engine.hideOverlay();
			} else {
				switchToLogin();
			}
			
			if( DEBUG ){ console.log( "st_uas initialized" ); }
		}
		,hide: function(){
			uasDom.container.style.display = 'none';
			st_engine.hideOverlay();
		}
		,show: function(){
			st_uas.switchToLogin();
			st_engine.showOverlay();	
		}

	};
	var uasDom = {
		container: 	{}
		,title:			{}
		,error:			{}
		,submit:		{}
		,inputFields: 	{
			username: 		{}
			,password:		{}
			,verifyPassword:{}
			,inviteCode:	{}
		}
		,inputLabels:	{
			username: 		{}
			,password:		{}
			,verifyPassword:{}
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
	
	var loadUasDom = function(){
		uasDom.container = document.createElement( 'div' );
		uasDom.container.setAttribute( "id", "uas_container" );
		document.getElementById( 'b' ).appendChild( uasDom.container );
		
		uasDom.title = document.createElement( 'img' );
		uasDom.title.setAttribute( "src", "images/title.png" );
		uasDom.title.setAttribute( "id", "uas_title" );
		
		uasDom.inputFields.username = document.createElement( 'input' );
		uasDom.inputFields.username.setAttribute( "id",  "username" );
		uasDom.inputFields.username.setAttribute( "type",  "text" );
		uasDom.inputLabels.username = document.createElement( 'img' );
		uasDom.inputLabels.username.setAttribute( "id",  "username_label" );
		uasDom.inputLabels.username.setAttribute( "src", "images/username.png" );
		
		uasDom.inputFields.username.value = 'debug';
		
		uasDom.inputFields.password = document.createElement( 'input' );
		uasDom.inputFields.password.setAttribute( "id", "password" );
		uasDom.inputFields.password.setAttribute( "type", "password" );
		uasDom.inputLabels.password = document.createElement( 'img' );
		uasDom.inputLabels.password.setAttribute( "id", "password_label" );
		uasDom.inputLabels.password.setAttribute( "src", "images/password.png" );
		
		uasDom.inputFields.verifyPassword = document.createElement( 'input' );
		uasDom.inputFields.verifyPassword.setAttribute( "id", "verify_password" );
		uasDom.inputFields.verifyPassword.setAttribute( "type", "password" );
		uasDom.inputLabels.verifyPassword = document.createElement( 'img' );
		uasDom.inputLabels.verifyPassword.setAttribute( "id", "verify_password_label" );
		uasDom.inputLabels.verifyPassword.setAttribute( "src", "images/verifypassword.png" );
		
		uasDom.inputFields.inviteCode = document.createElement( 'input' );
		uasDom.inputFields.inviteCode.setAttribute( "id", "invite_code" );
		uasDom.inputFields.inviteCode.setAttribute( "type", "password" );
		uasDom.inputLabels.inviteCode = document.createElement( 'img' );
		uasDom.inputLabels.inviteCode.setAttribute( "id", "invite_code_label" );
		uasDom.inputLabels.inviteCode.setAttribute( "src", "images/invitecode.png" );
				
		uasDom.submit = document.createElement( 'input' );
		uasDom.submit.setAttribute( "id", "submit" );
		uasDom.submit.setAttribute( "type", "button" );
		uasDom.submit.setAttribute( "value", "Submit" );
		
		uasDom.error = document.createElement( 'div' );
		uasDom.error.setAttribute( "id", "uas_error" );

		
		uasDom.modeSubtitle.create = document.createElement( 'img' );
		uasDom.modeSubtitle.create.setAttribute( "src", "images/create.png" )
		uasDom.modeSubtitle.create.setAttribute( "id", "createSubtitle" );
		uasDom.modeSubtitle.create.className = "uas_subtitle";
		
		uasDom.modeSubtitle.login = document.createElement( 'img' );
		uasDom.modeSubtitle.login.setAttribute( "src", "images/login.png" );
		uasDom.modeSubtitle.login.setAttribute( "id", "loginSubtitle" );
		uasDom.modeSubtitle.login.className = "uas_subtitle";
		
		uasDom.modeSwitch.privacy = document.createElement( 'img' );
		uasDom.modeSwitch.privacy.setAttribute( "src", "images/switchprivacy.png" );
		uasDom.modeSwitch.privacy.setAttribute( "id", "privacySwitch" );
		
		uasDom.modeSwitch.create = document.createElement( 'img' );
		uasDom.modeSwitch.create.setAttribute( "src", "images/switchcreate.png" )
		uasDom.modeSwitch.create.setAttribute( "id", "createSwitch" );
		
		uasDom.modeSwitch.login = document.createElement( 'img' );
		uasDom.modeSwitch.login.setAttribute( "src", "images/switchlogin.png" );
		uasDom.modeSwitch.login.setAttribute( "id", "loginSwitch" );
		
		uasDom.privacyStatement = document.createElement( 'div' );
		
	};
	
	
	var switchToLogin = function(){
		uasDom.container = scrubElement( uasDom.container );
		uasDom.container.style.width = '40%';
		uasDom.container.appendChild( uasDom.title );
		uasDom.container.appendChild( uasDom.modeSubtitle.login );
		uasDom.container.appendChild( uasDom.inputLabels.username );
		uasDom.container.appendChild( uasDom.inputFields.username );
		uasDom.container.appendChild( document.createElement( 'br' ) );
		uasDom.container.appendChild( uasDom.inputLabels.password );
		uasDom.container.appendChild( uasDom.inputFields.password );
		uasDom.container.appendChild( document.createElement( 'br' ) );
		uasDom.container.appendChild( uasDom.submit );
		uasDom.container.appendChild( document.createElement( 'br' ) );
		uasDom.container.appendChild( uasDom.modeSwitch.create );
		uasDom.container.appendChild( uasDom.modeSwitch.privacy );

		uasDom.container.style.display = "block";
		uasDom.submit.addEventListener( "click", login );
	};
	var switchToCreate = function(){
		uasDom.container = scrubElement( uasDom.container );
		uasDom.container.style.width = '40%';
		uasDom.container.appendChild( uasDom.title );
		uasDom.container.appendChild( uasDom.modeSubtitle.create );
		uasDom.container.appendChild( uasDom.inputLabels.username );
		uasDom.container.appendChild( uasDom.inputFields.username );
		uasDom.container.appendChild( document.createElement( 'br' ) );
		uasDom.container.appendChild( uasDom.inputLabels.password );
		uasDom.container.appendChild( uasDom.inputFields.password );
		uasDom.container.appendChild( document.createElement( 'br' ) );
		uasDom.container.appendChild( uasDom.inputLabels.verifyPassword );
		uasDom.container.appendChild( uasDom.inputFields.verifyPassword );
		uasDom.container.appendChild( document.createElement( 'br' ) );
		uasDom.container.appendChild( uasDom.inputLabels.inviteCode );
		uasDom.container.appendChild( uasDom.inputFields.inviteCode );
		uasDom.container.appendChild( document.createElement( 'br' ) );
		uasDom.container.appendChild( uasDom.submit );
		uasDom.container.appendChild( document.createElement( 'br' ) );
		uasDom.container.appendChild( uasDom.modeSwitch.create );
		uasDom.container.appendChild( uasDom.modeSwitch.privacy );
		uasDom.container.style.display = "block";
		
		uasDom.submit.addEventListener( "create", login );
	}
	
	
	var scrubElement = function( element ) {
		element.style.display = 'none';
		while( element.fistChild){
			element.removeChild( element.firstChild );
		}
		return element;
	}
	
	var login = function(){
		uasDom.error.style.display='none';
		if ( uasDom.inputFields.username.value == 'debug' ){
			st_data.update( true );
			st_engine.start();
			return;
		}
		var sendQuery = { 
			username: 	uasDom.inputFields.username.value
			,hashword:	Sha1.hash(uasDom.inputFields.password.value)
		};
		ajax.send( 'src/login.php', sendQuery, function( response ){
			if( DEBUG ){ console.log( response ); }
		});
	}
	var create = function(){
		uasDom.error.style.display='none';
		if(uasDom.inputFields.password.value.length === 0
			|| uasDom.inputFields.verifyPassword.value.length === 0
			|| uasDom.inputFields.username.value.length === 0
			|| uasDom.inputFields.inviteCode.value.length === 0
			){
			uasDom.error.innerHTML = "Empty field detected. All fields are mandatory.";
			uasDom.error.style.display='inline';
		} else if(uasDom.password.value != uasDom.verifyPassword.value){
			uasDom.error.innerHTML = "Confirmation Password does not match initial password!";
			uasDom.error.style.display='inline';
		} else{	
			var sendQuery = {
				username: uasDom.inputFields.username.value
				,hashword: Sha1.hash(uasDom.inputFields.password.value)
				,inviteCode: Sha1.hash(uasDom.inputFields.inviteCode.value)
			};
			ajax.send( 'src/create_account.php', sendQuery, function( response ){
				if( DEBUG ){ console.log( response ); }
			});
		}
	}
	return uas;
}();



