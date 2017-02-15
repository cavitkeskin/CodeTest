var express = require('express'),
	router = express.Router(),
	_ = require('underscore'),
	db = require('lib/initialize').db,
	DBObject = require('lib/DBObject'),
	User = require('lib/User'),
	debug = require('debug')('library:userapi')

// Search
router.get('/', User.require('user', 'select'), (req, res, next) => {
	var dbo = new DBObject('user', db)
	dbo.search(req.query).then(function(data){
		res.json(data)
	}).catch(next)
})

router.post('/signin', function(req, res, next){
	User.loginByCredentials(req.body.username, req.body.password).then(function(result){
		res.cookie('session', result.uid)
		res.json(result.uid)
	}).catch(function(err){
		User.logout(req.cookies.session).then(function(result){
			res.cookie('session', '')
			next(err)
		})
	})
})

router.get('/logout', (req, res, next) => {
	User.logout(req.cookies.session).then(function(result){
		res.cookie('session', '')
		res.redirect('/login')
	}).catch(next)
})

// get current user info
router.get('/current', function(req, res, next){
	var data = _.extend({}, _.pick(req.User, 'id,name'.split(',')))
	//db.encode(data, 'id,corporation', 'user')
	res.json(data)
})

module.exports = router;
