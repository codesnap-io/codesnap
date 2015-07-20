(function() {
  'use strict';

  var db = require('../config/db');

  exports.getAllTitles = function() {
    return db.knex
      .select('title').from('posts');
    // .then(function(data) {
    //   var titles = data.map(function(title) {
    //     return title.title;
    //   });
    //   console.log("got titles: ", titles);
    //   return callback(titles);
    // });
  };

  exports.getAllAuthors = function() {
    return db.knex
      .distinct()
      .select('username').from('users');
    // .then(function(data) {
    //   var authors = data.map(function(author) {
    //     return author.username;
    //   });
    //   console.log("got authors: ", authors);
    //   return callback(authors);
    // });
  };

})();
