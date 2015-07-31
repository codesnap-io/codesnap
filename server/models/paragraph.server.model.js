(function() {
  'use strict';

  var db = require('../config/db');
  var Paragraph = require('../config/schema').Paragraph;

  /* If like exists, unlike, if like doesn't exist, add it */
  Paragraph.addOrEdit = function(paragraphNum, lineNum, postId, callback) {
    new Paragraph({'number': paragraphNum, 'line': lineNum, 'post_id': postId})
    .fetch()
    .then(function(paragraph) {
      if (!paragraph) {
        new Paragraph({'number': paragraphNum, 'line': lineNum, 'post_id': postId})
        .save()
        .then(function(paragraph) {
          callback(paragraph);
        });
      } else {
        callback(paragraph);
      }
    });
  };

  /* Returns a list of paragraphs for a given post */
  Paragraph.postParagraphs = function(postId) {
    return db.knex.raw(' \
         SELECT \
           id, \
           number, \
           line \
         FROM paragraphs \
         WHERE \
           post_id = ' + postId);
  };

  Paragraph.remove = function(paragraphId) {
    return db.knex('paragraphs').where('id', paragraphId)
      .del();
  };

  module.exports = Paragraph;

})();
