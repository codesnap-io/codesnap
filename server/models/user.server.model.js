(function(){
  'use strict';
  var db = require('../config/db');
  var User = require('../config/schema').User;

  User.profileInfo = function(userId, callback) {
    /* Create a user object which we call
    .fetch() on to search the database to see
    if that user already exists */
    new User({'id': userId})
    .fetch()
    /* .fetch() returns a promise so we call .then() */
    .then(function(user) {
      /* If the user doesn't exist, return error message. Otherwise return profile information */
      if (!user) {
        callback("Invalid user id.\n");
      } else {
        db.knex.raw(' \
          SELECT \
            users.id AS user_id, \
            posts.title AS post_title, \
            posts.url AS post_url, \
            users.name AS author \
          FROM posts, users \
          WHERE posts.user_id = users.id \
            AND users.id = ' + userId
        ).then(function(data) {
          callback(null, data[0]);
        });
      }
    });
  };

  User.remove = function(userId, callback) {
    /* Create a user object which we call
    .fetch() on to search the database to see
    if that user already exists */
    new User({'id': userId})
    .fetch()
    /* .fetch() returns a promise so we call .then() */
    .then(function(user) {
      /* If the user doesn't exist, return error message. Otherwise return profile information */
      if (!user) {
        callback("Invalid user id.\n");
      } else {
        db.knex('users').where('id', userId)
        .del()
        .then(function() {
          callback(null, user);
        });
      }
    });
  };



  module.exports = User;
})();
