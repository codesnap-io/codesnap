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
    return db.knex.raw(' \
      SELECT tags.title AS title \
      FROM post_tag_join, tags \
      WHERE post_tag_join.tag_id = tags.id')
  };


  Tag.getPopularTags = function() {
    return db.knex.raw(' \
      SELECT tags.id, tags.title \
      FROM post_tag_join, tags \
      WHERE post_tag_join.tag_id = tags.id \
      GROUP BY tags.title \
      ORDER BY COUNT(tags.title) DESC \
      LIMIT 30');
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
