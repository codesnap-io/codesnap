(function(){
  'use strict';
  var passport = require('passport');
  var users = require('../controllers/users.server.controller.js');

  module.exports = function(app) {

    // app.post('/signup', users.signup);
    // app.post('/login', users.login);


  // app.get('/auth/github',
  //   passport.authenticate('github', { scope: [ 'user:email' ] }));
  //
  // app.get('/auth/github/callback',
  //   passport.authenticate('github', { failureRedirect: '/login' }),
  //   function(req, res) {
  //     // Successful authentication, redirect home.
  //     res.redirect('/');
  // });
};



})();
