$(document).ready(function(){
    
    $('#loginForm').bootstrapValidator({
        live: 'enabled',
        submitButtons: 'button[id="loginBtn"]',
        message: 'This value is not valid',
        icon: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
        	email: {
                validators: {
                    notEmpty: {
                        message: 'The email address is required'
                    },
                    emailAddress: {
                        message: 'The input is not a valid email address'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: 'The password is required'
                    },
                    stringLength: {
                    	min: 6,
                    	max: 8,
                    	message: 'The password must be between 6 and 8 characters long'
                    }
                }
            }
        }
    });  
    
}); //Cierre de la función general