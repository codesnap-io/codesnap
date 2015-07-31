(function() {
  'use strict';

  var Comment = require('../models/comment.server.model');
  var jwt = require('jwt-simple');

  exports.addComment = function(req, res) {
    var commentInfo = {
      user_id: jwt.decode(req.body.user_id, process.env.jwtSecret),
      post_id: req.body.post_id,
      paragraph: req.body.paragraph,
      text: req.body.text
    };

    Comment.add(commentInfo, function() {
      res.json("Post successfully added.");
    });
  };

  exports.deleteComment = function(req, res) {
    var commentId = req.query.comment_id;
    Comment.remove(commentId)
    .then(function() {
      res.json("Comment deleted");
    });

  };

})();
