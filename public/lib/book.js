define(function(require){

	var $ = require('jquery'),
		_ = require('underscore'),
		Backbone = require('backbone'),
		text = require('text'),
		alert = require('alert');

	var Model = Backbone.Model.extend({
		defaults: {
			id: null,
			owner: null,
			title: null,
			author: null,
			publisher: null,
			category: null,
			owner_name: null,
			category_name: null,
			categories: []
		},
		initialize: function(attributes, options){
			this.bind('error', this.onError, this)
			this.bind('all', function(e){ console.log('model event: ' + e) }, this);
		},
		onError: function(model, resp, options){
			if(typeof model.collection === 'undefined') return;
			alert('Error', resp.responseText, 'error');
		}
	})

	var View = Backbone.View.extend({
		tagName: 'tr',
		events: {
			'click .btn-edit': function(e){
				e.preventDefault();
				this.model.fetch({success: function(){
					console.log('fetched')
					this.onedit = true;
					//this.$('.on-edit').show().siblings().hide();	
				}.bind(this)})

			},
			'click .btn-delete': function(e){
				e.preventDefault();
				this.model.destroy({ wait: true, error: function(model, response, options){
					alert('Error', response.responseText, 'error');
				} });
			},
			'submit form': function(e){
				e.preventDefault();
				this.model.save(this.$('form').serializeObject(), {success: function(){
					this.onedit = false;
				}.bind(this)})
			}
		},
		template: _.template(require('text!/lib/template/book.html')),
		initialize: function(){
			this.onedit = false;
			this.model.bind('sync', this.render, this);
			this.model.bind('remove destroy', this.remove, this);
		},
		render: function(){
			console.log('render', this.model.attributes);
			this.$el.html(this.template(this.model.attributes))
			if(this.model.isNew() || this.onedit)
				this.$('.on-edit').show().siblings().hide();
			return this;
		}
	})

	var Collection = Backbone.Collection.extend({
		model: Model,
		view: View,
		url: '/api/book',
		initialize: function(models, options){
			this.container = options.container;
			this.bind('add', this.onAddEvent);
			this.bind('reset', this.onResetEvent);
			this.bind('error', function(model, resp, options){
				console.log(model, resp, options);
				if(typeof model.models === 'undefined') return;
				alert('Error', resp.responseText, 'error');
			});
			this.bind('all', function(e){ console.log('collection event: ' + e) }, this);
		},
		onAddEvent: function(model){
			var view = new this.view({model: model});
			this.container.append(view.render().$el);
		},
		onResetEvent: function (collection, options){
			_.each(options.previousModels, function(model){
				model.trigger('remove');
			});
			this.each(_.bind(this.onAddEvent, this));
		}
	})

	var App = Backbone.View.extend({
		events: {
			'click .btn-create': function(e){
				e.preventDefault();
				$.get('/api/book/0').done(function(data){
					console.log(data)
					this.collection.add([data]);
				}.bind(this))
			},
			'change form.search select[name="category"]': 'search',
			'change form.search input[name="owner"]': 'search',
			'submit form.search': 'search'
		},
		initialize: function(){
			this.collection = new Collection([], {container: $('tbody')});
			$.get('/api/category').done(function(items){
				var $el = this.$('select[name="category"]');
				_.each(items, function(item){
					$el.append('<option value="'+item.id+'">'+item.name+'</option>');
				})
			}.bind(this))
		},

		fetch: function (){
			this.collection.fetch(arguments);
		},
		
		search: function(e){
			e.preventDefault();
			this.collection.fetch({data: this.$('form.search').serializeObject()});
		}
	})
	return App;

})