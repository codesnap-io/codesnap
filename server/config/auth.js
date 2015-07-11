var GitHubStrategy = require('passport-github2').Strategy;
// var development = require('../config/env/development.js');
var passport = require("passport");
var User = require('../models/user.server.model.js');

exports.githubStrategy = function() {
  console.log(process.env.githubClientID);
  console.log(process.env.githubClientSecret);
  console.log(process.env.githubCallbackUrl);
  passport.use(new GitHubStrategy({
      /* These variables are tied to our application's account.  By including them here, we gain access to the users we authenticate */
      clientID: process.env.githubClientID,
      clientSecret: process.env.githubClientSecret,
      callbackURL: process.env.githubCallbackUrl
    },
    function(accessToken, refreshToken, profile, done) {
      console.log(profile);
      User.where({
          github_id: profile.id
      })
      .fetch()
      .then(function(user) {
        /* Check to see if user exists.  If user does not exist, create user */
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
        console.log(err);
      });
  }));
};

/* Determines what data from the user object should be stored in the session result of serializeUser method is attached to the session as req.session.passport.user */
passport.serializeUser(function(user, done) {
  done(null, user);
});

/* Pass in key that is saved in req.session.passport.user -- this key is used to retrieve the user object attaches the user object to the request as req.user */
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


/* this function can be used if we choose to run sessions */

// exports.authenticate = function(req, res, next) {
//   if (req.isAuthenticated()) { return next(); }
//   res.redirect('/login');
// };
