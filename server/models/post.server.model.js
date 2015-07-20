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

  Post.remove = function(postUrl, callback) {
    /* Create a post object which we call
     .fetch() on to search the database to see
     if that post already exists */
    new Post({
      'url': postUrl
    })
        .fetch()
      /* .fetch() returns a promise so we call .then() */
        .then(function (post) {
          /* If the user doesn't exist, return error message. Otherwise return profile information */
          if (!post) {
            callback("Invalid post url.\n");
          } else {
            db.knex('posts').where('url', postUrl)
                .del()
                .then(function () {
                  callback(null, post);
                });
          }
        });
  };

  Post.modify = function (postData, callback) {
    new Post({
      'url': postData.url
    })
      .fetch()
      .then(function (post) {
        /* If post doesn't exist, return error message */
        if (!post) {
          callback("Invalid post url");
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
        db.knex.raw(' \
          SELECT \
            posts.id AS post_id, \
            posts.title AS post_title, \
            posts.url AS post_url, \
            posts.file AS file, \
            users.name AS author, \
            users.username AS username, \
            users.profile_photo_url AS profile_photo_url \
          FROM posts, users \
          WHERE posts.user_id = users.id \
            AND posts.id = ' + postId)
        .then(function (data) {
          var postData = data[0][0];

          db.knex.raw(' \
            SELECT \
            tags.title AS title, \
            tags.id AS id \
            FROM posts, tags, post_tag_join \
            WHERE posts.id = post_tag_join.post_id \
              AND post_tag_join.tag_id = tags.id \
              AND posts.id = ' + postId)
          .then(function(data) {
            postData.tags = data[0];
            callback(null, postData);

          });
        });
      }
    });
  };

  Post.getPostsOnQuery = function (query, queryType, callback) {
    db.knex.select('posts.id AS post_id', 'posts.title AS post_title',
    'posts.url AS post_url', 'users.name AS author', 'users.profile_photo_url AS profile_photo_url')
    .from('posts').where(queryType, 'like', '%' + query + '%').leftOuterJoin('users', 'posts.user_id', 'users.id')
    .then(function(data) {
      callback(null, data);
    });
  };

  Post.getAllPosts = function (callback, options) {
    db.knex.raw(' \
      SELECT \
        posts.id AS post_id, \
        posts.title AS post_title, \
        posts.url AS post_url, \
        users.name AS author, \
        users.profile_photo_url AS profile_photo_url \
      FROM posts, users \
      WHERE posts.user_id = users.id')
    .then(function (data) {
      callback(null, data[0]);
    });
  };

  module.exports = Post;
})();
