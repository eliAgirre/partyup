//Este fichero está en la: app/models/user.js

// Cargamos las dependencias que necesitamos - mongoose y bcrypt-nodejs
//var mongoose = require('mongoose'); //mongoose. Es una dependencia de la base de datos MongoDB. Sirve para modular los objetos de MongoDB. (ORM).
var bcrypt = require('bcrypt-nodejs'); //Sirve para cifrar la contraseña

//Just add bluebird to your package.json, and then the following line should work
//mongoose.Promise = require('bluebird');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//Se define el schema que vamos a utilizar para los users
var userSchema= mongoose.Schema({

	//El id, email, username, password y birthday se guardarán en el modelo antes de introducir a la base de datos
	local:{
		id: String,
		email:  String,
	    username:  String,
	    password:  String,
	    birthday:  String
	},
	fb: {
		//_id: String ,  // id mongodb
		id: String,    // id facebook
		email: String,
		username:  String,
		firstNameFacebook: String,
		lastNameFacebook: String,
		birthday:  String
	},
	google: {
	    id: String,
	    email: String,
	    username:  String,
		nameGoogle: String,
		birthday:  String
	}

});

//Genera el cifrado para las contraseñas
userSchema.methods.generateHash = function(password) {

    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

//Para saber si la contraseña es válida
userSchema.methods.validPassword = function(password) {

  return bcrypt.compareSync(password, this.password);
};

//Se exporta el modelo creado para los usuarios
//module.exports = mongoose.model('User', userSchema);
const User = mongoose.model('User', userSchema);
module.exports = User;