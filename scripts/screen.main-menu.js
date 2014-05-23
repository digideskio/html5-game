// scripts/ screen.main-menu.js
jewel.screens["main-menu"] = (function(){
	var game = jewel.game;
	var firstRun = true;

	function setup(){
		$("#main-menu").bind('click', function(e){
			if(e.target.nodeName.toLowerCase() === "button"){
				var action = e.target.getAttribute('name');
				game.showScreen(action);
			}
		});
	}

	function run(){
		if(firstRun){
			setup();
			firstRun = false;
		}
	}

	return {
		run : run
	}
})();