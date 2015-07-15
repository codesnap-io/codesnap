(function () {
  'use strict';
  var db = require('../config/db');
  var Post = require('../config/schema').Post;

  Post.add = function (postData, callback) {
    new Post(postData)
      .save()
      .then(function (post) {
        if (!post) {
          callback("Invalid post data");
        } else {
          callback(null, post);
        }
      });
  };

  Post.edit = function (postData, callback) {
    new Post({
      'id': postData.id
    })
      .fetch()
      .then(function (post) {
        /* If post doesn't exist, return error message */
        if (!post) {
          callback("Invalid post id");
        } else {
          /* If post exists, update all of its attributes with the data passed in from the POST request */
          for (var key in postData) {
            /* Check to make sure that the attribute we are trying to change already exists for the post.  If it doesn't, we know that it is an invalid column header and we don't want to add it.  */
            if (post.get(key) !== undefined) {
              post.set(key, postData[key]);
            }
          }
          post.save();
          callback(null, post.attributes);
        }
      });
  };

  Post.postInfo = function (postId, callback) {
    /* Create a post object which we call
    .fetch() on to search the database to see
    if that post already exists */
    new Post({
      'id': postId
    })
      .fetch()
    /* .fetch() returns a promise so we call .then() */
    .then(function (post) {
      /* If the post doesn't exist, return error message. Otherwise return profile information */
      if (!post) {
        callback("Invalid post id.\n");
      } else {
        console.log(postId);
        db.knex.raw(' \
          SELECT \
            posts.id AS post_id, \
            posts.title AS post_title, \
            posts.url AS post_url, \
            users.name AS author \
          FROM posts, users \
          WHERE posts.user_id = users.id \
          AND posts.id = ' + postId)
        .then(function (data) {
          console.log(data[0]);
          callback(null, data[0]);
        });
      }
    });
  };

  Post.getAllPosts = function (callback, options) {
    db.knex.raw(' \
      SELECT \
        posts.id AS post_id, \
        posts.title AS post_title, \
        posts.url AS post_url, \
        users.name AS author \
      FROM posts, users \
      WHERE posts.user_id = users.id')
    .then(function (data) {
      callback(null, data[0]);
    });
  };

  module.exports = Post;
})();
