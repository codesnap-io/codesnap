(function() {
  'use strict';
  var jwt = require('jwt-simple');
  var User = require('../models/user.server.model');

  exports.githubRedirect = function(req, res) {
    req.session.user = req.user;
    res.redirect('/');
    console.log("client redirected");
  };

  /* If user exists in the session, passes encoded user id to the front end. */
  exports.checkAuth = function(req, res) {
    if (!!req.session.user) {
      console.log("user is logged in");
      /* Create a token by encoding the user's id */
      var token = jwt.encode(req.session.user.id, process.env.jwtSecret);
      res.json(token);
    } else {
      console.log("user is not logged in");
      res.json(false);
    }
  };

  /* Responds with true if user session is successfully deleted  */
  exports.logout = function(req, res) {
    if (!!req.session.user) {
      req.session.destroy(function(err) {
        if (err) {
          console.error("Error on user session delete: ", err);
        }
      });
      res.json(true);
    } else {
      res.json(false);
    }
  };

  /* Takes the encoded user id from the client and returns:
     name, username, profile_pic_url and user's posts */
  exports.userInfo = function(req, res) {
    var userId = jwt.decode(req.query.user_id, process.env.jwtSecret);
    console.log("user id: ", userId);
    User.profileInfo(userId, function(error, user) {
      if (error) {
        console.log(JSON.stringify(error));
        // if (error === "Invalid user id.\n") {
        //   console.log("PROFILE INFO ERROR: ", error, ", deleting user session.");
        //   exports.logout(req, res);
        // } else {
          res.send(error);
        // }
      } else {
        // console.log("IN USERINFO USER IS: ", user);
        res.json(user);
      }
    });
  };

  /* Takes encoded user id token and removes user and all associated posts, post comments, post tags and post votes from the database */
  exports.deleteUser = function(req, res) {
    // console.log(req.query.user_id);
    var userId = jwt.decode(req.query.user_id, process.env.jwtSecret);
    User.remove(userId, function(error, user) {
      if (error) {
        console.log("CAN'T DELETE");
        res.json(true);
      } else {
        console.log("SUCCESSFULLY DELETED");
        delete req.session.user;
        res.json(false);
      }
    });
  };

})();
