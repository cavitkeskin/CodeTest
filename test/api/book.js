'use strict';

var request = require('request').defaults({jar: true}),
	util = require('util'),	
	assert = require('assert'),
	expect = require('expect.js'),
	_ = require('underscore'),
	config = require('../config.json');

//var request = request.defaults({jar: jar});

describe('/api/book', function(){

	var user, book, books = [];
	
	after(function(done) {	
		request({
			url: config.server.url + '/api/user/logout'
		}, function(err, res, body){
			if(err) throw err; 
			assert(res.statusCode == 200, util.format('it should return status = 200 (%s, %s)', res.statusCode, body));
			done();
		})     		
	})
	
	it('search book before login, should return 401, Unauthorized', function(done){
		request({
			url: config.server.url + '/api/book'
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

	it('current user info, should return an object', function(done){
		request({
			url: config.server.url + '/api/user/current'
		}, function(err, res, body){
			if(err) throw err; 
			assert(res.statusCode == 200, util.format('it should return status = 401 (%s, %s)', res.statusCode, body))
			user = JSON.parse(body);
			done();
		})     		
	})
	
	it('search books after login, should return 200', function(done){
		request({
			url: config.server.url + '/api/book'
		}, function(err, res, body){
			if(err) throw err; 
			assert(res.statusCode == 200, util.format('it should return status = 401 (%s, %s)', res.statusCode, body))
			var data = JSON.parse(body);
			assert(Array.isArray(data), 'it should return an array');
			books = data;
			done();
		})     		
	})
	
	it('get a book', function(done){
		request({
			url: config.server.url + '/api/book/' + books[0].id
		}, function(err, res, body){
			if(err) throw err; 
			assert(res.statusCode == 200, util.format('it should return status = 401 (%s, %s)', res.statusCode, body))
			var data = JSON.parse(body);
			expect(data).to.have.keys('id,owner,title,author,publisher,category,owner_name,category_name'.split(','))

			done();
		})     		
	})

	it('insert a book', function(done){
		request.post({
			url: config.server.url + '/api/book',
			form: {title: 'Test Book', 'author': 'David Sharp', publisher: 'Printy', category:2}
		}, function(err, res, body){
			if(err) throw err; 
			assert.equal(res.statusCode, 200, `res.status should be 200, ${body}`)
			var data = JSON.parse(body)
			expect(data).to.be.an(Object)
			expect(data).to.have.keys('id,owner,title,author,publisher,category,owner_name,category_name'.split(','))
			expect(data.id).to.match(/^(\d+)$/);
			expect(data.owner_name).to.be('Cavit Keskin');
			expect(data.title).to.be('Test Book');
			book = data;
			done();
		})     		
	})

	
	it('update the book, should give an error, owner is different', function(done){
		var book = _.find(books, (book) => book.owner != user.id )
		request.put({
			url: config.server.url + '/api/book/' + book.id,
			form: {title: 'Bogus', category: 5}
		}, function(err, res, body){
			if(err) throw err; 
			assert.equal(res.statusCode, 500, `res.status should be 500, ${body}`)
			done();
		})     		
	})
	
	it('update the own book', function(done){
		request.put({
			url: config.server.url + '/api/book/' + book.id,
			form: {title: 'Bogus', category: 5}
		}, function(err, res, body){
			if(err) throw err; 
			assert.equal(res.statusCode, 200, `res.status should be 200, ${body}`)
			var data = JSON.parse(body)
			expect(data).to.be.an(Object)
			expect(data).to.have.keys('id,owner,title,author,publisher,category,owner_name,category_name'.split(','))
			expect(data.id).to.be(book.id);
			expect(data.title).to.be('Bogus');
			expect(data.category).to.be(5);
			done();
		})     		
	})
	
	it('delete book, should gives error, owner is different', function(done){
		var book = _.find(books, (book) => book.owner != user.id )
		request.delete({
			url: config.server.url + '/api/book/' + book.id
		}, function(err, res, body){
			if(err) throw err; 
			assert.equal(res.statusCode, 500, `res.status should be 500, ${body}`)
			done();
		})     		
	})
	
	it('delete the own book', function(done){
		request.delete({
			url: config.server.url + '/api/book/' + book.id
		}, function(err, res, body){
			if(err) throw err; 
			assert.equal(res.statusCode, 200, `res.status should be 200, ${body}`)
			var data = JSON.parse(body)
			expect(data).to.be(true)
			done();
		})     		
	})
	
})
