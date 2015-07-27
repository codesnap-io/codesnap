(function() {
  'use strict';
  var db = require('../config/db');
  var Post = require('../config/schema').Post;

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

  Post.postInfo = function(postId, callback) {
    /* Create a post object which we call
    .fetch() on to search the database to see
    if that post already exists */
    new Post({
        'id': postId
      })
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
            posts.file AS file, \
            posts.created_at AS created_date, \
            posts.views AS post_views, \
            users.name AS author, \
            users.username AS username, \
            users.profile_photo_url AS profile_photo_url \
          FROM posts, users \
          WHERE posts.user_id = users.id \
            AND posts.published = true \
            AND posts.id = ' + postId)
            .then(function(data) {
              var postData = data[0][0];

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
                  db.knex('likes').where({
                      post_id: postId
                    }).count()
                    .then(function(countData) {
                      postData.likes = countData[0]['count(*)'];
                      callback(null, postData);
                    });

                });
            });
        }
      });
  };

  Post.getPostsOnQuery = function(query, queryType, callback) {
    if (queryType === 'tag') {
      // get all posts that have a given tag
      db.knex.raw(' \
        SELECT \
          posts.id AS post_id, \
          posts.title AS post_title, \
          posts.url AS post_url, \
          posts.created_at AS created_date, \
          posts.summary AS summary, \
          users.name AS author, \
          users.profile_photo_url AS profile_photo_url \
        FROM posts, users, tags, post_tag_join \
        WHERE users.id = posts.user_id \
          AND posts.id = post_tag_join.post_id \
          AND post_tag_join.tag_id = tags.id \
          AND posts.published = true \
          AND tags.title = "' + query + '" GROUP BY posts.id')
        .then(function(data) {
          callback(null, data[0]);
        });

    } else {
      db.knex.select('posts.id AS post_id', 'posts.title AS post_title', 'posts.summary AS summary',
          'posts.url AS post_url', 'users.name AS author', 'users.profile_photo_url AS profile_photo_url')
        .from('posts').where(queryType, 'like', '%' + query + '%').leftOuterJoin('users', 'posts.user_id', 'users.id')
        .then(function(data) {
          callback(null, data);
        });
    }

  };

  Post.getAllPosts = function(callback, options) {
    db.knex.raw(' \
      SELECT \
        posts.id AS post_id, \
        posts.title AS post_title, \
        posts.url AS post_url, \
        posts.created_at AS created_date, \
        posts.summary AS summary, \
        users.name AS author, \
        users.username AS username, \
        users.profile_photo_url AS profile_photo_url \
      FROM posts, users \
      WHERE posts.user_id = users.id \
      AND posts.published = true')
      .then(function(data) {
        callback(null, data[0]);
      });
  };

  Post.getRecentPosts = function() {
    return db.knex.raw(' \
      SELECT \
        posts.id AS post_id, \
        posts.title AS post_title, \
        posts.url AS post_url, \
        posts.created_at AS created_date, \
        posts.summary AS summary, \
        users.name AS author, \
        users.username AS username, \
        users.profile_photo_url AS profile_photo_url \
      FROM posts, users \
      WHERE posts.user_id = users.id \
      AND posts.published = true \
      ORDER BY created_date DESC \
      LIMIT 20');
  };

  Post.getTopPosts = function() {
    return db.knex.raw(' \
      SELECT \
        posts.id AS post_id, \
        posts.title AS post_title, \
        posts.url AS post_url, \
        posts.created_at AS created_date, \
        posts.summary AS summary, \
        users.name AS author, \
        users.username AS username, \
        users.profile_photo_url AS profile_photo_url \
      FROM posts, users, likes \
      WHERE posts.user_id = users.id \
        AND posts.id = likes.post_id \
        AND posts.published = true \
      GROUP BY post_id \
      ORDER BY COUNT(likes.post_id) DESC \
      LIMIT 20');
  };

  //takes a post and returns 20 posts that were created earlier than it
  Post.getMorePosts = function(lastPost) {
    var rawDate = JSON.parse(lastPost).created_date;
    var lastDate = rawDate.replace(/T/, ' ').replace('.000', '').replace(/Z/, '');
    return db.knex.raw(' \
      SELECT \
        posts.id AS post_id, \
        posts.title AS post_title, \
        posts.url AS post_url, \
        posts.created_at AS created_date, \
        posts.summary AS summary, \
        users.name AS author, \
        users.profile_photo_url AS profile_photo_url \
      FROM posts, users \
      WHERE posts.user_id = users.id \
        AND posts.created_at < "'+lastDate+'" \
        AND posts.published = true \
      ORDER BY created_date DESC \
      LIMIT 20');
  };

  // BROKEN, DO NOT USE -->
  /*
  get posts with options obj: {
    select: "id, title",
    from: "posts",
    where: function() {
      this.where('id', 1)
        .orWhere('id', '>', 10)
        .orWhere({
          title: 'the worst blog ever'
        })
    },
    groupBy: "id",
    orderBy: "'id', 'desc'",
    limit: 10,
    offset: 10,
    //feel free to add more, just remember to add them below as well
  }
  */

  // Post.getPosts = function(options) {
  //   return db.knex
  //     .distinct()
  //     .select(options.select || null)
  //     .from(options.from || null)
  //     .where(options.where || null)
  //     .groupBy(options.groupBy || null)
  //     .orderBy(options.orderBy || null)
  //     .limit(options.limit || null)
  //     .offset(options.offset || null)
  // }

  Post.getAllTitles = function() {
    return db.knex
      .distinct()
      .select('title', 'id').from('posts').distinct('id');
  };

  Post.getAllAuthors = function() {
    return db.knex
      .distinct()
      .select('name', 'username').from('users').distinct('name');
  };

  Post.addView = function(postId) {
    new Post({
        id: postId
      })
      .fetch()
      .then(function(post) {
        post.set('views', post.get('views') + 1);
        post.save();
      });
  };

  module.exports = Post;
})();
