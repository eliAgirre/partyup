$(document).ready(function(){

	// validation items of form
    $('#signupForm').bootstrapValidator({
        live: 'enabled',
        submitButtons: 'button[id="signupBtn"]',
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
            username: {
                validators: {
                    notEmpty: {
                        message: 'The username is required'
                    },
                    stringLength: {
                        min: 6,
                        max: 30,
                        message: 'The username must be more than 6 and less than 30 characters long'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: 'The username can only consist of alphabetical, number, dot and underscore'
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
                    },
                    different: {
                        field: 'username',
                        message: 'The password cannot be the same as username'
                    }
                }
            },
            password2: {
                validators: {
                    notEmpty: {
                        message: 'The re-enter password is required'
                    },
                    stringLength: {
                    	min: 6,
                    	max: 8,
                    	message: 'The password must be between 6 and 8 characters long'
                    },
                    different: {
                        field: 'username',
                        message: 'The password cannot be the same as username'
                    }
                }
            },
            birthday: {
                validators: {
                    notEmpty: {
                        message: 'The birthday is required'
                    },
                    date: {
                        format: 'DD/MM/YYYY',
                        message: 'The date of birth is not valid'
                    },
                    callback: {
                    	message: 'You must be at least 18 years of age',
                    	callback: function(value, validator, $field) {
            			    var today = new Date();
                            var year = today.getFullYear();
                            var valueYear = value.substr(value.length - 4);
            			    var result = year - valueYear;
            			    if(result<18){
            					return false;
            			    }
            			    return true;
                        }
                    }
                }
            },
            acceptTerms: {
                validators: {
                    notEmpty: {
                    	message: 'Please accept the terms of the application'
                    }
                }
            }
        }
    });  
    
}); //Cierre de la función general