(function(){
  'use strict';

  var User = require('../models/user.server.model');
  var GitHubStrategy = require('passport-github2').Strategy;
  var development = require('../config/env/development.js');
  var db = require('../config/db');
  var passport = require("passport");

  // passport.use(new GitHubStrategy({
  //     clientID: development.githubClientID,
  //     clientSecret: development.githubClientSecret,
  //     callbackURL: development.githubCallbackUrl
  //   },
  //   function(accessToken, refreshToken, profile, done) {
  //     db.knex.select('*').from('users').where({
  //         id: profile.id,
  //     }).then(function(user) {
  //       if (!user) {
  //         db.knex('users').insert({
  //           id: profile.id,
  //           // username: profile.username
  //         }).then(function(user) {
  //           return done(user);
  //         });
  //     }
  //   }).catch(function(err) {
  //       console.log(err);
  //     })
  //
  // }));
  /* Checks to see if user account already exists.  If it does not, create user account and login user.  If it does not, return error message. */
  exports.signup = function(req, res, next) {

  };

  /* Attemps to log user in with provided credentials.  If credentials are invalid, return an error message.  If the credentials are valid, authenticate user and redirect them back to the page they were on. */
  exports.login = function(req, res, next) {

  };

})();
