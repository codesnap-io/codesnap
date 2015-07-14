(function(){
  'use strict';

  var User = require('../models/user.server.model');


  exports.userInfo = function(req, res) {
    var userId = req.query.user_id;

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
