(function(){
  'use strict';

  var Post = require('../models/post.server.model');

  exports.postReceive = function(req, res) {

    var repoName = req.body.repository.full_name;
    var filesAdded = req.body.head_commit.added;
    var filesRemoved = req.body.head_commit.removed;
    var filesModified = req.body.head_commit.modified;
    var username = req.body.repository.owner.name;

    var downloadUrl = function(file){
      return "https://raw.githubusercontent.com/"+ repoName +"/master/" + file;
    };

    var addPosts = function(filesToAdd, username) {
      for (var i = 0; i < filesToAdd.length; i++ ) {
        var postData = {
          url: downloadUrl(filesToAdd[i]),
          title: 'test',
          user_id: 1
          //username: username
        };
        Post.add(postData, function(error) {
          if (error) {
            console.log(error)
          }
        })
      }
    };

    var removePosts = function(filesToRemove, username) {
      for (var i = 0; i < filesToRemove.length; i++ ) {
        console.log(downloadUrl(filesToRemove[i]))
      }
    };

    var modifyPosts = function(filesToModify, username) {
      for (var i = 0; i < filesToModify.length; i++ ) {
        console.log(downloadUrl(filesToModify[i]))
      }
    };

    addPosts(filesAdded, username);
    removePosts(filesRemoved, username);
    modifyPosts(filesModified, username);

    res.sendStatus(201);
  };

  exports.postInfo = function(req, res) {
    var postId = req.query.post_id;

    Post.postInfo(postId, function(error, post) {
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        res.json(post);
      }
    });
  };

})();
