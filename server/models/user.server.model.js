(function () {
  'use strict';
  var db = require('../config/db');
  var User = require('../config/schema').User;

  User.profileInfo = function (userId, callback) {
    /* Create a user object which we call
    .fetch() on to search the database to see
    if that user already exists */
    new User({
      'id': userId
    })
      .fetch()
    /* .fetch() returns a promise so we call .then() */
    .then(function (user) {
      /* If the user doesn't exist, return error message. Otherwise return profile information */
      if (!user) {
        callback("Invalid user id.\n");
      } else {
        var returnData = {};
        returnData.name = user.get('name');
        returnData.username = user.get('username');
        returnData.id = user.get('id');

        console.log(user);
        db.knex.raw(' \
          SELECT \
            posts.title AS post_title, \
            posts.url AS post_url \
          FROM posts, users \
          WHERE posts.user_id = users.id \
            AND users.id = ' + userId).then(function (data) {
          returnData.posts = data[0];
          callback(null, returnData);
        });
      }
    });
  };



  User.findByGithubId = function(githubId, callback) {
    new User({'github_id': githubId})
    .fetch()
    .then(function(user) {
      if (!user) {
        callback("Invalid github id");
      } else {
        callback(null, user);
      }
    });
  };


  User.remove = function(userId, callback) {
    /* Create a user object which we call
    .fetch() on to search the database to see
    if that user already exists */
    new User({
      'id': userId
    })
      .fetch()
    /* .fetch() returns a promise so we call .then() */
    .then(function (user) {
      /* If the user doesn't exist, return error message. Otherwise return profile information */
      if (!user) {
        callback("Invalid user id.\n");
      } else {
        db.knex('users').where('id', userId)
          .del()
          .then(function () {
            callback(null, user);
          });
      }
    });
  };

  User.find = function (githubId, callback) {
    new User({
      'github_id': githubId
    })
      .fetch()
      .then(function (user) {
        if (!user) {
          callback("Invalid Github id");
        } else {
          callback(null, user);
        }
      });
  };

  module.exports = User;
})();
