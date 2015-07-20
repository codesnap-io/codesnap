(function() {
  'use strict';
  var Fuse = require('../services/fuse.js');
  var search = require('../models/search.server.model');
  var tag = require('../models/tag.server.model');

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
    console.log("search: ", search);
    var metadata = {};
    //grab all titles from db
    search.getAllTitles(function(titles) {
        metadata.titles = titles;
        //grab authors
        search.getAllAuthors(function(authors) {
          metadata.authors = authors;
          //grab tags
          tag.getAll(function(tags) {
            metadata.tags = tags;
            //return all
            console.log("sending back metadata: ", metadata);
            res.json(metadata);
          })
        })
      })
      //grab all authors from db
      // search.getAllAuthors(function(authors, error) {
      //   if (error) {
      //     console.log("error getting authors: ", error);
      //   } else {
      //     metadata.authors = authors;
      //   }
      // });
      // //grab all tags from db
      // tag.getAll(function(tags) {
      //   metadata.tags = tags;
      // })
  };

})();
