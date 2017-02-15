var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var user = require('lib/User');
var api = require('./api/index.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Api Services, catch invalid request and errors in api services
app.use('/api', api, (req, res)=>{ 
	res.status(404)
	res.send('invalid api request')
}, (err, req, res, next) => {
	res.status(err.status || 500)
	res.send(err.message)
});

app.use('/:page', user.authenticate(), function(req, res, next){
	var page = req.params.page
	res.render(req.User.id ? page : 'login', {});
});

app.use('/', user.authenticate(), function(req, res, next){
	res.render(req.User.id ? 'book' : 'login', {});
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
