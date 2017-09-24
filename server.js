
/**
 * Module dependencies.
 */

var express = require('express')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path'); 

var mongoose = require('mongoose'); // database mongoDB
var passport = require('passport') //passport es un middleware de autentificacion
//var cookieParser = require('cookie-parser'); //para el uso de cookies, de manera que una vez logueados no tengamos que estar continuamente logueandonos en cada pagina 
var session = require('express-session') //necesaria junto con cookie-parser. Podremos acceder a datos sobre la session (req.session.lastPage, etc)
//var bodyParser = require('body-parser'); //para poder coger datos desde los formularios POST

var configDB = require('./config/database.js'); //Se esta configuran la base de datos. Estamos importando el archivo database.js que está en el directorio config
var app = express(); //Se instancia una nueva variable para las dependencias de express

//connection database
mongoose.Promise = global.Promise;
mongoose.connect(configDB.url,{ useMongoClient: true },function(err) {

	if(!err)
		console.log('Connected to the DB'); 
	else
		console.log('ERROR: Connection DB '+err);
});

require('./config/passport')(passport); //le pasamos passport a passport.js (están en la carpeta de config) para poder usarlo.

// all environments
//preparamos nuestra aplicación express
//app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views'); //indicamos el directorio views para ejs
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev')); //log de cada request en la consola
app.use(express.methodOverride());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Configuring Passport and app
app.configure(function() {
	app.use(express.static(path.join(__dirname, 'public'))); //indicamos el directorio público (para mostrar imagenes, css, etc)
	app.use(express.cookieParser());
	app.use(express.bodyParser()); //obtiene la información desde los formularios HTML
	app.use(express.session({ secret: 'pruebapp' })); // clave secret para usarla con hash (password encriptados)
	app.use(passport.initialize()); //inicializamos passport
	app.use(passport.session()); // persistent login sessions -> cookies peristentes: que no desaperecen cuando cierras el navegador
	app.use(app.router);

});

// routes
require('./routes/index.js')(app, passport); //para la gestión de rutas, le pasamos express y passport
//app.get('/users', user.list);

// server
/*http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});*/

//Servidor Cloud9/OpenShift/local
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080 || 3000, ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
app.listen(port, ip);
console.log('The magic happens on port ' + port);