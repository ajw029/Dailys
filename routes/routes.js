var express = require('express');
var router = express.Router();

router.get(['/login', '/signup'], function(req, res) {
  res.render('home');
});

// Routes for Login and Sign Up
router.get(['/', '/login.html'], function(req, res) {
  res.redirect('login');
});

module.exports = router;
