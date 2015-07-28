(function() {
  'use strict';
  var Tag = require('../models/tag.server.model');
  var User = require('../models/user.server.model');
  var Post = require('../config/schema').Post;
  var Promise = require('bluebird');

  //return all metadata in form {titles: [], authors: [], tags: []}
  exports.getAllMetadata = function(req, res) {
    var metadata = {};

    /* Promise.join allows us to wait for several concurrent promises to finish before firing "then" */
    Promise.join(
        Post.getAllTitles(),
        Post.getAllAuthors(),
        Tag.getAll(),
        /* This function takes in the results of the three promises above in order.  For each promise, map the needed string into the metadata object */
        function(titleData, authorData, tagData) {
          metadata.titles = titleData.map(function(title) {
            return {title: title.title, id: title.id};
          });
          metadata.authors = authorData.map(function(author) {
            return {name: author.name, username: author.username};
          });
          /* Tag data is handled differently because it is queried using a join statement in raw SQL */
          metadata.tags = tagData[0].map(function(tag) {
            return tag.title;
          });

          return metadata;
        })
      .then(function(metadata) {
        /* Once metadata has been assembled, send it back to the client */
        res.json(metadata);
      });
  };

  /* Returns posts based on a query */
  exports.postSearch = function(req, res) {
    var query = req.query.q;
    var response = {
      results: {}
    }
    Tag.getTagsByQuery(query, function(error, tagResults) {
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        console.log('tag posts: query: ' + query + ", results: " + tagResults);
        response.results.tags = {
          name: 'Tags',
          results: tagResults
        };

        User.getAuthorsByQuery(query, function(error, authorResults) {
          if (error) {
            console.log(error);
            res.send(error);
          } else {
            console.log('author posts: query: ' + query + ", results: " + authorResults);
            response.results.authors = {
              name: 'Authors',
              results: authorResults
            };

            Post.getTitlesByQuery(query, function(error, titleResults) {
              if (error) {
                console.log(error);
                res.send(error);
              } else {
                console.log('title posts: query: ' + query + ", results: " + titleResults);
                response.results.titles = {
                  name: 'Posts',
                  results: titleResults
                };
                res.json(response);
              }
            });
          }
        });
      }
    });
    //
    // Post.getPostsOnQuery(query, function(error, results) {
    //   if (error) {
    //     console.log(error);
    //     res.send(error);
    //   } else {
    //     res.json(results);
    //   }
    // });
};



})();
