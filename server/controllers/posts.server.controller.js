(function() {
  'use strict';

  var Post = require('../models/post.server.model');
  var fm = require('front-matter');
  var fs = require('fs');
  var service = require('../services/repo.server.service.js');
  var User = require('../models/user.server.model');
  var tagHandler = require('../services/tagHandler');
  var parseDiff = require('../services/repo.server.parseDiff.js');
  var Paragraph = require('../config/schema').Paragraph;
  var Promise = require('bluebird');

  /* Helper function that returns the download URL for a particular file.  This url will ultimately be saved into the url column of the posts table. */
  var downloadUrl = function(file, username, repoName) {
    return "https://raw.githubusercontent.com/" + username + "/" + repoName + "/master/" + file;
  };

  //adds posts to db
  exports.addPostsToDb = function(filesToAdd, username, userId, repoName) {
    //go to URI of each file, add title to db
    filesToAdd.forEach(function(file) {
      // make sure file is in posts and is markdown
      if (file.slice(0, 6) === 'posts/' && (file.slice(-3).toLowerCase() === '.md' || file.slice(-9).toLowerCase() === '.markdown')) {
        var url = downloadUrl(file, username, repoName);
        // get the raw file from the the url of the post
        service.getRawGHFile(url)
          .then(function(rawFile) {
            // retreive front-matter metadata
            var metadata = exports.getMetadata(rawFile);
            var summary = exports.getSummary(rawFile).replace(/#/g, '');

            /* Convert published from boolean to number (0 or 1) so it can be saved into database properly) */
            if (metadata.published !== undefined) {
              metadata.published = +metadata.published;
            } else {
              metadata.published = 1;
            }
            var postData = {
              title: metadata.title || "Default Title",
              url: url,
              user_id: userId,
              file: file,
              published: metadata.published,
              summary: summary
            };

            /* Apply regex to remove unwanted content in post's raw text */
            // var postText = rawFile.replace(/\s{2,}/g, " ").replace(/(?:\r\n|\r|\n)/g, " ").replace(/[\.,-\/#!$%\^&\*;:{}=\-_`'~()]/g, "");

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

                /* Add post's paragraphs to database */
                service.parseParagraphs(rawFile, post.get('id'));
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
      url = downloadUrl(file, username, repoName);
      Post.remove(url, function(error) {
        console.error("Error during post remove: ", error);
      });
    });
  };

  exports.modifyPostsInDb = function(filesToModify, username, repoName) {
    filesToModify.forEach(function(file) {
      var url = downloadUrl(file, username, repoName);
      service.getGHFileContentsFromApi(file, username)
        .then(function(rawFile) {
          // retreive front-matter metadata
          var metadata = exports.getMetadata(rawFile);
          var summary = exports.getSummary(rawFile);

          /* Convert published from boolean to number (0 or 1) so it can be saved into database properly) */
          if (metadata.published !== undefined) {
            metadata.published = +metadata.published;
          } else {
            metadata.published = 1;
          }
          var postData = {
            title: metadata.title || "Default Title",
            url: url,
            file: file,
            published: metadata.published,
            summary: summary
          };

          /* Add post to the database.  Log an error if there was a problem. */
          Post.modify(postData, function(error, post) {
            if (error) {
              console.error("Error during post modify: ", error);
            } else {
              if (metadata.tags) {
                var tags = cleanTagMetaData(metadata.tags);
                tagHandler.updateTags(post.get('id'), tags);
              }
            }
          });
        })
        .catch(function(error) {
          console.error("Error during modify posts in db: ", error);
        });
    });
  };

  //helper function to adjust comment line #s based on diff
  var adjustParagraphs = function(parsedDiff, paragraphs) {

    var oldLines = parsedDiff.old;
    var newLines = parsedDiff.new;

    //loop thru post Paragraphs
    paragraphs.forEach(function(p) {
      var currentParaFirstLine = p.line;
      var currentParaNumber = p.number;
      //loop thru old
      for (var line in oldLines) {
        //is paragraph first line # removed?
        if ((line === p.line) && (oldLines[line][1] === "removed")) {
          //if yes, is whole paragraph below removed as well? (did removal meet a blank line?)
          for (var belowIndex = p.line; oldLines[belowIndex][1] === "removed"; belowIndex++) {
            if (oldLines[belowIndex + 1][0] === "") {
              //if yes, delete paragraph and decrement all later paragraphs' order #s
              Paragraph.remove(p.id);
              paragraphs.forEach(function(para) {
                if (para.number > currentParaNumber) {
                  para.number--;
                }
              });
            }
          }
        }
      }
      //loop thru new
      for (var line in newLines) {
        //do any line additions begin @ or above paragraph first line #?
        if ((line === p.line) && (newLines[line][1] === "added")) {
          for (var aboveIndex = p.line - 1; newLines.hasOwnProperty(aboveIndex - 1); aboveIndex--) {
            if (newLines[aboveIndex][1] === "added") {
              var blankLineGroups = 0;
              //if yes, loop down from that line addition and ask: does any consecutive line addition contain a blank line?
              for (var belowIndex = p.line + 1; newLines[belowIndex + 1][1] === "added"; belowIndex++) {
                //if yes, how many groups of blank lines exist in the current consecutive addition?
                if (newLines[belowIndex][0] === '') {
                  blankLineGroups++;
                }
              }
              //if yes, increment all paragraph order #s after this by the number of groups of blank lines
              paragraphs.forEach(function(para) {
                if (para.number > currentParaNumber) {
                  para.number += blankLineGroups;
                }
              });
            }
          }
        }
      }
    });
    return paragraphs;
  };

  exports.postReceive = function(req, res) {
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
    console.log("FILES MODIFIED: ", filesModified);
    //SHA of pre-commits file
    var beforeSha = req.body.before;
    //SHA of post-commits file
    var afterSha = req.body.after;

    // //if diff exists...
    // if (!beforeSha || beforeSha !== afterSha) {

    //   var filesModifiedIds = [];
    //   var paragraphs = {};
    //   //get postIDs of all files modified so that we can get paragraphs for each modified file by postId
    //   filesModified.forEach(function(file) {
    //     filesModifiedIds.push(Post.getPostByUrl(downloadUrl(file, username, repoName))
    //       .then(function(fileObj) {
    //         return fileObj.attributes.id;
    //       }));
    //   });

    //   var postIds;
    //   //wait for all filesModifiedIds to come back before taking next step
    //   Promise.all(filesModifiedIds)
    //     .then(function(completeModdedPostIds) {
    //       //set this to wider scoped variable for later access
    //       postIds = completeModdedPostIds;
    //       //get obj whose keys are postIds and whose values are arrays of Paragraphs for each modified file
    //       completeModdedPostIds.forEach(function(postId) {
    //         paragraphs[postId] = Paragraph.postParagraphs(postId)
    //           .then(function(paragraphs) {
    //             return paragraphs[0];
    //           });
    //       });
    //     })
    //     //wait for all paragraphs to come back before taking next step
    //     .then(function() {
    //       Promise.props(paragraphs)
    //         .then(function(completeParagraphs) {

    //           var diffUrl = "https://github.com/" + username + "/" + repoName + "/compare/" + beforeSha + "..." + afterSha + ".diff";

    //           //parse head_commit diff
    //           parseDiff.parseDiffFromUrl(diffUrl, function(data) {
    //             //returns "new" and "old" objs for each filePath changed in commit
    //             for (var postPath in data) {
    //               postIds.forEach(function(postId) {
    //                 var parsedPostDiff = data[postPath];
    //                 // adjust paragraph ordinal numbers for given post
    //                 var adjustedParagraphs = adjustParagraphs(parsedPostDiff, completeParagraphs[postId]);
    //                 // save adj paras to db
    //                 adjustedParagraphs.forEach(function(paraObj) {
    //                   Paragraph.edit(paraObj.id, paraObj.number, paraObj.line);
    //                 })
    //                 console.log("adj paras for "+postPath+": \n", adjustedParagraphs);
    //                 // give adjusted paragraphs correct first line #s
    //                 // service.getGHFileContentsFromApi(postPath, username)
    //                 //   .then(function(content) {
    //                 //     service.parseParagraphs(content, postId);
    //                 //   });
    //               });
    //             }
    //           });
    //         });
    //     });
    // }

    /* Get github userId from username */
    service.getGHUser(username)
      .then(function(user) {

        var githubUserId = JSON.parse(user).id;
        console.log(user);
        console.log(githubUserId);
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

  /* Return information needed for post page */
  exports.postInfo = function(req, res) {
    if (req.query.post_id) {
      var postId = req.query.post_id;
      Post.postInfo(postId, function(error, post) {
        if (error) {
          console.log(error);
          res.send(false);
        } else {
          res.json(post);
        }
      });
    } else {
      res.send(error);
    }
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


  exports.getMoreTopPosts = function(req, res) {
    if (req.query.last_post_id && req.query.last_like) {
      Post.getMoreTopPosts(req.query.last_post_id, req.query.last_like)
        .then(function(posts) {
          if (posts[0][0] && posts[0][0].hasOwnProperty("post_title")) {
            res.json(posts[0]);
          } else {
            res.status(204).send("no more posts");
          }
        });
    } else {
      res.status(400).send("no lastPost or lastlike provided");
    }
  };



  exports.getMoreRecentPosts = function(req, res) {
    if (req.query.last_post_id) {
      Post.getMoreRecentPosts(req.query.last_post_id)
        .then(function(posts) {
          if (posts[0][0] && posts[0][0].hasOwnProperty("post_title")) {
            res.json(posts[0]);
          } else {
            res.status(204).send("no more posts");
          }
        });
    } else {
      res.status(400).send("no lastPost provided");
    }
  };

  exports.addView = function(req, res) {
    if (req.query.post_id) {
      Post.addView(req.query.post_id);
      res.send("View added");
    } else {
      res.send("No post id provided");
    }
  };

  exports.addPost = function(req, res) {
    var timestamp = new Date().toISOString().
    replace(/T/, '-'). // replace T with a dash
    replace(/\..+/, ''); // delete the dot and everything after
    var path = {
      repoPath: 'https://api.github.com/repos/' + req.query.username + '/codesnap.io/contents/posts/' + timestamp + '.md',
      message: "(init) add new post",
      serverPath: "./server/assets/postTemplate.md"
    };
    /* Create new post file from template */
    service.addFileToGHRepo(req.query.token, req.query.username, path).then(function(data) {
      var repoPath = JSON.parse(data).content.path;
      /* Redirect to the edit page for the new file */
      res.redirect('https://github.com/' + req.query.username + '/codesnap.io/edit/master/' + repoPath);
    });
  };

  exports.recentUserPosts = function(req, res) {
    var username = req.query.username;
    Post.recentUserPosts(username)
      .then(function(posts) {
        res.json(posts[0]);
      });
  };

  exports.topUserPosts = function(req, res) {
    var username = req.query.username;
    Post.topUserPosts(username)
      .then(function(posts) {
        res.json(posts[0]);
      });
  };

  /* Dummy Data */
  // if (process.env.NODE_ENV === 'development') {
  //   var req = {};
  //   var res = {
  //     sendStatus: function() {
  //       return;
  //     }
  //   };
  //   req.body = {
  //     repository: {
  //       name: 'codesnap.io',
  //       owner: {
  //         name: 'bdstein33'
  //       }
  //     },
  //     head_commit: {
  //       added: [],
  //       removed: [],
  //       modified: ['posts/myFirstPost.md']
  //     }
  //   };
  //   exports.postReceive(req, res);
  // }

})();
