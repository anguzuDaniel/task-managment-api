const express = require('express')
const passport = require('../models/Passport')
const router = express.Router();
const authController = require('../controllers/authController');
const User = require('../models/User')

router.get('/', (req, res) => { res.render('index'); });

router.get('/signup', (req, res) => { res.render('signup'); });

router.get('/login', (req, res) => { res.render('index'); });

router.post('/login/password', passport.authenticate('local', {
  successRedirect: '/login-success',
  failureRedirect: '/login-failure',
}),(err, req, res, next) => {
  console.log(err);
  if (err) next(err);
});

router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

router.post('/signup', authController.signup);

router.get('/login-failure', (req, res, next) => {
  console.log(req.session);
  res.send('Login Attempt Failed.');
});

router.get('/login-success', (req, res, next) => {
  console.log(req.session);
  res.send('Login Attempt was successful.');
});

module.exports = router;