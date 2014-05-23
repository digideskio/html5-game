//scripts/board.worker-interface.js
jewel.board = (function(){
  var settings, 
      worker,
      messageCount,
      callbacks;

  function initialize(callback){
    settings  = jewel.settings;
    rows      = settings.rows;
    cols      = settings.cols;

    messageCount = 0;
    callbacks = [];
    worker = new Worker('scripts/board.worker.js');

    $(worker).bind('message', messageHandler);
    post(initialize, settings, callback);
  }

  function post(command, data, callback){
    callbacks[messageCount] = callback;
    worker.postMessage({
      id:       messageCount,
      command:  command,
      data:     data
    });
    messageCount ++;
  }

  function swap(x1, y1, x2, y2, callback){
    post('swap', {
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2
    }, callback);
  }

  function messageHandler(event){
    //ver mensajes del worker
    console.log(event.data);

    var message = event.data,
        jewels = message.jewels;

    if(callbacks[message.id]){
      callbacks[message.id](message.data);
      delete callbacks[message.id];
    }
  }

  return {
    initialize: initialize
  }
})();