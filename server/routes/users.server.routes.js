(function(){
  'use strict';
  var passport = require('passport');
  var users = require('../controllers/users.server.controller.js');
  var auth = require('../config/auth.js');


  module.exports = function(app) {
    auth.githubStrategy();

    // GET /auth/github
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in GitHub authentication will involve redirecting
    //   the user to github.com.  After authorization, GitHubwill redirect the user
    //   back to this application at /auth/github/callback

    app.get('/auth/github', app.cors(),
      passport.authenticate('github', { scope: [ 'user', 'public_repo' ] }));


    // GET /auth/github/callback
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function function will be called,
    //   which, in this example, will redirect the user to the home page.
    app.get('/auth/github/callback', app.cors(),
      passport.authenticate('github', { failureRedirect: '/login' }),
      function(req, res) {
        console.log("AAAAAAAAA");
        res.redirect('/');
    });

    /* Paramenters: user_id
       Data returned: all user info [WILL BE UPDATED] */
    app.get('/user/info', users.userInfo);

    /* Parameters: user_id
      deletes user from DB */
    app.delete('/user/info', users.deleteUser);

};



})();
