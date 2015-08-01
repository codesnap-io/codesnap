(function() {
  'use strict';

  var Like = require('../models/like.server.model');
  var jwt = require('jwt-simple');
  var get_ip = require('ipware')().get_ip;

  exports.checkLike = function(req, res) {
    var userId = jwt.decode(req.query.user_id, process.env.jwtSecret);
    var postId = req.query.post_id;

    Like.check(userId, postId, function(status) {
      res.json(status);
    });
  };

  exports.toggleLike = function(req, res) {
    console.log(get_ip(req));
    var userId = jwt.decode(req.query.user_id, process.env.jwtSecret);
    var postId = req.query.post_id;

    Like.toggle(userId, postId, function() {
      res.send("Like updated");
    });
  };

})();
