(function() {
  'use strict';

  var Post = require('../models/post.server.model');
  var fm = require('front-matter');
  var fs = require('fs');
  var service = require('../services/repo.server.service.js');
  var User = require('../models/user.server.model');
  var tagHandler = require('../services/tagHandler');

  /* Helper function that returns the download URL for a particular file.  This url will ultimately be saved into the url column of the posts table. */
  var downloadUrl = function(file, username, repoName) {
    return "https://raw.githubusercontent.com/" + username + "/" + repoName + "/master/" + file;
  };

  //adds posts to db
  exports.addPostsToDb = function(filesToAdd, username, userId, repoName) {
    //go to URI of each file, add title to db
    filesToAdd.forEach(function(file) {
      // make sure file is in posts and is markdown
      if (file.slice(0, 6) === 'posts/' && file.slice(-3).toLowerCase() === '.md') {
        var url = downloadUrl(file, username, repoName);
        // get the raw file from the the url of the post
        service.getRawGHFile(url)
          .then(function(rawFile) {
            // retreive front-matter metadata
            var metadata = exports.getMetadata(rawFile);
            var summary = exports.getSummary(rawFile);

            var postData = {
              title: metadata.title || "Default Title",
              url: url,
              user_id: userId,
              file: file,
              summary: summary
            };

            /* Apply regex to remove unwanted content in post's raw text */
            var postText = rawFile.replace(/\s{2,}/g, " ").replace(/(?:\r\n|\r|\n)/g, " ").replace(/[\.,-\/#!$%\^&\*;:{}=\-_`'~()]/g, "");

            /* Create array of unique words by consolidating words into an object then converting object keys into an array */
            // var wordObj = {};
            // postText.split(" ").forEach(function(word) {
            //   wordObj[word] = true;
            // });
            // var words = Object.keys(wordObj);

            /* Add post to the database.  Log an error if there was a problem. If post is added successfully, add tags to join table */
            Post.add(postData, function(error, post) {
              if (error) {
                console.error("Error during Post add: ", error);
              } else {
                /* Pull post's tags from metadata */
                if (metadata.tags) {
                  var tags = cleanTagMetaData(metadata.tags);
                  tagHandler.addTags(post.get('id'), tags);
                  // tagHandler.findTags(post.get('id'), words);
                }

              }
            });


          })
          .catch(function(error) {
            console.error("Error during add Posts to db: ", error);
          });
      }
    });
  };

  var cleanTagMetaData = function(tags) {
    tags = tags.replace(/,\s/g, ",").replace(/\s/, "-").toLowerCase().split(",");
    for (var i = tags.length - 1; i >= 0; i--) {
      if (tags[i].length === 0) {
        tags.splice(i, 1);
      }
    }
    return tags;
  };

  exports.removePostsfromDb = function(filesToRemove, username, repoName) {
    var url;
    filesToRemove.forEach(function(file) {
      url = downloadUrl(filesToRemove[i], username, repoName);
      Post.remove(url, function(error) {
        console.error("Error during post remove: ", error);
      });
    });
  };

  exports.modifyPostsInDb = function(filesToModify, username, repoName) {
    filesToModify.forEach(function(file) {
      service.getRawGHFile(downloadUrl(file, username, repoName))
        .then(function(rawFile) {
          /* Grab meta data from the post's markdown.  Data is the markdown content we retrieved from Github */
          var metadata = exports.getMetadata(data);
          var summary = exports.getSummary(data);
          var postData = {
            title: metadata.title,
            url: url,
            updated_at: new Date(),
            summary: summary
          };

          /* Add post to the database.  Log an error if there was a problem. */
          Post.modify(postData, function(error) {
            if (error) {
              console.error("Error during post modify: ", error);
            }
          });
        })
        .catch(function(error) {
          console.error("Error during modify posts in db: ", error);
        });
    });
  };

  exports.postReceive = function(req, res) {
    console.log("------------Post received----------------");
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
    service.getGHUser(username)
      .then(function(user) {
        var githubUserId = JSON.parse(user).id;
        //find user by github userId and add/remove/modify as needed
        User.findByGithubId(githubUserId, function(error, user) {
          if (error) {
            console.log("ERROR: ", error, " with id: ", githubUserId);
          } else {
            console.log("user found, adding / removing / modifying files");
            exports.addPostsToDb(filesAdded, username, user.id, repoName);
            exports.removePostsfromDb(filesRemoved, username, repoName);
            exports.modifyPostsInDb(filesModified, username, repoName);
          }
        });
      })
      .catch(function(error) {
        console.error("Error in getGHUser: ", error);
      });
  };

  exports.postInfo = function(req, res) {
    if (req.query.post_id) {
      var postId = req.query.post_id;
      Post.postInfo(postId, function(error, post) {
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
    Post.getAllPosts(function(error, posts) {
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        res.json(posts);
      }
    });
  };

  /* Parses metadata from markdown file using the front-matter library. */
  exports.getMetadata = function(file) {
    var data = fm(file);
    return data.attributes;
  };

  exports.getSummary = function(file) {
    var data = fm(file);
    /* Pull the 140 first characters of a post to generate its summary */
    var summary = data.body.slice(0, 139);
    return summary;
  };

  exports.topPosts = function(req, res) {
    Post.getTopPosts()
    .then(function(posts) {
      res.json(posts[0]);
    });
  };

  exports.recentPosts = function(req, res) {
    Post.getRecentPosts()
    .then(function(posts) {
      res.json(posts[0]);
    });
  };

  exports.addView = function(req, res) {
    if (req.query.post_id) {
      Post.addView(req.query.post_id);
      res.send("View added");
    } else{
      res.send("No post id provide");
    }
  };

  exports.addPost = function(req, res) {
    var timestamp = new Date().toISOString().
            replace(/T/, '-').      // replace T with a dash
            replace(/\..+/, '')     // delete the dot and everything after
    var path = {
      repoPath: 'https://api.github.com/repos/' + req.query.username + '/codesnap.io/contents/posts/' + timestamp + '.md',
      message: "(init) add new post",
      serverPath: "./server/assets/postTemplate.md"
    };
    /* Create new post file from template */
    service.addFileToGHRepo(process.env.githubAccessToken, req.query.username, path).then(function(data) {
      var repoPath = JSON.parse(data).content.path;
      /* Redirect to the edit page for the new file */
      res.redirect('https://github.com/'+ req.query.username +'/codesnap.io/edit/master/' + repoPath);
    })
  };

})();
