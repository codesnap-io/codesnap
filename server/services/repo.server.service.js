(function () {

  var Promise = require('bluebird');
  var request = require('request');

  /* Make a GET request to a file's Github raw download url to retrieve the post's markdown data.  */
  module.exports.getRawFile = function (url, cb) {
    console.log(url);
    var options = {
      url: url,
      method: 'GET'
    };

    /* This function runs a callback on the contents retrieved from the http request to Github for the file's markdown. This function is used in various functions in the post controller. */

    request(options, function (error, response, body) {
      if (error) {
        console.log('ERROR: error');
      } else {
        console.log("callback body: ", body);
        return cb(body, error, url);
      }
    });
  };

  //TODO: make DRY -- written specifically for auth.js to make folder / first post if repo exists but posts do not
  module.exports.addFirstPost = function (token, username, cb) {
    /* These are the details for the repo that's created */
    var repoName = 'crouton.io';

    var options = {
      url: 'https://api.github.com/repos/' + username + '/' + repoName + '/contents/posts/myFirstPost.md',
      method: 'PUT',
      body: '{ "message": "(init) setup repo and add first post", "content": "VGhpcyBpcyB5b3VyIGZpcnN0IHBvc3Qh" }',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': 'token ' + token,
        'User-Agent': 'Crouton'
      }
    };
    request(options, callback);
  }

  module.exports.getFileFromAPI = function (token, url, cb) {
    var options = {
      url: url,
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': 'token ' + token,
        'User-Agent': 'Crouton'
      }
    };

    /* This function runs a callback on the contents retrieved from the http request to Github for the file's markdown. This function is used in various functions in the post controller. */
    request(options, function (error, response, body, url) {
      if (error) {
        console.log('ERROR: error');
      } else {
        return cb(body, error, url);
      }
    });
  };


  module.exports.addRepo = function (token, username) {

    /* These are the details for the repo that's created */
    var repoName = 'crouton.io';
    var homepage = 'http://www.crouton.io';
    var description = 'A technical blogging platform';

    /*  STEP 1: Create repo */
    var options = {
      url: 'https://api.github.com/user/repos',
      method: 'POST',
      body: '{ "name": "' + repoName + '", "homepage": "' + homepage + '", "description": "' + description + '" }',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': 'token ' + token,
        'User-Agent': 'Crouton'
      }
    };

    /* This callback gets run after the repo is created */
    var callback = function (error, response, body) {
      if (error) {
        console.log('ERROR: ', error);
      } else {

        /* STEP 2: Add first dummy post */
        var options = {
          url: 'https://api.github.com/repos/' + username + '/' + repoName + '/contents/posts/myFirstPost.md',
          method: 'PUT',
          body: '{ "message": "(init) setup repo and add first post", "content": "VGhpcyBpcyB5b3VyIGZpcnN0IHBvc3Qh" }',
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': 'token ' + token,
            'User-Agent': 'Crouton'
          }
        };

        /* This callback gets run after the first post is created */
        var callback = function (error, response, body) {
          if (error) {
            console.log('ERROR: ', error);
          } else {

            /* STEP 3: Create webhook on repo - I'm doing this after the dummy post is created so that
             * the dummy post doesn't get added to our database */
            var options = {
              url: 'https://api.github.com/repos/' + username + '/' + repoName + '/hooks',
              method: 'POST',
              body: '{ "name": "web", "config": {"url": "http://www.crouton.io/postreceive/github", "content_type": "json"} }',
              headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': 'token ' + token,
                'User-Agent': 'Crouton'
              }
            };

            /* This callback gets run after the webhook is added to the repo */
            var callback = function (error, response, body) {
              if (error) {
                console.log('ERROR: ', error);
              }
            };

            request(options, callback);
          }
        };

        request(options, callback);
      }
    };

    request(options, callback);

  };

  /* This function takes a github username and returns a callback whose first argument is the user's github ID */
  module.exports.getUserId = function (username, cb) {
    var options = {
      url: "https://api.github.com/users/" + username,
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Crouton'
      }
    };

    var getUserIdCallback = function (error, response, body) {
      if (error) {
        console.log('ERROR: error');
      } else {
        return cb(JSON.parse(body).id);
      }
    };
    request(options, getUserIdCallback);
  };

})();
