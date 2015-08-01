(function() {
  'use strict';
  var db = require('../config/db');
  var Post = require('../config/schema').Post;
  var Comment = require('../models/comment.server.model');


  Post.add = function(postData, callback) {
    new Post(postData)
      .save()
      .then(function(post) {
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
      .then(function(post) {
        /* If the user doesn't exist, return error message. Otherwise return profile information */
        if (!post) {
          callback("Invalid post url.\n");
        } else {
          db.knex('posts').where('url', postUrl)
            .del()
            .then(function() {
              callback(null, post);
            });
        }
      });
  };

  Post.modify = function(postData, callback) {
    new Post({
        'url': postData.url
      })
      .fetch()
      .then(function(post) {
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
          callback(null, post);
        }
      });
  };

  Post.getPostByUrl = function(postUrl) {
    var post = new Post({
      'url': postUrl
    });
    return post.fetch();
  };

  Post.postInfo = function(postId, callback) {
    new Post({
        'id': postId
      })
      .fetch()
      .then(function(post) {
        if (!post) {
          callback("Invalid post id.");
        } else {
          db.knex.raw(' \
          SELECT \
            posts.id AS post_id, \
            posts.title AS post_title, \
            posts.url AS post_url, \
            posts.file AS file, \
            posts.created_at AS created_date, \
            COUNT(likes.id) AS likes, \
            COUNT(views.post_id) AS post_views, \
            users.name AS author, \
            users.username AS username, \
            users.profile_photo_url AS profile_photo_url \
          FROM \
            users INNER JOIN posts ON users.id = posts.user_id \
            LEFT JOIN likes ON posts.id = likes.post_id \
            LEFT JOIN views ON posts.id = views.post_id \
          WHERE posts.id = ' + postId)
            .then(function(data) {
              var postData = data[0][0];
              if (!postData) {
                callback("Invalid post id.");
              } else {
                db.knex.raw(' \
                  SELECT \
                  tags.title AS title, \
                  tags.id AS id \
                  FROM posts, tags, post_tag_join \
                  WHERE posts.id = post_tag_join.post_id \
                    AND post_tag_join.tag_id = tags.id \
                    AND posts.published = true \
                    AND posts.id = ' + postId)
                  .then(function(data) {
                    postData.tags = data[0];
                      Comment.postComments(postId, function(comments) {
                        postData.comments = comments;
                        postData.commentCount = 0;
                        comments.forEach(function(paragraph) {
                          postData.commentCount += paragraph.comments.length;
                        });
                        callback(null, postData);
                      });
                  });
              }
            });
        }
      });
  };

  /* Gets all titles based on what user types into the search box.  */
  Post.getTitlesByQuery = function(query, callback) {
    db.knex.select('posts.id AS post_id', 'posts.title AS post_title', 'posts.published AS published',
        'users.name AS author', 'users.profile_photo_url AS profile_photo_url')
      .from('posts').where('posts.title', 'like', '%' + query + '%')
      .andWhere('published', true).leftOuterJoin('users', 'posts.user_id', 'users.id')
      .then(function(data) {
        callback(null, data);
      });
  };

  /* Returns top posts containing a particular tag.  This is used in the tag search results page */
  Post.getPostsByTag = function(tag, callback) {
    db.knex.raw('\
      SELECT \
        posts.id AS post_id, \
        posts.title AS post_title, \
        posts.url AS post_url, \
        posts.created_at AS created_date, \
        posts.summary AS summary, \
        users.name AS author, \
        users.username AS username, \
        posts.published AS published, \
        COUNT(likes.id) AS likes, \
        COUNT(views.post_id) AS views, \
        users.profile_photo_url AS profile_photo_url \
      FROM \
        users INNER JOIN posts ON users.id = posts.user_id \
        INNER JOIN post_tag_join ON posts.id = post_tag_join.post_id \
        INNER JOIN tags ON post_tag_join.tag_id = tags.id \
        LEFT JOIN likes ON posts.id = likes.post_id \
        LEFT JOIN views ON posts.id = views.post_id \
      WHERE \
        posts.published = true AND \
        tags.title = "' + tag + '" \
      GROUP BY posts.id \
       ORDER BY likes DESC, created_date DESC \
      LIMIT 50')
      .then(function(data) {
        callback(null, data[0]);
      });
  };

  /* Takes a post and returns 5 posts that were created earlier than it.  This is used for infinite scrolling on the home page */
  Post.getMoreRecentPosts = function(lastPostId) {
      return db.knex.raw('\
        SELECT \
          posts.id AS post_id, \
          posts.title AS post_title, \
          posts.url AS post_url, \
          posts.created_at AS created_date, \
          posts.summary AS summary, \
          posts.published AS published, \
          COUNT(likes.id) AS likes, \
          COUNT(views.post_id) AS views, \
          users.name AS author, \
          users.username AS username, \
          users.profile_photo_url AS profile_photo_url \
        FROM \
        users INNER JOIN posts ON users.id = posts.user_id \
        LEFT JOIN likes ON posts.id = likes.post_id \
        LEFT JOIN views ON posts.id = views.post_id \
        HAVING posts.id < ' + lastPostId + ' \
        ORDER BY posts.id DESC \
        LIMIT 5');
  };


  // less likes than last like count
  // equal like AND id is less than last id


  Post.getMoreTopPosts = function(lastPostId, lastLikeCount) {
      return db.knex.raw('\
        SELECT \
          posts.id AS post_id, \
          posts.title AS post_title, \
          posts.url AS post_url, \
          posts.created_at AS created_date, \
          posts.summary AS summary, \
          posts.published AS published, \
          COUNT(likes.id) AS likes, \
          COUNT(views.post_id) AS views, \
          users.name AS author, \
          users.username AS username, \
          users.profile_photo_url AS profile_photo_url \
        FROM \
        users INNER JOIN posts ON users.id = posts.user_id \
        LEFT JOIN likes ON posts.id = likes.post_id \
        LEFT JOIN views ON posts.id = views.post_id \
        GROUP BY posts.id \
        HAVING likes < ' + lastLikeCount + ' OR (likes = '+ lastLikeCount +' AND posts.id < "' + lastPostId + '")  \
        ORDER BY likes DESC, posts.id DESC\
        LIMIT 5');
  };

  /* For profile page */
  Post.recentUserPosts = function(username) {
    return db.knex.raw('\
      SELECT \
        posts.id AS post_id, \
        posts.title AS post_title, \
        posts.url AS post_url, \
        posts.created_at AS created_date, \
        posts.summary AS summary, \
        posts.published AS published, \
        posts.file AS file, \
        COUNT(likes.id) AS likes, \
        COUNT(views.post_id) AS views, \
        users.name AS author, \
        users.username AS username, \
        users.profile_photo_url AS profile_photo_url \
      FROM \
      users INNER JOIN posts ON users.id = posts.user_id \
      LEFT JOIN likes ON posts.id = likes.post_id \
      LEFT JOIN views ON posts.id = views.post_id \
      WHERE \
        users.username = "' + username + '" \
      GROUP BY posts.id \
      ORDER BY posts.id DESC \
      LIMIT 20');
  };

  /* For profile page */
  Post.topUserPosts = function(username) {
    return db.knex.raw('\
      SELECT \
        posts.id AS post_id, \
        posts.title AS post_title, \
        posts.url AS post_url, \
        posts.created_at AS created_date, \
        posts.summary AS summary, \
        posts.published AS published, \
        COUNT(likes.id) AS likes, \
        COUNT(views.post_id) AS views, \
        users.name AS author, \
        users.username AS username, \
        users.profile_photo_url AS profile_photo_url \
      FROM \
      users INNER JOIN posts ON users.id = posts.user_id \
      LEFT JOIN likes ON posts.id = likes.post_id \
      LEFT JOIN views ON posts.id = views.post_id \
      WHERE \
        users.username = "' + username + '" \
      GROUP BY posts.id \
      ORDER BY likes DESC \
      LIMIT 20');
  };

  /* Returns most recent posts from all posts.  This is used on the home page. */
  Post.getRecentPosts = function() {
    return db.knex.raw(' \
      SELECT \
        posts.id AS post_id, \
        posts.title AS post_title, \
        posts.url AS post_url, \
        posts.created_at AS created_date, \
        posts.summary AS summary, \
        posts.published AS published, \
        COUNT(views.post_id) AS views, \
        COUNT(likes.id) AS likes, \
        users.name AS author, \
        users.username AS username, \
        users.profile_photo_url AS profile_photo_url \
      FROM \
      users INNER JOIN posts ON users.id = posts.user_id \
      LEFT JOIN likes ON posts.id = likes.post_id \
      LEFT JOIN views ON posts.id = views.post_id \
      WHERE posts.published = true \
      GROUP BY posts.id \
      ORDER BY created_date DESC, likes DESC \
      LIMIT 10');
  };


  /* Returns top posts from all posts.  This is used on the home page. */
  Post.getTopPosts = function() {
    return db.knex.raw('\
      SELECT \
        posts.id AS post_id, \
        posts.title AS post_title, \
        posts.url AS post_url, \
        posts.created_at AS created_date, \
        posts.summary AS summary, \
        posts.published AS published, \
        COUNT(views.post_id) AS views, \
        COUNT(likes.id) AS likes, \
        users.name AS author, \
        users.username AS username, \
        users.profile_photo_url AS profile_photo_url \
      FROM \
      users INNER JOIN posts ON users.id = posts.user_id \
      LEFT JOIN likes ON posts.id = likes.post_id \
      LEFT JOIN views ON posts.id = views.post_id \
      WHERE posts.published = true \
      GROUP BY posts.id \
      ORDER BY likes DESC, posts.id DESC \
      LIMIT 10');
  };

  module.exports = Post;
})();
