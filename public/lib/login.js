define(function(require){
	var alert = require('alert'),
		Backbone = require('backbone');
	
		var App = Backbone.View.extend({
			events: {
				'submit form.login': function(e){
					e.preventDefault();
					var url = '/api/user/signin',
						data = $('form.login').serializeObject()

					$.post(url, data, function(data){
						console.log('User Token', data)
						document.location = '/book';
					}).fail(function(xhr){
						alert('Error', xhr.responseText, 'error');
					})

				}
			},
			initialize: function(){

			}
		})

		return App;
})