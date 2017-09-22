$(document).ready(function(){
	
    //Cuando la ventana se hace más pequeño, se realiza la siguiente función
    $(window).resize(function(){
      var botonFB = $("#btnFB");
      //Gaurdamos en una variable el width de la ventana de forma local
      var w=$(window).width();
      //Si la anchura es mayor que 768px
      if(w>768) {
        //Eliminamos el atributo style
    	  botonFB.removeAttr("style");
      }
      if(w>768) {
    	  botonFB.attr("style");
    	  botonFB.css("margin-bottom","10px");
    	  
      }    
    }); //Cierre de la función resize
}); //Cierre de la función general