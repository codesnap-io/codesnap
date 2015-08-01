(function() {
  'use strict';

  var db = require('../config/db');
  var Paragraph = require('../config/schema').Paragraph;

  /* If like exists, unlike, if like doesn't exist, add it */
  Paragraph.add = function(paragraphNum, lineNum, postId, callback) {
    new Paragraph({'number': paragraphNum, 'line': lineNum, 'post_id': postId})
    .save()
    .then(function(paragraph) {
      callback(paragraph);
    });
  };

  Paragraph.edit = function(paragraph_id, newParagraphNum, newLineNum) {
    new Paragraph({'id': paragraph_id})
    .fetch()
    .then(function(paragraph) {
      paragraph.set('number', newParagraphNum);
      paragraph.set('line', newLineNum);
      paragraph.save();
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
