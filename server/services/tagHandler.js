(function(){
  'use strict';
  var PostTagJoin = require('../models/postTagJoin.server.model');
  var Tag = require('../models/tag.server.model');
  var FuzzySet = require('fuzzyset.js');

  exports.addTags = function(postId, postTags) {
    /* Get list of all existing tags from the database */
    Tag.getAll(function(error, tags) {
      if(error) {
        console.log("ERROR: CAN'T FETCH TAGS FOR USE IN TAG HANDLER");
      } else {

        /* Populate FuzzySet with list of all tags from database */
        var tagArray = new FuzzySet();
        for (var i = 0; i < tags.length; i ++) {
          tagArray.add(tags[i].tag_title);
        }

        /* Match each incoming post tag to an existing tag or create a new one */
        for (var j = 0; j < postTags.length; j++) {
          /* Set results equal to fuzzy serch results in order from best to worst match */
          var results = tagArray.get(postTags[j]);
          /* matchThreshold determines how strict the matching requirements are.  The lower this threshold, the more strict the match must be */
          var matchThreshold = 0.35; 

          /* Check to see if the first (best) result meets our matching standards.  If it does we create a new tag for the pos */
          if (results && results[0][0] >= matchThreshold) {

          } 
          /* If the result does not meet our matching standard, create a new tag */
          else {
            
          }
        

          // console.log("RESULT ", tagArray.get(postTags[i])[0] || null);
        }


      }
    });

  };


})();