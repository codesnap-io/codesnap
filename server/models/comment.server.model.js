(function(){
  'use strict';

  var db = require('../config/db');
  var Comment = require('../config/schema').Comment;

  Comment.add = function(commentData) {
    return new Comment(commentData).save();
  };

  /* This function creates a formatted array of post comments.  This function is called in the Post model */
  Comment.postComments = function(postId, callback) {
   db.knex.raw(' \
        SELECT \
          comments.id AS id, \
          comments.text AS comment, \
          users.name AS authorName, \
          users.profile_photo_url AS authorAvatarUrl, \
          comments.paragraph AS sectionId, \
          users.username AS authorUsername \
        FROM comments, users \
        WHERE \
          comments.user_id = users.id AND \
          comments.post_id = ' + postId)
   .then(function(results) {
      var data = results[0] || [];

      /* Convert the raw query results into an object where each paragraph (sectionId) is
      a key and the value is the final object we want to pass in request to the client.
      NOTE: we must format the data in a very specific way (and with specific naming conventions)
      to match the required format of side-comments.js library */
      var commentObj = {};
      for (var i = 0; i < data.length; i++) {
        if (!commentObj.hasOwnProperty(data[i].sectionId)) {
          commentObj[data[i].sectionId.toString()] = {
            sectionId: data[i].sectionId.toString(),
            comments: [{
              id: data[i].id,
              authorAvatarUrl: data[i].authorAvatarUrl,
              authorName: data[i].authorName,
              authorUsername: data[i].authorUsername,
              comment: data[i].comment
            }]
          };
        } else {
          commentObj[data[i].sectionId.toString()].comments.push({
            id: data[i].id,
            authorAvatarUrl: data[i].authorAvatarUrl,
            authorName: data[i].authorName,
            authorUsername: data[i].authorUsername,
            comment: data[i].comment
          });
        }
      }

      /* Convert object into the final array we will pass into client */
      var comments = [];
      for (var paragraph in commentObj) {
        comments.push(commentObj[paragraph]);
      }

      callback(comments);
     });
  };

  Comment.remove = function(commentId) {
    return db.knex('comments').where('id', commentId)
      .del();
  };


  module.exports = Comment;

})();
