(function(){
  'use strict';
  var PostTagJoin = require('../models/postTagJoin.server.model');
  var Tag = require('../models/tag.server.model');
  var FuzzySet = require('fuzzyset.js');

  /* Takes an array of tags and adds the associated tag in the database of creates a new tag */
  exports.addTags = function(postId, postTags) {
    /* matchThreshold determines how strict the matching requirements are.  The higher this threshold, the more strict the match must be */
    var matchThreshold = 0.85;
    /* Get list of all existing tags from the database */
    Tag.tagList()
    .then(function(data) {
      /* Set tags equal to query results */
      var tags = data[0];

      /* Populate FuzzySet with list of all tags from database */
      var tagArray = new FuzzySet();
      for (var i = 0; i < tags.length; i++) {
        tagArray.add(tags[i].title);
      }

      /* Match each incoming post tag to an existing tag or create a new one */
      var addTag = function() {
        if (postTags.length > 0) {
          var tag = postTags.pop();
          /* Set results equal to fuzzy serch results in order from best to worst match */
          var results = tagArray.get(tag);

          /* Check to see if the first (best) result meets our matching standards.  If it does we create a new PostTagJoin with matching tag*/
          if (results && results[0][0] >= matchThreshold) {
            PostTagJoin.createOrAdd(postId, results[0][1], function(join) {
              addTag();
            });
          }
          /* If the result does not meet our matching standard, create new PostTagJoin with new tag */
          else {
            PostTagJoin.createOrAdd(postId, tag, function(join) {
              addTag();
            });
          }
        }
      };

      addTag();
    });
  };

  exports.updateTags = function(postId, postTags) {
    PostTagJoin.deletePostTagJoin(postId, function() {
      exports.addTags(postId, postTags);
    });
  };

})();
