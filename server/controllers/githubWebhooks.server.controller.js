(function(){
  'use strict';

  var Post = require('../models/post.server.model');

  exports.postreceive = function(req, res) {
    //var postId = req.query.post_id;
    //
    //Post.postInfo(postId, function(error, post) {
    //  if (error) {
    //    console.log(error);
    //    res.send(error);
    //  } else {
    //    res.json(post);
    //  }
    //});
  };

  exports.addPost = function(req, res) {
    /* Create new post with data from request body */
    Post.add(req.body, function(error, post) {
      if (error) {
        res.send("Error adding new post");
      } else {
        res.json(post);
      }
    });

  };

  exports.editPost = function(req, res) {
    Post.edit(req.body, function(error, post) {
      if (error) {
        res.send("Error adding new post");
      } else {
        res.json(post);
      }
    });
  };

})();
