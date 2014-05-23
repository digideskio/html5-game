jewel.screens["splash-install"] = (function(){
	var game = jewel.game;

	function setup(){
		$("#splash-install").bind("click", function(){
			game.showScreen("main-menu");
		});
	}

	function run(){
		setup();
	}

	return {
		run: function() {}
	}
})();