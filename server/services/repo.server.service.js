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

    /* For each file we add, specify a repo location, an initial message and the location of the file to be copied on our server */
    var firstPostPath = {
      repoPath: 'https://api.github.com/repos/' + username + '/' + repoName + '/contents/posts/myFirstPost.md',
      message: "(init) setup repo and add first post",
      serverPath: "./server/assets/firstPost.md"
    };

    var firstImagePath = {
      repoPath: 'https://api.github.com/repos/' + username + '/' + repoName + '/contents/images/sample.jpg',
      message: "(init) add first image",
      serverPath: "./server/assets/sample.jpg"
    };

    var readmePath = {
      repoPath: 'https://api.github.com/repos/' + username + '/' + repoName + '/contents/README.md',
      message: "(init) add README.md",
      serverPath: "./server/assets/README.md"
    };

    var bioPath = {
      repoPath: 'https://api.github.com/repos/' + username + '/' + repoName + '/contents/bio.md',
      message: "(init) add bio.md",
      serverPath: "./server/assets/bio.md"
    };

    /* Create repo if user signs up and repo doesn't already exist */
    rp(addRepoOptions)
      .then(function(body) {
      })
      /* Add various files to the repo */
      .then(function(body) {
        /* Add first post in posts folder */
        console.log("FIRST POST ADDED");
        module.exports.addFileToGHRepo(token, username, firstPostPath);
      })
      .then(function(body) {
        setTimeout(function(){
           /* Add first image in images folder */
           console.log("FIRST IMAGE ADDED")
          module.exports.addFileToGHRepo(token, username, firstImagePath);
        }, 500);
      })
      .then(function(body) {
        setTimeout(function(){
          /* Add readme to main repo */
          console.log("README ADDED");
          module.exports.addFileToGHRepo(token, username, readmePath);
        }, 500);
      })
      .then(function(body) {
        setTimeout(function(){
          /* Add readme to main repo */
          console.log("BIO ADDED");
          module.exports.addFileToGHRepo(token, username, bioPath);
        }, 500);
      })
      .then(function(body) {
        /* Set up webhook so we receive notification when changes are made to repo */
        rp(addWebhookOptions);
      })
      .catch(function(e) {
        if (e.statusCode !== 422) {
          console.error("Error in addGHRepo: ");
        }
      });
  };

})();
