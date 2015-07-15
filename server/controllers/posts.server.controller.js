(function () {
  'use strict';

  var Post = require('../models/post.server.model');
  var fm = require('front-matter');
  var fs = require('fs');
  var service = require('../services/repo.server.service.js');
  var User = require('../models/user.server.model');

  /* Helper function that returns the download URL for a particular file.  This url will ultimately be saved into the url column of the posts table. */
  var downloadUrl = function (file, username, repoName) {
    return "https://raw.githubusercontent.com/" + username + "/" + repoName + "/master/" + file;
  };

  /* Adds all new posts to the database. */
  exports.addPosts = function (filesToAdd, username, userId, repoName) {

    /* Go to the url of each file, get the file from Github, and add the title to the database */
    for (var i = 0; i < filesToAdd.length; i++) {
      service.getRawFile(downloadUrl(filesToAdd[i], username, repoName), function (data, err, url) {
        if (err) {
          console.log("ERROR: ", err);
        } else {
          /* Grab meta data from the post's markdown.  Data is the markdown content we retrieved from Github */
          var metadata = exports.getMetadata(data);
          var date = new Date();
          var postData = {
            title: metadata.title || "Default Title",
            url: url,
            user_id: userId
          };

          /* Add post to the database.  Log an error if there was a problem. */
          Post.add(postData, function (error) {
            if (error) {
              console.log(error);
            }
          });
        }
      });
    }
  };

  exports.removePosts = function (filesToRemove, username, repoName) {
    for (var i = 0; i < filesToRemove.length; i++) {
      console.log(downloadUrl(filesToRemove[i], username, repoName));
    }
  };

  exports.modifyPosts = function (filesToModify, username, repoName) {
    for (var i = 0; i < filesToModify.length; i++) {
      console.log(downloadUrl(filesToModify[i], username, repoName));
    }
  };

  /* Gets post data from Github */
  exports.postReceive = function (req, res) {

    res.sendStatus(201);

    /* The data points we're receiving from the Github webhook.  It's possible that one or many of the filename arrays will contain data */
    var username = req.body.repository.owner.name;
    var repoName = req.body.repository.name;
    /* An array of the names of files that were added to user's repo */
    var filesAdded = req.body.head_commit.added;
    /* An array of the names of files that were removed from user's repo */
    var filesRemoved = req.body.head_commit.removed;
    /* An array of the names of files that were modified in a user's repo */
    var filesModified = req.body.head_commit.modified;

    /* Get github userId from username */
    service.getGithubUserId(username, function(error, githubUserId) {
      if (error) {
        console.log(error);
      } else {
        /* Lookup user by github ID in database */
        User.findByGithubId(githubUserId, function(error, user) {
          if (error) {
            console.log("ERROR: ", error);
          } else {
            exports.addPosts(filesAdded, username, user.id, repoName);
            exports.removePosts(filesRemoved, username, repoName);
            exports.modifyPosts(filesModified, username, repoName);
          }
        });
      }
    });

  };

  exports.postInfo = function (req, res) {
    if (req.query.post_id) {
      console.log(req.query.post_id);
      var postId = req.query.post_id;
      Post.postInfo(postId, function (error, post) {
        if (error) {
          console.log(error);
          res.send(error);
        } else {
          res.json(post);
        }
      });
    } else {
      res.send(error);
    }
  };

  exports.allPostsInfo = function(req, res) {
    Post.getAllPosts(function (error, posts) {
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        res.json(posts);
      }
    });
  };

  /* Parses metadata from markdown file using the front-matter library. */
  exports.getMetadata = function (file) {
    var data = fm(file);
    return data.attributes;
  };

  //for testing of getMetadata:
  // var file = fs.readFileSync(__dirname + '/sample.md', 'utf8');
  // var metaTest = exports.getMetadata(file, 'www.woot.com');
  // try {
  //   console.log("attributes: ", metaTest);
  // } catch (e) {
  //   console.log(e);
  // }
  //end testing

  /* Dummy Data */
   if (process.env.NODE_ENV === 'development') {
     var req = {};
     var res = {
       sendStatus: function() {
         return;
       }
     };
     req.body = {
       repository: {
         name: 'crouton.io',
         owner: {
           name: 'smkhalsa'
         }
       },
       head_commit: {
         added: ['posts/myPost.md'],
         removed: [],
         modified: []
       }
     };

     exports.postReceive(req, res);
   }

})();
