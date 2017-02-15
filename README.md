# CodeTest

# to install...

cd project_dir

npm init

bin/database.sh create

cd public/lib

bower init

npm test

npm start


#APIs

## User Api

- `GET /api/user`

	return all users list
	
- `POST /api/user/signin`

	reads username and password, if succeed to login creates unique token. then return with this token.
	if fails returns with http error status 401
	
- `GET /api/user/logout`

	delete token from redis server
	
- `GET /api/user/current`

	return current user information
	if session is started return {id: integer, name: 'USer Name'}
	if session closed returns {id: null}
	
## Category Api


All category's APIs validate token and check user permission
return http status 401 if token not valid
return http status 403 if user not have permission 

- `GET /api/category`

	returns list of categories
	
## Book api

All book's APIs validate token and check user permission
return http status 401 if token not valid
return http status 403 if user not have permission 

- `GET /api/book`

	return list of books array
	
- `GET /api/book/id`

	return data of requested book object. This book object also have nested list of all categories.
	
- `POST /api/book`

	creates a new book. multiple book create does not supported.

- `PUT /api/book/id`

	Updates book with id.
	return an http status 500 If user attemp to change any data on book which is contributed by others.
	
- `DELETE /api/book/id`

	it deletes book which id is given.
	
	
## Summary

APi read token from cookies. Token should be given on every request for 3rd party application such as mobile apps. It is not supported right now.
