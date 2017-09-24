//Cargamos el modelo usuarios
//var User = require('../models/user');

var sessionID = '';
var sessionAnterior = '';

//module.exports es el objeto que se devuelve tras una llamada request
//así podemos usar express y passport pasando como parámetro
module.exports = function(app, passport) {
	
	// RUTAS GET ===============================================================
	/*
	 * GET index. Pagina principal
	 */
	app.get('/', function(req, res) {
		  res.render('index.ejs', { 
			  	title: 'partyUp'			  	
		  }); 
	});
	
	/*
	 * GET signup.
	*/
	app.get('/signup', function(req, res) {
		  res.render('signup.ejs', { 
			  	title: 'Sig Up'
		  }); 
	});
	
	/*
	 * GET login.
	*/
	app.get('/login', function(req, res) {
		  res.render('login.ejs', { 
			  	title: 'Log In'
		  });
	});
	
	/*
	 * GET about.
	*/
	app.get('/about', function(req, res) {
		if(this.sessionID!='')
			this.sessionID = req.sessionID;
		console.log("session id: "+this.sessionID);
		  res.render('about.ejs', { 
			  	title: 'About Us',
			  	sessionID: this.sessionID
		  }); 
	});
	
	/*
	 * GET contact.
	*/
	app.get('/contact', function(req, res) {
		if(this.sessionID!='')
			this.sessionID = req.sessionID;
		console.log("session id: "+this.sessionID);
		  res.render('contact.ejs', { 
			  	title: 'Contact',
			  	sessionID: this.sessionID
		  }); 
	});
	
	/*
	 * GET termsUse.
	*/
	app.get('/termsUse', function(req, res) {
		if(this.sessionID!='')
			this.sessionID = req.sessionID;
		console.log("session id: "+this.sessionID);
		  res.render('termsUse.ejs', { 
			  	title: 'Terms of Use',
			  	sessionID: this.sessionID
		  }); 
	});
	
	/*
	 * GET privacy.
	*/
	app.get('/privacy', function(req, res) {
		if(this.sessionID!='')
			this.sessionID = req.sessionID;
		console.log("session id: "+this.sessionID);
		  res.render('privacy.ejs', { 
			  	title: 'Privacy',
			  	sessionID: this.sessionID
		  }); 
	});
	
	/*
	 * GET profile.
	*/
	app.get('/profile', isLoggedIn, function(req, res) {
		if(req.sessionID!='')
			this.sessionID = req.sessionID;
		console.log("session id: "+this.sessionID);
		res.render('profile.ejs', {
			title: 'My Profile',
			subtitle: 'Hi ',
			user: req.user,
			sessionID: this.sessionID
		});
	});
	
	/*
	 * GET dashboard.
	*/
	app.get('/dashboard', isLoggedIn, function(req, res) {
		if(this.sessionID!='')
			this.sessionID = req.sessionID;
		console.log("session id: "+this.sessionID);
		res.render('dashboard.ejs', {
			title: 'My Dashboard',
			sessionID: this.sessionID
		});
	});
	
	/*
	 * GET error.
	*/
	app.get('/error', isLoggedIn, function(req, res) {
		
		if(req.param('title')!='')
			vTitle = req.param('title');
		else
			vTitle = 'Error';
		
		if(req.param('subtitle')!='')
			vSubtitle = req.param('subtitle');
		else
			vSubtitle = 'Ha ocurrido un error';
		
		if(req.param('mensaje')!='')
			vMsg = req.param('mensaje');
		else
			vMsg = 'Error desconocido';
		
		res.render('error.ejs', { 
		  	title: vTitle,
		  	subtitle: vSubtitle,
		  	mensaje: vMsg			  		
		}); 
	});
	
	/*
	 * GET logout.
	*/
	app.get('/logout', function(req, res) {
		  console.log("Log out user with session ID "+req.sessionID);
		  console.log("var "+this.sessionID);
		  console.log("req "+req.sessionID);
		  if(this.sessionID==req.sessionID){
			  this.sessionAnterior=this.sessionID;
			  console.log("sessionAnterior "+this.sessionAnterior);
			  req.sessionID='';
			  this.sessionID='';  
			  console.log("var sessionID "+this.sessionID);
		  }
		  req.logout(); // req.logout() que nos proporciona passport. Sirve para salir de la sesión de usuario. 
		  res.redirect('/'); // al cerrar la sesion, le redireccionamos a la página principal.
	});
	
	// FACEBOOK
	/*
	 * GET /login/facebook
	*/
	// route for facebook authentication and login
	// different scopes while logging in
	app.get('/login/facebook', 
	  passport.authenticate('facebook', { scope : 'email' }
	));
	 
	/*
	 * GET /login/facebook/callback
	*/
	// handle the callback after facebook has authenticated the user
	app.get('/login/facebook/callback', 
	  passport.authenticate('facebook', {
	    successRedirect : '/profile',
	    failureRedirect : '/error'
	  })
	);
	
	// GOOGLE
	/*
	 * GET /auth/google
	*/
	//  Use passport.authenticate() as route middleware to authenticate the
	//  request.  The first step in Google authentication will involve
	//  redirecting the user to google.com.  After authorization, Google
	//  will redirect the user back to this application at /auth/google/callback
	app.get('/auth/google', 
		passport.authenticate('google', { 
			access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
			scope: 'https://www.googleapis.com/auth/userinfo.email'
		})
	);


	/*
	 * GET /auth/google/callback
	*/
	//  Use passport.authenticate() as route middleware to authenticate the
	//  request.  If authentication fails, the user will be redirected back to the
	//  login page.  Otherwise, the primary route function function will be called,
	//  which, in this example, will redirect the user to the home page.
	app.get('/auth/google/callback', 
		passport.authenticate('google', {
			access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
			scope: 'https://www.googleapis.com/auth/userinfo.email',
			successRedirect : '/profile',
			failureRedirect: '/error'
		})/*,
		function(req, res) {
		// Authenticated successfully
		res.redirect('/');*/
	);
	
	
	// RUTAS POST ===============================================================

	/*
	 * POST signup. (LOCAL)
	*/
	// Obtiene los datos del formulario del registro autentificando el usuario
	app.post('/signup', 

		passport.authenticate('local-signup', {

			successRedirect : '/profile', //si los datos son correctos entraremos al perfil
			failureRedirect : '/error' //si hay un error o los datos no son correctos redirecciona a la página principal
			// res.render('register',{message: req.flash('message')});
			//failureFlash : true 
		})

	);
	
	/*
	 * POST login (LOCAL)
	*/
	// Obtiene los datos del formulario del registro autentificando el usuario
	app.post('/login', 

		passport.authenticate('local-login', {

			successRedirect : '/profile', //si los datos son correctos entraremos al perfil
			failureRedirect : '/error' //si hay un error o los datos no son correctos redirecciona a la página principal
		})

	);
	
	
	// VALIDACIONES ===============================================================
	
	//Función para saber si aún sigue logueado
	//Un usuario tiene que estar conectado para tener acceso a esta ruta. 
	function isLoggedIn(req, res, next) {

		//si el usuario está logueado continuar
		if (req.isAuthenticated())
			return next();
		
		//si el usuario no está logueado y trata de acceder, redireccionamos a la página principal
		res.render('error.ejs', {			
			title: 'Error',
			subtitle: 'Ha ocurrido un error de logueo',
			mensaje: 'No puedes acceder a la página.'
		});

	//Cierre de la función isLoggedIn
	}
	
}