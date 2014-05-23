//scripts/board.js
jewel.board = (function(){
  /* Funcionalidades del juego*/
  var settings,
      jewels,
      cols,
      rows,
      baseScore,
      numJewelTypes;

  function initialize(callback){
    settings        = jewel.settings;
    numJewelTypes   = settings.numJewelTypes;
    baseScore       = settings.baseScore;
    cols            = settings.cols;
    rows            = settings.rows;
    fillBoard();
    callback();
  }

  function fillBoard(){
    var x, y,
        type;
    jewels = [];
    for(x = 0; x < cols; x++){
      jewels[x] = [];
      for(y = 0; y < rows; y++){
        type = randomJewel();
        while((type === getJewel(x-1, y) && type === getJewel(x-2, y)) ||
              (type === getJewel(x, y-1) && type === getJewel(x, y-2))){
          type = randomJewel();
        }
        jewels[x][y] = type;
      }
    }

    //invocarse recursivamente si no tiene movimientos el nuevo tablero
    if(!hasMoves()){
      fillBoard();
    }
  }

  function amountOfRowsAndCols(){
    console.log(cols, rows);
  }

  function randomJewel(){
    return Math.floor(Math.random()*numJewelTypes);
  }

  function getJewel(x, y){
    if(x < 0 || x > cols-1 || y < 0 || y > rows -1){
      return -1;
    }else{
      return jewels[x][y];
    }
  }
  /*retornar el numero de jewels dentro de una larga cadena que incluye x,y*/
  function checkChain(x, y){
    var type = getJewel(x, y),
        left = 0, right = 0,
        down = 0, up = 0;
    //buscando hacia la derecha
    if(type === getJewel(x + right + 1, y)){
      right ++;
    }
    //buscando hacia la izquierda
    if(type === getJewel(x - right -1, y)){
      left ++;
    }
    //buscando hacia arriba
    if(type === getJewel(x, y + up + 1)){
      up ++;
    }
    //buscando hacia abajo
    if(type === getJewel(x, y - down - 1)){
      down ++;
    }

    /*console.log(Math.max(left + 1 + right, up + 1 + down));*/
    return Math.max(left + 1 + right, up + 1 + down);
  }
  
  /*retornar true si (x1, y1) pueden ser intercambiados para crear una cadena*/
  function canSwap(x1, y1, x2, y2){
    var type1 = getJewel(x1, y1),
        type2 = getJewel(x2, y2),
        chain;

    if(!isAdjacent(x1, y1, x2, y2)){
      return false;
    }
    //intercambio temporal de Jewels
    jewels[x1][y1] = type2;
    jewels[x2][y2] = type1;

    chain = (checkChain(x2,y2)  > 2 || checkChain(x1, y1) > 2);

    //revertir intercambio
    jewels[x1][y1] = type1;
    jewels[x2][y2] = type2;
    
    return chain;
  }

  //retornar true si (x1,y1) es adyacente a (x2,y2)
  function isAdjacent(x1, y1, x2, y2){
    var dx = Math.abs(x1 - x2),
        dy = Math.abs(y1 - y2);
    return (dx+dy === 1);
  }

  /*retornar mapeo bidimensional de la longitud de la cadena*/
  function getChains(){
    var x, y,
        chains = [];

    for(x = 0; x < cols; x++){
      chains[x] = [];
      for(y = 0; y < rows; y++){
        chains[x][y] = checkChain(x, y);
      }
    }
    return chains;
  }

  function check(events){
    var chains = getChains(),
        hadChains = false, score = 0,
        removed = [], moved = [], gaps = [];

    for (var x = 0; x < cols; x++ ){
      gaps[x] = 0;
      for (var y = rows - 1; y >= 0; y-- ){
        if(chains[x][y] > 2){
          hadChains = true;
          gaps[x] ++;
          removed.push({
            x: x,
            y: y,
            type: getJewel(x, y)
          });
          //agregar puntos
          score += baseScore*Math.pow(2, (chains[x][y] - 3));

        }else if( gaps[x] > 0 ){
          moved.push({
            toX: x, toY: y + gaps[x],
            fromX: x, fromY: y,
            type: getJewel(x,y)
          });
          jewels[x][y + gaps[x]] = getJewel(x, y);
        }
      }

      //Llenando desde arriba
      for( y = 0; y < gaps[x]; y++ ){
        jewels[x][y] = randomJewel();
        moved.push({
          toX: x, toY: y,
          fromX: x, fromY: y - gaps[x],
          type: jewels[x][y]
        });
      }
    }

    events = events || [];

    if(hadChains){
      events.push({
        type: "remove",
        data: removed
      },{
        type: "score",
        data: score

      },{
        type: "moved",
        data: moved
      });

      //rellenar el tablero si no hay movimientos
      if(!hasMoves()){
        fillBoard();
        events.push({
          type: "refill",
          data: getBoard()
        });
      }

      return check(events);

    }else{
      return events;
    }
  }

  /* retornar true si hay movimientos disponibles*/
  function hasMoves(){
    for ( var x = 0 ; x < cols; x ++ ){
      for ( var y = 0; y < rows; y ++ ){
        if(canJewelMove(x, y)){
          return true;
        }
      }
    }
    return false;
  }

  /*retornar true  si (x, y) es una posicion valida
    y si los jewel en la posicicion (x,y) pueden ser swap con un vecino
  */
  function canJewelMove(x, y){
    return ((x > 0 && canSwap(x, y, x - 1, y )) ||
            (x < cols-1 && canSwap(x, y, x + 1, y )) ||
            (x > 0 && canSwap(x, y, x, y -1 )) ||
            (y < rows-1 && canSwap(x, y, x, y + 1 ))
            );
  }

  //crear una copia del tablero
  function getBoard(){
    var copy = [],
        x;

    for(x = 0; x < cols; x++){
      copy[x] = jewels[x].slice(0);
    }
    return copy;
  }
  /*si es posible realizar un intercambio de jewels vecinos (x1, y1) y
    (x2, y2) y llamar el callback con la lista de evnetos del tablero
  */
  function swap(x1, y1, x2, y2, callback){
    var tmp,
        events;

    if(canSwap(x1, y1, x2, y2)){

      //swap (intercambiar) los jewel
      tmp = getJewel(x1, y1);
      jewels[x1][y1] = getJewel(x2, y2);
      jewels[x2][y2] = tmp;

      events = check();
      callback(events);
    }else{
      callback(false);
    }
  }

  /*imprimir el tablero para conocer su informacion*/
  function print(){
    var str = "";
    for(var y = 0; y < rows; y ++){
      for(var x = 0; x < cols; x++){
        str += getJewel(x, y) + " ";
      }
      str += "\r\n";
    }
    console.log(str);
  }

  return {
    /* metodos, variables que podran ser accedidos*/
    initialize:         initialize,
    printBoard:         print,
    printRowsAndCols:   amountOfRowsAndCols,
    checkChain:         getChains,
    canSwap:            canSwap,
    checking:           check,
    getBoard:           getBoard,
    swap:               swap

  };

})();