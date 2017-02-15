require.config({
	baseUrl: '/lib',
	paths: {
		jquery: 'bower_components/jquery/dist/jquery',
		backbone: 'bower_components/backbone/backbone',
		underscore: 'bower_components/underscore/underscore',
		bootstrap: 'bower_components/bootstrap/dist/js/bootstrap',
		text: 'bower_components/text/text',
		alert: 'bower_components/sweetalert/dist/sweetalert-dev'
	}
});

requirejs(['jquery', 'underscore'], function($, _){
	_.templateSettings = {
		evaluate    : /\{\%([\s\S]+?)\%\}/g,
		interpolate : /\{\{([\s\S]+?)\}\}/g,
		escape      : /\{\{-([\s\S]+?)\}\}/g
	};
	
	$.fn.serializeObject = function () {
		"use strict";
		
		var result = {};
		var add = function(root, name, value){
			var k = name.shift();
			if(name.length == 0){
				if(typeof root[k] === 'undefined') 
					root[k] = value; 
				else if(Array.isArray(root[k])) 
					root[k].push(value);
				else 
					root[k] = [root[k], value];
			} else {
				if(typeof root[k] === 'undefined')
					root[k] = {};
				add(root[k], name, value)
			}
		}

		this.serializeArray().forEach(function(item){
			add(result, item.name.split('.'), item.value);
		})
		return result;
	};
	
})

