

requirejs(['initialize'], function(){

	requirejs(['login'], function(App){

		var app = new App({el: $('div.container')});
		
	});

})
