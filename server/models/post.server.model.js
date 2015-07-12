(function(){
  'use strict';
  var db = require('../config/db');
  var Post = require('../config/schema').Post;

  Post.postInfo = function(postId, callback) {
    /* Create a post object which we call
    .fetch() on to search the database to see
    if that post already exists */
    new Post({'id': postId})
    .fetch()
    /* .fetch() returns a promise so we call .then() */
    .then(function(post) {
      /* If the post doesn't exist, return error message. Otherwise return profile information */
      if (!post) {
        callback("Invalid post id.\n");
      } else {
        
        db.knex.raw(' \
          SELECT \
            posts.id AS post_id, \
            posts.title AS post_title, \
            posts.url AS post_url, \
            users.name AS author \
          FROM posts, users \
          WHERE posts.user_id = users.id \
            AND posts.id = ' + postId
        ).then(function(data) {
          callback(null, data[0]);
        });
      }
    });
  };

  module.exports = Post;
})();