/*scripts/ loader.js*/
var jewel = {
  screens: {},
  /*adding settings of game*/
  settings: {
    rows: 8,
    cols: 8,
    baseScore: 100,
    numJewelTypes: 7
  }
};

//esperar hasta que main document cargue
window.addEventListener('load', function(){
  // iniciar carga dinamica
  Modernizr.addTest('standalone', function(){
    return (window.navigator.standalone != false);
  });

  Modernizr.load([{
    //estos archivos siempre seran cargados
      load : [
        /*'http://code.jquery.com/jquery-1.11.0.min.js',*/
        'scripts/jquery.min.js',
        'scripts/game.js',
      ],
    },
    {
      //llamar cuando todos los archivos hayan finalizado
      //y ejecutar
      test: Modernizr.standalone,
      yep:  "scripts/screen.splash.js",
      nope: "scripts/screen.splash-install.js",
      complete: function(){
        jewel.game.setup();
        if(Modernizr.standalone){
          //show the first screen
          jewel.game.showScreen("splash-screen");
          console.log("all files loaded");
        }else{
          jewel.game.showScreen("splash-install");
        }
      }
    }
  ]);
  /*Loader stage 2*/
  if(Modernizr.standalone){
    Modernizr.load([{
      load: [
        "scripts/board.js",
        "scripts/screen.main-menu.js"
      ]
    },{
      test: Modernizr.webworkers,
      yep:  "scripts/board.worker-interface.js",
      nope: "scripts/board.js"
    }
    ]);
  }
}, false);