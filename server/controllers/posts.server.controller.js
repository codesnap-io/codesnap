(function () {
  'use strict';

  var Post = require('../models/post.server.model');
  var fm = require('front-matter');
  var fs = require('fs');
  var service = require('../services/repo.server.service.js');

  exports.postReceive = function (req, res) {

    res.sendStatus(201);

    var repoName = req.body.repository.name;
    var filesAdded = req.body.head_commit.added;
    var filesRemoved = req.body.head_commit.removed;
    var filesModified = req.body.head_commit.modified;
    var username = req.body.repository.owner.name;

    // helper function that returns download URL for a particular file
    var downloadUrl = function (file) {
      return "https://raw.githubusercontent.com/" + username + "/" + repoName + "/master/" + file;
    };


    var addPosts = function (filesToAdd, username) {
      var addCallback = function (error) {
        if (error) {
          console.log(error);
        }
      };

      var gfCallback = function (data, err) {
        if (err) {
          console.log("ERROR: ", err);
        } else {
          var metadata = exports.getMetadata(data);
          var date = new Date();
          var postData = {
            title: metadata.title || "Default Title",
            url: 'https://raw.githubusercontent.com/m-arnold/crouton.io/master/posts/myFirstPost.md'
            // user_id: username
            // update_at: date,
            // tags: metadata.tags || ""
          };
          // postData looks like:
          //     { url: 'https://raw.githubusercontent.com/...',
          //       created_at: PROGRAMMATICALLY CREATED DATE,
          //       date: USER INPUTTED DATE,
          //       title: 'TITLE',
          //       author: 'AUTHOR',
          //       summary: 'It\'s a README',
          //       tags: 'README, js, node.js' }

          Post.add(postData, addCallback);
        }
      };

      for (var i = 0; i < filesToAdd.length; i++) {
        service.getFile(downloadUrl(filesToAdd[i]), gfCallback);
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
