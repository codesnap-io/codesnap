(function(){
  'use strict';
  var db = require('../config/db');
  var PostTagJoin = require('../config/schema').PostTagJoin;
  var Tag = require('./tag.server.model');

  PostTagJoin.createOrAdd = function(postId, tagTitle) {
    Tag.createOrSave(tagTitle, function(tag) {
      new PostTagJoin({post_id: postId, tag_id: tag.get('id')})
      .fetch()
      .then(function(join) {
        if (!join) {
          new PostTagJoin({post_id: postId, tag_id: tag.get('id')})
          .save();
        }
      });
    });
  };

  module.exports = PostTagJoin;
})();



