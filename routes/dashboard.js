var express = require('express');
var passport = require('../module/auth.js');
var router = express.Router();

/* GET home page. */
router.get('/', passport.isAuthenticatedRole(['bos']), function (req, res, next) {
  res.render('dashboard/overview', {
    title: 'Overview',
    layout: 'layout'
  });
});

module.exports = router;
