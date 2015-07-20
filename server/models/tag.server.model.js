(function() {
  'use strict';
  var db = require('../config/db');
  var Tag = require('../config/schema').Tag;

  Tag.getAll = function(callback) {
    db.knex.raw(' SELECT title AS tag_title FROM tags')
      .then(function(data, error) {
        callback(error, data[0]);
      });
  };

  Tag.getAllPromise = function() {
    return db.knex.select('title').from('tags');
  };

  Tag.createOrSave = function(tagTitle, callback) {
    new Tag({'title': tagTitle})
    .fetch()
    .then(function(tag) {
      if (!tag) {
        new Tag({'title': tagTitle})
        .save()
        .then(function(tag) {
          callback(tag);
        });
      } else {
        callback(tag);
      }
    });
  };

  module.exports = Tag;
})();
