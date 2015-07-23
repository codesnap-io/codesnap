(function() {
  'use strict';

  var db = require('../config/db');
  var Like = require('../config/schema').Like;

  /* If like exists, unlike, if like doesn't exist, add it */
  Like.toggle = function(userId, postId, callback) {
    new Like({
      user_id: userId,
      post_id: postId
    })
    .fetch()
    .then(function(like) {
      if (!like) {
        new Like({
          user_id: userId,
          post_id: postId
        })
        .save()
        .then(function() {
          callback();
        });
      } else {
        like.destroy()
        .then(function() {
          callback();
        });
      }
    });
  };

  Like.check = function(userId, postId, callback) {
    new Like({
      user_id: userId,
      post_id: postId
    })
    .fetch()
    .then(function(like) {
      if (!like) {
        callback(false);
      } else {
        callback(true);
      }
    });
  };

  module.exports = Like;
})();
