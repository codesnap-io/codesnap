(function(){
  'use strict';
  var PostTagJoin = require('../models/postTagJoin.server.model');
  var Tag = require('../models/tag.server.model');
  var FuzzySet = require('fuzzyset.js');

  /* Takes an array of tags and adds the associated tag in the database of creates a new tag */
  exports.addTags = function(postId, postTags) {
    /* matchThreshold determines how strict the matching requirements are.  The lower this threshold, the more strict the match must be */
    var matchThreshold = 0.40;

    /* Get list of all existing tags from the database */
    Tag.getAll(function(error, tags) {
      if(error) {
        console.log("ERROR: CAN'T FETCH TAGS FOR USE IN TAG HANDLER");
      } else {

        /* Populate FuzzySet with list of all tags from database */
        var tagArray = new FuzzySet();
        for (var i = 0; i < tags.length; i++) {
          tagArray.add(tags[i].tag_title);
        }

        /* Match each incoming post tag to an existing tag or create a new one */
        for (var j = 0; j < postTags.length; j++) {
          /* Set results equal to fuzzy serch results in order from best to worst match */
          var results = tagArray.get(postTags[j]);

          /* Check to see if the first (best) result meets our matching standards.  If it does we create a new PostTagJoin with matching tag*/
          if (results && results[0][0] >= matchThreshold) {
            PostTagJoin.createOrAdd(postId, results[0][1]);
          }
          /* If the result does not meet our matching standard, create new PostTagJoin with new tag */
          else {
            PostTagJoin.createOrAdd(postId, postTags[j]);
          }
        }
      }
    });
  };

  /* Looks for matches between existing tags and words in a new post */
  // exports.findTags = function(postId, words) {
  //   /* matchThreshold determines how strict the matching requirements are.  The lower this threshold, the more strict the match must be */
  //   var matchThreshold = 0.70;
  //   console.log("INSIDE FIND TAGS");

  //   Tag.getAll(function(error, tags) {
  //     if(error) {
  //       console.log("ERROR: CAN'T FETCH TAGS FOR USE IN TAG HANDLER");
  //     } else {
  //       /* Populate FuzzySet with list of all tags from database */
  //       var tagArray = new FuzzySet();
  //       for (var i = 0; i < tags.length; i++) {
  //         tagArray.add(tags[i].tag_title);
  //       }
  //       for (var j = 0; j < words.length; j++) {
  //         var results = tagArray.get(words[j]);
  //         if (results) {
  //           console.log(words[j]);
  //           console.log("RESULTS: ");
  //           console.log(results);
  //           for (var k = 0; k < results.length; k++) {
  //             results[k][0] > matchThreshold && console.log(results[k]);
  //           }
  //           console.log("-----------");
  //         }
  //       }
  //     }
  //   });
  // };


})();