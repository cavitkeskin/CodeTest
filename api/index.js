var express = require('express'),
    router = express.Router(),
    user = require('lib/User');

router.all('*', user.authenticate());

router.use('/user', require('./user.js'));
router.use('/category', require('./category.js'));
router.use('/book', require('./book.js'));

module.exports = router;
