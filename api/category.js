var express = require('express'),
	router = express.Router(),
	_ = require('underscore'),
	db = require('lib/initialize').db,
	DBObject = require('lib/DBObject'),
	User = require('lib/User'),
	debug = require('debug')('library:categoryapi')

// Search
router.get('/', User.require('category', 'select'), (req, res, next) => {
	var dbo = new DBObject('category', db)
	dbo.search(req.query).then(function(data){
		res.json(data)
	}).catch(next)
})

module.exports = router;
