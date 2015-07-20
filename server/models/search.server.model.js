(function() {
  'use strict';

  var db = require('../config/db');

  exports.getAllTitles = function(callback) {
    db.knex
      .select('title').from('posts')
      .then(function(data) {
        console.log(data)
        var titles = data.map(function(title) {
          return title.title;
        })
        console.log("got titles: ", titles);
        return callback(titles);
      });
  };

  exports.getAllAuthors = function(callback) {
    db.knex
      .distinct()
      .select('name').from('users')
      .then(function(authors) {
        console.log("got authors: ", authors);
        return callback(authors);
      });
  };

})();
