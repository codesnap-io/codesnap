(function(){
  'use strict';

  var Post = require('../models/post.server.model');

  exports.postInfo = function(req, res) {
    var postId = req.query.post_id;

    Post.postInfo(postId, function(error, post) {
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        res.json(post);
      }
    });

  };

})();
