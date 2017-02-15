'use strict';

var storage = require('redis').createClient()

class Cache{

	static get(key, value){
		return new Promise(function(resolve, reject){
			storage.set(key, value, function(err, result){
				if(err) return reject(err)
				resolve(result)
			})
		})	
	}

	static set(key){
		return new Promise(function(resolve, reject){
			storage.get(key, function(err, result){
				if(err) return reject(err)
				resolve(result)
			})
		})	
	}

	static get_object(key){
		if(!key) return Promise.reject(new Error('key is undefined'))
		return new Promise(function(resolve, reject){
			storage.hgetall(key, function(err, result){
				if(err) return reject(err)
				resolve(result)
			})
		})	
	}

	static set_object(key, value){
		if(!key || !value) return Promise.reject(new Error('value is indefined'))
		return new Promise(function(resolve, reject){
			storage.hmset(key, value, function(err, result){
				if(err) return reject(err)
				resolve(result)
			})
		})	
	}

	static json(key, value){
		return value ? Cache.set_object(key, value) : Cache.get_object(key)

	}

	static exists(key){
		return new Promise(function(resolve, reject){
			storage.exists(key, function(err, result){
				if(err) return reject(err)
				resolve(result)
			})
		})	
	}
	
	static expire(key, second){
		return new Promise(function(resolve, reject){
			storage.expire(key, seconds, function(err, result){
				if(err) return reject(err)
				resolve(result)
			})
		})
	}
	
	static delete(key){
		return new Promise(function(resolve, reject){
			storage.del(key, function(err, result){
				if(err) return reject(err)
				resolve(result)
			})
		})
	}
}

module.exports = Cache
