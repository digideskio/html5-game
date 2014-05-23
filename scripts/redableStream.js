var request = ('request');

var s = request('www.google.com');
s.on('data', function(dataChunk){
	console.log("<<<Los datos leidos>>>", dataChunk);
});

s.on('end', function(){
	console.log("<<<No hay mas datos que leer>>>");
});