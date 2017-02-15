'use strict';

var Database = require('lib/MySQL'),
	config = require('../config.json');
	
var obj = null,
	_db = null,
	_cache = null




class Initialize {
	get db(){
		if(!_db) {
			_db = new Database(config.database.database, config.database.user, config.database.password);
		}
		return _db;
	}

	get config(){
		return config
	}
	
	disconnect(){
		_db.end();
		_db = null;
	}
}

if(!obj) {
	obj = new Initialize();
}

module.exports = obj;
