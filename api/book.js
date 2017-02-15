'use strict';

var express = require('express'),
	router = express.Router(),
	_ = require('underscore'),
	db = require('lib/initialize').db,
	DBObject = require('lib/DBObject'),
	User = require('lib/User'),
	debug = require('debug')('library:bookapi')

// Search
router.get('/', User.require('book', 'select'), (req, res, next) => {
	var dbo = new DBObject('book', db),
		param = _.omit(req.query, function(value){ return !value});
	
	if(param['owner']) param['owner'] = req.User.id;

	dbo.search(param).then(function(data){
		res.json(data)
	}).catch(next)
})

router.get('/:id', User.require('book', 'select'), (req, res, next) => {
	var dbo = new DBObject('book', db)
	dbo.get(req.params.id).then(function(data){
		data = data || {}
		return db.query('select id, name from category order by name').then((result)=>{return data.categories = result, data})
	}).then(function(data){
		res.json(data)
	}).catch(next)
})

router.post('/', User.require('book', 'insert'), (req, res, next) => {
	var dbo = new DBObject('book', db),
		data = _.extend({}, req.body, {owner: req.User.id});
	
	dbo.insert(data).then(function(data){
		res.json(data)
	}).catch(next)
})

router.put('/:id', User.require('book', 'update'), (req, res, next) => {
	var id = req.params.id,
		dbo = new DBObject('book', db);
	dbo.get(id).then(function(data){
		if(data.owner != req.User.id){
			throw new Error('You can not edit this book')
		}
		return dbo.update(id, req.body)
	}).then(function(data){
		res.json(data)
	}).catch(next)
})

router.delete('/:id', User.require('book', 'delete'), (req, res, next) => {
	var id = req.params.id,
		dbo = new DBObject('book', db);
	
	dbo.get(id).then(function(data){
		debug('COMPARE', data, req.User)
		if(data.owner != req.User.id){
			throw new Error('You can not delete this book')
		}
		return dbo.delete(id)
	}).then(function(data){
		res.json(data)
	}).catch(next)
})




module.exports = router;
