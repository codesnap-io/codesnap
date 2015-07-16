(function () {
  'use strict';
  var jwt = require('jwt-simple');
  var User = require('../models/user.server.model');


  exports.githubRedirect = function (req, res) {

    /* Create a token by encoding the user's github_id */
    var token = jwt.encode(req.user.attributes.github_id, process.env.jwtSecret);

    /* Sends token as a parameter to the home page.  The home page handles this parameter in the resolve */
    /* also sends the id to store locally */

    res.redirect('/#/?token=' + token + '&userid=' + req.user.attributes.id);
  };

  exports.checkToken = function (req, res) {
    try {
      var github_id = jwt.decode(req.body.jwtToken, process.env.jwtSecret);
      User.find(github_id, function (error, user) {
        if (error) {
          res.json(false);
        } else {
          res.json(true);
        }
      });
    } catch (error) {
      res.json(false);
    }

  };

  exports.userInfo = function (req, res) {
    var userId = req.query.user_id;
    User.profileInfo(userId, function (error, user) {
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        res.json(user);
      }
    });

  };

  /* Remove user and all associated posts, post comments, post tags and post votes from the database */
  exports.deleteUser = function (req, res) {
    var userId = req.query.user_id;
    User.remove(userId, function (error, user) {
      if (error) {
        res.json(true);
      } else {
        res.json(false);
      }
    });
  };

})();
