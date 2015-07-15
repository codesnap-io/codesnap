(function(){
  'use strict';
  var jwt = require('jwt-simple');
  var User = require('../models/user.server.model');


  exports.githubRedirect = function(req, res) {
    /* Create a token by encoding the user's github_id */
    var token = jwt.encode(req.user.attributes.github_id, process.env.jwtSecret);

     /* Sends token as a parameter to the home page.  The home page handles this parameter in the resolve */
    res.redirect('/#/?token=' + token);
  };

  exports.checkToken = function(req, res) {
    // console.log(req.body);
    // console.log(req.body.jwtToken);
    
    try {
      console.log(req.body.jwtToken);
      var github_id = jwt.decode(req.body.jwtToken, process.env.jwtSecret);
      User.find(github_id, function(error, user) {
        if (error) {
          res.json(false);
        } else {
          res.json(true);
        }
      });
    }
    catch(error) {
      console.log("Invalid token3");
      res.json(false);
    }

  };

  exports.userInfo = function(req, res) {
    var userId = req.query.user_id;
    console.log(userId);

    User.profileInfo(userId, function(error, user) {
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        res.json(user);
      }
    });

  };

  exports.deleteUser = function(req, res) {
    var userId = req.query.user_id;

    User.remove(userId, function(error, user) {
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        res.json(user);
      }
    });


  };


})();