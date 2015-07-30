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

  module.exports = Paragraph;
})();
