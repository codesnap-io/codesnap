(function() {
  'use strict';
  var Fuse = require('../services/fuse.js');
  var search = require('../models/search.server.model');
  var tag = require('../models/tag.server.model');
  var Promise = require('bluebird');

  var options = {
    caseSensitive: false,
    includeScore: false,
    shouldSort: true,
    /* This variable determines the search sensitivity */
    threshold: 0,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    keys: ["name"]
  };

  var list = [{
    "name": "Angular"
  }, {
    "name": "angular.js"
  }, {
    "name": "angularjs"
  }, {
    "name": "bngularjs"
  }, {
    "name": "bsgular"
  }, {
    "name": "Angulr"
  }, {
    "name": "Angular.j"
  }, {
    "name": "Angular"
  }];

  var fuse = new Fuse(list, options); // "list" is the item array
  var result = fuse.search("angular");
  console.log(result);

  //return all metadata in form {titles: [], authors: [], tags: []}
  exports.getAllMetadata = function(req, res) {
    var metadata = {};
    //grab all titles from db
    //Promise.join allows us to wait for several concurrent promises to finish
    //before firing "then"
    Promise.join(
        search.getAllTitles(),
        search.getAllAuthors(),
        tag.getAllPromise(),
        function(titleData, authorData, tagData) {
          metadata.titles = titleData.map(function(title) {
            return title.title;
          });
          metadata.authors = authorData.map(function(author) {
            return author.username;
          });
          metadata.tags = tagData.map(function(tag) {
            return tag.title;
          });
          return metadata;
        })
      .then(function(metadata) {
        //after all db retreival done, send search info back
        console.log("METADATA: ", metadata);
        res.json(metadata);
      });
  };

})();
