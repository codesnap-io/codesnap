(function () {
  'use strict';

  var Post = require('../models/post.server.model');
  var fm = require('front-matter');
  var fs = require('fs');
  var service = require('../services/repo.server.service.js');

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
    

    /* Helper function that returns the download URL for a particular file.  This url will ultimately be saved into the url column of the posts table. */
    var downloadUrl = function (file) {
      return "https://raw.githubusercontent.com/" + username + "/" + repoName + "/master/" + file;
    };

    /* Adds all new posts to the database. */
    var addPosts = function (filesToAdd, username) {

      /* This is the callback function that gets run once the data is resolved from the http request we make to Github for post's markdown content. */
      var getFileCallback = function (data, err, url) {
        if (err) {
          console.log("ERROR: ", err);
        } else {
          /* Grab meta data from the post's markdown.  Data is the markdown content we retrieved from Github */
          var metadata = exports.getMetadata(data);
          var date = new Date();
          var postData = {
            title: metadata.title || "Default Title",
            url: url
          };

          /* Add post to the database.  Log an error if there was a problem. */
          Post.add(postData, function(error) {
            if (error) console.log(error);
          });
        }
      };

      /* Go to the url of each file, get the file from Github, and add the title to the database */
      for (var i = 0; i < filesToAdd.length; i++) {
        service.getFile(downloadUrl(filesToAdd[i]), getFileCallback);
      }
    };

    var removePosts = function (filesToRemove, username) {
      for (var i = 0; i < filesToRemove.length; i++) {
        console.log(downloadUrl(filesToRemove[i]));
      }
    };

    var modifyPosts = function (filesToModify, username) {
      for (var i = 0; i < filesToModify.length; i++) {
        console.log(downloadUrl(filesToModify[i]));
      }
    };

    addPosts(filesAdded, username);
    removePosts(filesRemoved, username);
    modifyPosts(filesModified, username);

  };

  exports.postInfo = function (req, res) {
    if (req.query.post_id) {
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
      Post.getAllPosts(function (error, post) {
        if (error) {
          console.log(error);
          res.send(error);
        } else {
          res.json(post);
        }
      });
    }
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

})();
