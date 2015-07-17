(function () {
  'use strict';
  var jwt = require('jwt-simple');
  var User = require('../models/user.server.model');

  exports.githubRedirect = function(req, res) {
    req.session.user = req.user;

    /* Sends token as a parameter to the home page.  The home page handles this parameter in the resolve */
    res.redirect('/');
  };

  /* If user exists in the session, passes encoded user id to the front end. */
  exports.checkAuth = function(req, res) {
    if (!!req.session.user) {
      /* Create a token by encoding the user's id */
      var token = jwt.encode(req.session.user.id, process.env.jwtSecret);
      console.log(jwt.decode(token, process.env.jwtSecret));
      res.json(token);
    } else {
      res.json(false);
    }
  };

  /* Takes the encoded user id from the client and returns:
     name, username, profile_pic_url and user's posts */
  exports.userInfo = function(req, res) {
    var userId = jwt.decode(req.query.user_id, process.env.jwtSecret);
    console.log("USER ID: ", userId);
    User.profileInfo(userId, function (error, user) {
      if (error) {
        res.send(error);
      } else {
        res.json(user);
      }
    });
  };

  /* Takes encoded user id token and removes user and all associated posts, post comments, post tags and post votes from the database */
  exports.deleteUser = function(req, res) {
    var userId = jwt.decode(req.query.user_id, process.env.jwtSecret);
    User.remove(userId, function (error, user) {
      if (error) {
        res.json(true);
      } else {
        res.json(false);
      }
    });
  };

})();
