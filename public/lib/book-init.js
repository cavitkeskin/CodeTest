requirejs(['initialize'], function(){
	
	requirejs(['book'], function(Book){
		var App = new Book({el: $('div.container')})
		App.fetch();
		
	});
	
})