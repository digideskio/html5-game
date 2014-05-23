/*scripts/ screen.spash.js*/
jewel.screens["splash-screen"] = (function(){
	var game = jewel.game,
			firstRun = true;

	function setup(){
		$("#splash-screen").bind('click', function(){
			game.showScreen("main-menu");
		});
	};

	function run(){
		if(firstRun){
			setup();
			firstRun = false;
		}
	};

	return {
		run: run
	};
})();