(function() {
  'use strict';
  var db = require('../config/db');
  var Tag = require('../config/schema').Tag;

  /* Here are a list of background patterns for title */
  var patterns = ["half-rombes", "arrows", "zigzag", "weave", "argyle", "waves", "cross", "brady-bunch", "microbial-mat", "upholstery", "steps", "shippo", "stars", "japanese-cube", "seigaiha", "bricks", "polka-dot", "tartan", "madras", "blueprint", "tablecloth", "cicada-stripes", "diagonal-stripes", "vertical-stripes", "horizontal-stripes"];

  /* Randomly assign a background pattern to tag */
  var randomPattern = function() {
    return patterns[Math.floor(Math.random() * patterns.length)];
  };

  Tag.getAll = function() {
    return db.knex.raw(' \
      SELECT tags.id, tags.title, tags.pattern \
      FROM posts, post_tag_join, tags \
      WHERE posts.id = post_tag_join.post_id \
        AND post_tag_join.tag_id = tags.id \
      GROUP BY tags.title \
      HAVING SUM(posts.published) > 0');
  };

  Tag.getPattern = function(tagName) {
    return db.knex.raw(' \
      SELECT tags.pattern \
      FROM tags \
      WHERE tags.title = "' + tagName + '"');
  };

  Tag.tagList = function() {
  return db.knex.raw(' \
    SELECT tags.id, tags.title, tags.pattern \
    FROM tags');
  };

  Tag.getPopularTags = function() {
    return db.knex.raw(' \
      SELECT tags.id, tags.title, tags.pattern \
      FROM posts, post_tag_join, tags \
      WHERE posts.id = post_tag_join.post_id \
        AND post_tag_join.tag_id = tags.id \
      GROUP BY tags.title \
      HAVING SUM(posts.published) > 0 \
      ORDER BY COUNT(tags.title) DESC');
  };

  Tag.getUserTags = function(username) {
    return db.knex.raw(' \
      SELECT tags.id, tags.title, tags.pattern \
      FROM posts, post_tag_join, tags, users \
      WHERE users.id = posts.user_id \
        AND posts.id = post_tag_join.post_id \
        AND post_tag_join.tag_id = tags.id \
        AND users.username = "' + username + '" \
      GROUP BY tags.title \
      HAVING SUM(posts.published) > 0');
  };

  Tag.createOrSave = function(tagTitle, callback) {
    // console.log(tagTitle);
    new Tag({'title': tagTitle})
    .fetch()
    .then(function(tag) {
      // console.log("A")
      if (!tag) {
        // console.log("B")
        // console.log("TAG DOESN'T EXIST");
        new Tag({'title': tagTitle, 'pattern': randomPattern()})
        .save()
        .then(function(tag) {
          callback(tag);
        });
      } else {
        // console.log("C");
        // console.log("TAG EXISTS");
        callback(tag);
      }
    });
  };

  //called by search controller
  Tag.getTagsByQuery = function(query, callback) {
    db.knex.raw(' \
      SELECT tags.id, tags.title \
      FROM posts, post_tag_join, tags \
      WHERE posts.id = post_tag_join.post_id \
        AND post_tag_join.tag_id = tags.id \
        AND tags.title LIKE "%' + query + '%" \
      GROUP BY tags.title \
      HAVING SUM(posts.published) > 0')
      .then(function(data) {
        callback(null, data[0]);
      });
  };

  module.exports = Tag;
})();
