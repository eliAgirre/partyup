//Este fichero está en : config/passport.js
//Hemos creado nuestro objeto passport en app.js. Y luego el fichero passport.js cogerá el objeto passport.
//Aquí es dónde las funciones sirven para guardar nuestro usuario en sesión.

// cargamos lo necesario para el objeto passport
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//Cargamos el modelo user
var User = require('../models/user');
// cargamos la configuracion de facebook
var fbConfig = require('../config/fb');
// cargamos la configuracion de google
var googleConfig = require('../config/google');

//var bcrypt = require('bcrypt-nodejs'); //para cifrar la contraseña
var crypto = require('crypto'); // para crear id random
const id = crypto.randomBytes(16).toString("hex");

//generate a url that asks permissions for Google+ and Google Calendar scopes


//module.exports es el objeto que se devuelve tras una llamada request
//así podemos usar passport
module.exports = function(passport) {

    // =========================================================================
    // Configuración de sesión passport ========================================
    // =========================================================================
    
    // para sesiones persistentes
    // passport serializa y deserializa a los usarios de la sesion guardando su ID al serializar y buscando su ID al deserializar

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // SIGNUP LOCAL ============================================================
    // =========================================================================

    // usamos local-signup para diferenciarlo del login y poder usar "estrategias" diferentes para cada uno, si solo tuvieramos uno se llamaria 'local' por defecto
    passport.use('local-signup', new LocalStrategy({
	        // por defecto "local strategy" usa nombre de usuario (username) y password
	        // en vez de usar solo esos dos hemos añadido mas campos
    		usernameField: 'email',
	        passwordField : 'password',
	        passReqToCallback : true // permite mandar la request completa al callback
	    },

	    function(req, email, password, done) {
	    	//function(req, email, username, password, birhday, done) {
	
	        //buscamos en nuestra DB coincidencias con el email ingresado 
	        User.findOne({ 'local.email' :  email }, function(err, user) {
	
	            // si hay errores, devuelve el error
	            if (err){
	                return done(err);
	                console.log("ERROR: "+err);
	            } else {
	            // comprueba si el email ya existe, si es así muestra un mensaje flash
		            if (user) {
		                console.log("User already exists.");
		                return done(err);
		            } else {
		
		                // si no existe el email en la BD crea el usuario con las credenciales introducidas
		                var newUser = new User();
		
		                newUser.local.id = id;
		                newUser.local.email = email;
		                newUser.local.username = req.param('username');
		                
		                // validation password
		                if(req.param('password2')===password){
		                	newUser.local.password = newUser.generateHash(password); // con generateHash se cifran los password
		                }
		                else{
		                	console.log('Error Password: It must be the same password');
		                    return done(err);
		                }		                
		                
		                // validate birthday
		                console.log(req.param('birthday'));
		                if(req.param('birthday')!=''){
		                	var birthday = req.param('birthday');
			                var today = new Date();
			                var year = today.getFullYear();
			                var birthdayYear = birthday.substr(birthday.length - 4);
			                var result = year - birthdayYear;
			                if(result>18){
			                	console.log(birthday);
			                	newUser.local.birthday = birthday;
			                } 
			                else{
			                	console.log('Error Birthday: You must be at least 18 years of age '+birthday);
			                    return done(err);
			                }
		                } else{
		                	console.log('Error: The birthday is required');
		                    return done(err);
		                }
		                
		                console.log(newUser);
		
		                // añade el usuario a la BD
		                newUser.save(function(err) {
		                	if (err){
		                        console.log('Error in Saving user: '+err);  
		                        throw err;  
		                    }
		                	console.log('User Registration succesful');
		                    return done(null, user);
		                });
		            }
	            }
	        });
	    }
    ));

    // =========================================================================
    // LOGIN LOCAL =============================================================
    // =========================================================================

    // usamos local-login para diferenciarlo del login y poder usar "estrategias" diferentes para cada uno, si solo tuvieramos uno se llamaria 'local' por defecto

    passport.use('local-login', new LocalStrategy({

        // por defecto "local strategy" usa nombre de usuario (username) y password
        // en vez de username nosotros pondremos email **en un futuro podríamos hacer que pudiera loguearse con email o username independientemente
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err){
            	console.log('Error: '+email);
                return done(err);
        	}
            // if no user is found, return the message
            if (!user){
                console.log('User Not Found with email: '+email);
                return done(err)               
            }
            
            console.log('Login Succesful user');
            // all is well, return successful user
            return done(null, user);
        });

    }));


    // =========================================================================
    // FACEBOOK SIGN UP / LOG IN ===============================================
    // =========================================================================
    
    passport.use('facebook', new FacebookStrategy({
    	  clientID        : fbConfig.appID,
    	  clientSecret    : fbConfig.appSecret,
    	  callbackURL     : fbConfig.callbackUrl,
    	  profileFields: ['id', 'birthday' , 'email', 'first_name', 'last_name', 'gender', 'link', 'locale'],
    	  passReqToCallback : true
    		// profileFields: ['id', 'birthday', 'age_range', 'email', 'gender', 'first_name', 'gender', 'last_name', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified'] 
    	},
    	 
	  // facebook will send back the tokens and profile
	  function(access_token, refresh_token, params, profile, done) {
    		//asynchronous
    		process.nextTick(function() {
    			//console.log(profile);
    			if(profile!=null){
		      
			      // find the user in the database based on email of facebook
			      User.findOne({ 'fb.email' :  profile.emails[0].value }, function(err, user) {
			 
			        // if there is an error, stop everything and return that
			        // ie an error connecting to the database
			        if (err)
			          return done(err);
			 
			          // if the user is found, then log them in
			          if (user) {
			            return done(null, user); // user found, return that user
			          } else {
			            // if there is no user found with that facebook id, create them
			            var newUser = new User();
			 
			            // set all of the facebook information in our user model
			            //newUser.fb._id    = id; // id mongodb   
			            newUser.fb.id    = profile.id; // set the users facebook id
			            newUser.fb.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
			            newUser.fb.username = '';
			            newUser.fb.firstNameFacebook  = profile.name.givenName;
			            newUser.fb.lastNameFacebook = profile.name.familyName; // look at the passport user profile to see how names are returned
			            newUser.fb.birthday = '';
			            
			            console.log(newUser);
			 
			            // save our user to the database
			            newUser.save(function(err) {
			              if (err){
			            	  console.log("Error: Saving user db "+err);
			            	  throw err;
			              }
			              // if successful, return the new user
			              console.log('User Registration succesful');
			              return done(null, user);
			            });
			         } 
			      }); //findOne
		      } // profile
		      else{
		    	  var err="Profile undefined";
		    	  console.log("Profile undefined");
		    	  return done(err);
		      }
    	   }); // nextTick
    	}
    )); // strategy facebook
    
    
    // =========================================================================
    // GOOGLE SIGN UP / LOG IN =================================================
    // =========================================================================
	 // Use the GoogleStrategy within Passport.
	//  Strategies in Passport require a `verify` function, which accept
	//  credentials (in this case, an accessToken, refreshToken, and Google
	//  profile), and invoke a callback with a user object.
	//  See http://passportjs.org/docs/configure#verify-callback
    passport.use('google', new GoogleStrategy({
  	  clientID        : googleConfig.appID,
  	  clientSecret    : googleConfig.appSecret,
  	  callbackURL     : googleConfig.callbackUrl,
  	  profileFields   : ['id', 'displayName', 'email'],
  	  passReqToCallback : true
  	},
  	 
	  // google will send back the tokens and profile
  	  function(access_token, refresh_token, params, profile, done) {
  		
  		//console.log(profile);
 		
  		//asynchronous
  		process.nextTick(function() {
  			
  			if(profile!=null){
		      
			      // find the user in the database based on email of google
			      User.findOne({ 'google.email' :  profile.emails[0].value }, function(err, user) {
			 
			        // if there is an error, stop everything and return that
			        // ie an error connecting to the database
			        if (err)
			          return done(err);
			 
			          // if the user is found, then log them in
			          if (user) {
			            return done(null, user); // user found, return that user
			          } else {
			            // if there is no user found with that google id, create them
			            var newUser = new User();
			 
			            // set all of the google information in our user model
			            //newUser.google._id    = id; // id mongodb   
			            newUser.google.id    = profile.id; // set the users google id
			            newUser.google.email = profile.emails[0].value; // google can return multiple emails so we'll take the first
			            newUser.google.username = '';
			            newUser.google.nameGoogle  = profile.displayName;			            
			            newUser.google.birthday = '';
			            
			            console.log(newUser);
			 
			            // save our user to the database
			            newUser.save(function(err) {
			              if (err){
			            	  console.log("Error: Saving user db "+err);
			            	  throw err;
			              }
			              // if successful, return the new user
			              console.log('User Registration succesful');
			              return done(null, user);
			            });
			         } 
			      }); //findOne
		      } // profile
		      else{
		    	  var err="Profile undefined";
		    	  console.log("Profile undefined");
		    	  return done(err);
		      }
  	   }); // nextTick
  	}
  )); // strategy google
    
};