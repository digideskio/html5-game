jewel.dom = (function(){
	var $ = Sizzle;

	function hasClass(el, className){
		var regex = new RegExp("(^|\\s)"+ className + "(\\s|$)");
		return regex.test(el.className);
	}

	function addClass(el, className){
		if(!hasClass(el, className)){
			el.className += " " + className;
		};
	}

	function removeClass(el, className){
		var regex = new RegExp("(^|\\s)"+ className + "(\\s|$)");
		el.className = el.className.replace(regex, " ");
	}

	return {
		$ : $,
		hasClass : hasClass,
		addClass : addClass,
		removeClass : removeClass
	}
})();