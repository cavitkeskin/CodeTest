'use strict';

var request = require('request').defaults({jar: true}),
	util = require('util'),	
	assert = require('assert'),
	_ = require('underscore'),
	config = require('../config.json');

//var request = request.defaults({jar: jar});

describe('/api/user', function(){
	it('current user info before login, should return {id: null}', function(done){
		request.get({
			url: config.server.url + '/api/user/current'
		}, function(err, res, body){
			if(err) throw err; 
			assert(res.statusCode == 200, util.format('it should return status = 200 (%s, %s)', res.statusCode, body))
			var expected = {id: null},
				data = JSON.parse(body);
			assert.deepEqual(data, expected, 'it should return with {id: null}')
			done();
		})     		
	})

	it('search before login, should return 401, Unauthorized', function(done){
		request({
			url: config.server.url + '/api/user'
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

	it('login with fake username-password, should return 401, then user data should be {id: null}', function(done){
		request.post({
			url: config.server.url + '/api/user/signin',
			form: {username: config.server.username, password: 'bogus-password'}
		}, function(err, res, body){
			if(err) throw err; 
			assert(res.statusCode == 401, util.format('it should return status = 401 (%s, %s)', res.statusCode, body))
			request.get(config.server.url + '/api/user/current', function(err, res, body){
				if(err) throw err; 
				assert(res.statusCode == 200, util.format('it should return status = 200 (%s, %s)', res.statusCode, body))
				var expected = {id: null},
					data = JSON.parse(body);
				assert.deepEqual(data, expected, 'it should return with {id: null}')
				done();	
			})
		})     		
	})
	
	it('search after logout, should return 401, Unauthorized', function(done){
		request({
			url: config.server.url + '/api/user'
		}, function(err, res, body){
			if(err) throw err; 
			assert(res.statusCode == 401, util.format('it should return status = 401 (%s, %s)', res.statusCode, body))
			done();
		})     		
	})
	
	it('login with username, should return 200', function(done){
		request.post({
			url: config.server.url + '/api/user/signin',
			form: {username: config.server.email, password: config.server.password}
		}, function(err, res, body){
			if(err) throw err; 
			assert(res.statusCode == 200, util.format('it should return status = 200 (%s, %s)', res.statusCode, body))
			done();
		})     		
	})
	
	it('current user info, should return User data', function(done){
		request.get({
			url: config.server.url + '/api/user/current'
		}, function(err, res, body){
			if(err) throw err; 
			assert(res.statusCode == 200, util.format('it should return status = 200 (%s, %s)', res.statusCode, body))
			var expected = 'id,name'.split(','),
				data = JSON.parse(body);
			assert.deepEqual(_.keys(data), expected, util.format('expected fields: %s', expected.join(', ')))
			done();
		})     		
	})

	it('search after login, should return 200', function(done){
		request({
			url: config.server.url + '/api/user'
		}, function(err, res, body){
			if(err) throw err; 
			assert(res.statusCode == 200, util.format('it should return status = 401 (%s, %s)', res.statusCode, body))
			//var data = JSON.parse(body);
			
			done();
		})     		
	})
	
	it('logout, should cookie was deleted', function(done){
		request({
			url: config.server.url + '/api/user/logout'
		}, function(err, res, body){
			if(err) throw err; 
			assert(res.statusCode == 200, util.format('it should return status = 200 (%s, %s)', res.statusCode, body))
			request.get(config.server.url + '/api/user', function(err, res, body){
				if(err) throw err; 
				assert(res.statusCode == 401, util.format('it should return status = 401 (%s, %s)', res.statusCode, body))
				done();	
			})
			
		})     		
	})
	
	
})
