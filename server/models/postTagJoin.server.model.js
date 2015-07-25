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

  /* Delete all post_tag_join rows for a given post */
  PostTagJoin.deletePostTagJoin = function(postId, callback) {
    db.knex('post_tag_join').where({
      post_id: postId
    }).select('id')
    .then(function(joins) {
      for (var i = 0; i < joins.length; i++) { 
        new PostTagJoin({id: joins[i].id})
        .fetch()
        .then(function(join) {
          join.destroy();
        });
      }
      callback();
    });
  };
  
  module.exports = PostTagJoin;
})();



