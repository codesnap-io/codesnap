(function() {

  var request = require('request');
  var rp = require('request-promise');
  var fs = require('fs');
  var Promise = require('bluebird');
  Promise.promisifyAll(fs);

  //Promise versions:

  /*
  put file in repo -- takes username, token, and a path obj:
  {
    uri: "REPO PATH",
    serverPath: "SERVER PATH",
    message: "COMMIT MESSAGE"
  }
  */
  module.exports.addFileToGHRepo = function(token, username, path) {
    // console.log("in addFileToGHRepo...");
    var file = fs.readFileSync(path.serverPath);
    // console.log("file read...");
    var content = file.toString('base64');
    var options = {
      uri: path.repoPath,
      method: 'PUT',
      body: '{"message": ' + '"' + path.message + '", "content": ' + '"' + content + '"}',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': 'token ' + token,
        'User-Agent': 'CodeSnap'
      }
    };
    // console.log("options created, uri is: ", options.uri);
    return rp(options);
  };


  // get raw file from github for non-auth needs
  module.exports.getRawGHFile = function(uri) {
    var options = {
      uri: uri,
      method: 'GET'
    };
    return rp(options);
  };

  //get file through GH's API
  module.exports.getFileFromGHAPI = function(token, uri) {
    var options = {
      uri: uri,
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': 'token ' + token,
        'User-Agent': 'CodeSnap'
      }
    };
    return rp(options);
  };

  /* This function takes a github username and returns a callback whose first argument is the user's github ID */
  module.exports.getGHUser = function(username) {
    var options = {
      url: "https://api.github.com/users/" + username,
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'CodeSnap'
      }
    };
    return rp(options);
  };

  module.exports.addGHRepo = function(token, username) {

    /* These are the details for the repo that's created */
    var repoName = 'codesnap.io';
    var homepage = 'http://www.codesnap.io';
    var description = 'A technical blogging platform';

    var addRepoOptions = {
      url: 'https://api.github.com/user/repos',
      method: 'POST',
      body: '{ "name": "' + repoName + '", "homepage": "' + homepage + '", "description": "' + description + '" }',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': 'token ' + token,
        'User-Agent': 'CodeSnap'
      }
    };

    var addWebhookOptions = {
      url: 'https://api.github.com/repos/' + username + '/' + repoName + '/hooks',
      method: 'POST',
      body: '{ "name": "web", "config": {"url": "http://www.codesnap.io/postreceive/github", "content_type": "json"} }',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': 'token ' + token,
        'User-Agent': 'CodeSnap'
      }
    };

    var firstPostPath = {
      //first post
      repoPath: 'https://api.github.com/repos/' + username + '/' + repoName + '/contents/posts/myFirstPost.md',
      message: "(init) setup repo and add first post",
      serverPath: "./server/assets/firstPost.md"
    };
    var firstImagePath = {
      //first image
      repoPath: 'https://api.github.com/repos/' + username + '/' + repoName + '/contents/images/sample.jpg',
      message: "(init) add first image",
      serverPath: "./server/assets/sample.jpg"
    };
    var readmePath = {
      //readme
      repoPath: 'https://api.github.com/repos/' + username + '/' + repoName + '/contents/README.md',
      message: "(init) add README.md",
      serverPath: "./server/assets/README.md"
    };

    //add repo
    rp(addRepoOptions)
      .then(function(body) {
        console.log("repo added");
      })
      //add various files to repo
      .then(function(body) {
        module.exports.addFileToGHRepo(token, username, firstPostPath);
        //console.log("first post created!!!!!!!!!!",body);
      })
      .then(function(body) {
          setTimeout(function(){
            module.exports.addFileToGHRepo(token, username, firstImagePath);
          }, 500);
        //console.log("first image created!!!!!!!!!!",body);
        })
      .then(function(body) {
          setTimeout(function(){
            module.exports.addFileToGHRepo(token, username, readmePath);
          }, 500);
        //console.log("readme created!!!!!!!!!!",body);
        })
      .then(function(body) {
        //add webhook
        // console.log("ready to add webhook");
        rp(addWebhookOptions);
      })
      .catch(function(e) {
        if (e.statusCode !== 422) {
          console.error("Error in addGHRepo: ");
        }
      });
  };

})();
