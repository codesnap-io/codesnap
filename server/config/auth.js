var GitHubStrategy = require('passport-github2').Strategy;
var development = require('../config/env/development.js');
var passport = require("passport");
var User = require('../models/user.server.model.js');

exports.githubStrategy = function() {
  passport.use(new GitHubStrategy({
      clientID: development.githubClientID,
      clientSecret: development.githubClientSecret,
      callbackURL: development.githubCallbackUrl
    },
    function(accessToken, refreshToken, profile, done) {
      console.log(profile);
      User.where({
          github_id: profile.id
      })
      .fetch()
      .then(function(user) {
        if (!user) {
          User.forge({
            github_id: profile.id,
            username: profile.username,
            first_name: profile.displayName.split(" ")[0],
            last_name: profile.displayName.split(" ")[1],
            email: profile._json.email,
            token: accessToken
          }).save().then(function(newUser) {
            return done(null, newUser);
          });
        }
    }).catch(function(err) {
        console.log('error');
        console.log(err);
      });
  }));
};

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});



/* this function can be used if we choose to run sessions */

// exports.authenticate = function(req, res, next) {
//   if (req.isAuthenticated()) { return next(); }
//   res.redirect('/login');
// };
