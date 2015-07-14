(function () {
  'use strict';

  var Post = require('../models/post.server.model');
  var fm = require('front-matter');
  var fs = require('fs');

  exports.postReceive = function (req, res) {

    res.sendStatus(201);

    var repoName = req.body.repository.name;
    var filesAdded = req.body.head_commit.added;
    var filesRemoved = req.body.head_commit.removed;
    var filesModified = req.body.head_commit.modified;
    var username = req.body.repository.owner.name;

    // helper function that returns download URL for a particular file
    var downloadUrl = function(file){
      return "https://raw.githubusercontent.com/" + username + "/" + repoName + "/master/" + file;
    };

    var addPosts = function (filesToAdd, username) {
      for (var i = 0; i < filesToAdd.length; i++) {
        var postData = exports.getMetadata(downloadUrl(filesToAdd[i]), downloadUrl(filesToAdd[i]));
        // postData.attr[url] = downloadUrl(filesToAdd[i]);
        // postData looks like:
        // {
        //     attr:  { title: 'Test Readme',
        //       url: downloadUrl(filesToAdd[i]),
        //       author: 'Michael Arnold',
        //       date: 1234225,
        //       summary: 'It\'s a README',
        //       tags: 'README, js, node.js' }
        //     body:  {
        //       ...rest of content... }
        Post.add(postData, function (error) {
          if (error) {
            console.log(error);
          }
        });
      };
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
    var postId = req.query.post_id;

    Post.postInfo(postId, function (error, post) {
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        res.json(post);
      }
    });
  };

  exports.getMetadata = function (file, url) {
    var metadata = fm(file);
    if (url) {
      metadata.attributes['url'] = url;
    }
    return metadata;
  };

  //for testing of getMetadata:
  var file = fs.readFileSync(__dirname + '/sample.md', 'utf8');
  var doc = exports.getMetadata(file, 'www.woot.com');
  try {
    console.log("attr: ", doc.attributes);
    // console.log("body: ", doc.body);
  } catch (e) {
    console.log(e);
  }
  //end testing

})();
