(function() {
  'use strict';
  var Tag = require('../models/tag.server.model');
  var User = require('../models/user.server.model');
  var Post = require('../config/schema').Post;
  var Promise = require('bluebird');

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
              var authorObj = authorResults.map(function(author) {
                return {
                  title: author.name,
                  url: "#/profile/" + author.username,
                  image: author.profile_photo_url,
                  description: author.username
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
   exports.findPostsByTag = function(req, res) {
     var tag = req.query.tag;
     Post.getPostsByTag(tag, function(error, posts) {
       if (error) {
         console.log(error);
         res.send(error);
       } else {
         res.json(posts);
       }
     });
   };




})();
