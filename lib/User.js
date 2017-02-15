'use strict';

var util = require('util'),
	db = require('./initialize').db,
	cache = require('lib/Cache'),
	DBObject = require('lib/DBObject'),
	_ = require('underscore'),
	crypto = require('crypto'),
	debug = require('debug')('library:userlib')

let defaultUserInfo = {id: null, name: null}

class User extends DBObject {

	constructor (database){
		super('user', database)
	}

	static loginByCredentials(username, password){
		var sql = 'select id, name from `user` where email = :username and password = md5(:password);'
		return db.first(sql, {username: username, password: password}).then(function(data){
			if(!data){
				var err = new Error('username/password invalid')
				err.status = 401
				throw err;
			};
			var raw = _.values(_.extend({s: crypto.randomBytes(128)}, data)).join(),
				uid = crypto.createHash('sha256').update(raw).digest('hex')
			return cache.json(uid, data).then(function(result){
				return {uid: uid, user: data, cache: result}
			})
			
		})
	}

	static logout(session){
		return cache.delete(session)
	}
	
	static authenticate(force){
		return function(req, res, next){
			cache.json(req.cookies.session||'bogus').then(function(data){
				debug('user data from redis', _.pick(data, 'id', 'email'))
				req.User = data || {id: null}
				if(req.User.id) return next()
				if(force){
					console.log('user auth forced')
					res.status(401).send('Unauthorized')
				} else next()
					}).catch(next)
		}
	}

	static require(where, what){
		return function(req, res, next){
			if(!req.User.id){
				var err = new Error('Unauthorized')
				err.status = 401
				return next(err)
			}
			return next();
		}
	}
}

module.exports = User
