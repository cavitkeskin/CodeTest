'use strict';

var request = require('request').defaults({jar: true}),
	util = require('util'),	
	assert = require('assert'),
	_ = require('underscore'),
	config = require('../config.json');

//var request = request.defaults({jar: jar});

describe('/api/category', function(){

	after(function(done) {	
		request({
			url: config.server.url + '/api/user/logout'
		}, function(err, res, body){
			if(err) throw err; 
			assert(res.statusCode == 200, util.format('it should return status = 200 (%s, %s)', res.statusCode, body));
			done();
		})     		
		
	})
	
	it('search before login, should return 401, Unauthorized', function(done){
		request({
			url: config.server.url + '/api/category'
		}, function(err, res, body){
			if(err) throw err; 
			assert(res.statusCode == 401, util.format('it should return status = 401 (%s, %s)', res.statusCode, body))
			done();
		})     		
	})
	
	it('login with email, should return 200', function(done){
		request.post({
			url: config.server.url + '/api/user/signin',
			form: {username: config.server.email, password: config.server.password}
		}, function(err, res, body){
			if(err) throw err; 
			assert(res.statusCode == 200, util.format('it should return status = 200 (%s, %s)', res.statusCode, body))
			done();
		})     		
	})

	it('search after login, should return 200', function(done){
		request({
			url: config.server.url + '/api/category'
		}, function(err, res, body){
			if(err) throw err; 
			assert(res.statusCode == 200, util.format('it should return status = 401 (%s, %s)', res.statusCode, body))
			var data = JSON.parse(body);
			assert(Array.isArray(data), 'it should return an array');
			done();
		})     		
	})
	
	
	
})
