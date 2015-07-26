(function() {
  'use strict';
  var db = require('../config/db');
  var Tag = require('../config/schema').Tag;

  Tag.getAll = function() {
    return db.knex.raw(' \
      SELECT tags.id, tags.title \
      FROM posts, post_tag_join, tags \
      WHERE posts.id = post_tag_join.post_id \
        AND post_tag_join.tag_id = tags.id \
      GROUP BY tags.title \
      HAVING SUM(posts.published) > 0');
  };

    Tag.tagList = function() {
    return db.knex.raw(' \
      SELECT tags.id, tags.title \
      FROM tags');
  };

  Tag.getPopularTags = function() {
    return db.knex.raw(' \
      SELECT tags.id, tags.title \
      FROM posts, post_tag_join, tags \
      WHERE posts.id = post_tag_join.post_id \
        AND post_tag_join.tag_id = tags.id \
      GROUP BY tags.title \
      HAVING SUM(posts.published) > 0 \
      ORDER BY COUNT(tags.title) DESC');
  };

  Tag.getUserTags = function(username) {
    return db.knex.raw(' \
      SELECT tags.id, tags.title \
      FROM posts, post_tag_join, tags, users \
      WHERE users.id = posts.user_id \
        AND posts.id = post_tag_join.post_id \
        AND post_tag_join.tag_id = tags.id \
        AND users.username = "' + username + '" \
      GROUP BY tags.title \
      HAVING SUM(posts.published) > 0');
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
