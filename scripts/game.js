/*scripts/ game.js*/
jewel.game = (function(){
  //ocultar la pantalla activa si se llama otra, con una ide especifica
  function showScreen(screenId){
    var activateScreen = $("#game .screen.active")[0],
        screen = $("#" + screenId)[0];

    if(activateScreen){
      $(activateScreen).removeClass('active');
    }
    //Ejecutando el modulo screen
    jewel.screens[screenId].run();
    $(screen).addClass("active"); //mostrando la pantalla html
  }
  function setup(){
    //desabilitando el comportamiento nativo touchmove
    //prevenir overscroll
    $(document).bind('touchmove', function(eve){
      eve.preventDefault();
    });
  }
  // exponer metodos publicos
  return {
    showScreen: showScreen,
    setup: setup
  }
})();