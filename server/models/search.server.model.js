(function() {
  'use strict';

  var db = require('../config/db');

  exports.getAllTitles = function() {
    return db.knex
      .select('title').from('posts');
  };

  exports.getAllAuthors = function() {
    return db.knex
      .distinct()
      .select('username').from('users');
  };

})();
