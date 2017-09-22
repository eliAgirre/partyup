//Cargamos el modelo usuarios
//var User = require('../models/user');


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
	app.get('/login', function(req, res) {
		  res.render('about.ejs', { 
			  	title: 'About Us'
		  }); 
	});
	
	/*
	 * GET contact.
	*/
	app.get('/contact', function(req, res) {
		  res.render('contact.ejs', { 
			  	title: 'Contact'
		  }); 
	});
	
	/*
	 * GET contact.
	*/
	app.get('/termsUse', function(req, res) {
		  res.render('termsUse.ejs', { 
			  	title: 'Terms of Use'
		  }); 
	});
	
	/*
	 * GET contact.
	*/
	app.get('/privacy', function(req, res) {
		  res.render('privacy.ejs', { 
			  	title: 'Privacy'
		  }); 
	});
	
	/*
	 * GET contact.
	*/
	app.get('/profile', function(req, res) {
		  res.render('profile.ejs', { 
			  	title: 'Profile'
		  }); 
	});
	
	/*
	 * GET error.
	*/
	app.get('/error', function(req, res) {
		  res.render('error.ejs', { 
			  	title: 'Error'
		  }); 
	});
	
	/*
	 * GET logout.
	*/
	app.get('/logout', function(req, res) {
		  req.logout();
		  res.redirect('/');
	});
	
	// route for facebook authentication and login
	// different scopes while logging in
	app.get('/login/facebook', 
	  passport.authenticate('facebook', { scope : 'email' }
	));
	 
	// handle the callback after facebook has authenticated the user
	app.get('/login/facebook/callback',
	  passport.authenticate('facebook', {
	    successRedirect : '/profile',
	    failureRedirect : '/error'
	  })
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
			//scope:['email']
			//res.render('register',{message: req.flash('message')});
			//failureFlash : true 
		})

	);
}