(function() {
  'use strict';
  var Tag = require('../models/tag.server.model');
  var User = require('../models/user.server.model');
  var Post = require('../config/schema').Post;
  var Promise = require('bluebird');

  //return all metadata in form {titles: [], authors: [], tags: []}
  // exports.getAllMetadata = function(req, res) {
  //   var metadata = {};
  //
  //   /* Promise.join allows us to wait for several concurrent promises to finish before firing "then" */
  //   Promise.join(
  //       Post.getAllTitles(),
  //       Post.getAllAuthors(),
  //       Tag.getAll(),
  //       /* This function takes in the results of the three promises above in order.  For each promise, map the needed string into the metadata object */
  //       function(titleData, authorData, tagData) {
  //         metadata.titles = titleData.map(function(title) {
  //           return {title: title.title, id: title.id};
  //         });
  //         metadata.authors = authorData.map(function(author) {
  //           return {name: author.name, username: author.username};
  //         });
  //         /* Tag data is handled differently because it is queried using a join statement in raw SQL */
  //         metadata.tags = tagData[0].map(function(tag) {
  //           return tag.title;
  //         });
  //
  //         return metadata;
  //       })
  //     .then(function(metadata) {
  //       /* Once metadata has been assembled, send it back to the client */
  //       res.json(metadata);
  //     });
  // };

  /* Returns objects based on a query for the searchbar */
  exports.findAutocompletePosts = function(req, res) {
    var query = req.query.q;
    // initial response object to construct with DB lookups
    var response = {
      results: {}
    };
    //matching tags to search
    Tag.getTagsByQuery(query, function(error, tagResults) {
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        var tagObj = tagResults.map(function(tag) {
          return {
            title: tag.title,
            url: "#/tag/" + tag.title
          };
        });
        response.results.tags = {
          name: 'Tags',
          results: tagObj
        };
        //matching authors to search
        User.getAuthorsByQuery(query, function(error, authorResults) {
          if (error) {
            console.log(error);
            res.send(error);
          } else {
              console.log(authorResults);
              var authorObj = authorResults.map(function(author) {
                return {
                  title: author.username,
                  url: "#/profile/" + author.username,
                  image: author.profile_photo_url,
                  description: author.name
                };
              });
              response.results.authors = {
              name: 'Authors',
              results: authorObj
            };
            //matching titles to search
            Post.getTitlesByQuery(query, function(error, titleResults) {
              if (error) {
                console.log(error);
                res.send(error);
              } else {
                var titleObj = titleResults.map(function(post) {
                  return {
                    title: post.post_title,
                    url: "#/post/" + post.post_id,
                    description: post.author
                  };
                });
                response.results.titles = {
                  name: 'Posts',
                  results: titleObj
                };
                res.json(response);
              }
            });
          }
        });
      }
    });
};

      /* Returns posts based on a query. Used when showing tag results, author results,
      or all posts fitting a query in search */
   exports.findPosts = function(req, res) {
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
