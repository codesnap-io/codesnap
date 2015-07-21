(function() {
  'use strict';
  var tag = require('../models/tag.server.model');
  var Post = require('../config/schema').Post;
  var Promise = require('bluebird');

  //return all metadata in form {titles: [], authors: [], tags: []}
  exports.getAllMetadata = function(req, res) {
    var metadata = {};
    //grab all titles from db
    //Promise.join allows us to wait for several concurrent promises to finish before firing "then"
    Promise.join(
        Post.getAllTitles(),
        Post.getAllAuthors(),
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
        // console.log("METADATA: ", metadata);
        res.json(metadata);
      });
  };

  /* returns posts based on a query */
  exports.postSearch = function(req, res) {
    var query = req.query.searchQuery;
    var type = req.query.searchType;
    Post.getPostsOnQuery(query, type, function(error, posts) {
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        res.json(posts);
      }
    });
  };



})();
