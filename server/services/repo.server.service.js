(function () {

  var Promise = require('bluebird');
  var request = require('request');

  module.exports.getFile = function (url, cb) {
    var options = {
      url: url,
      method: 'GET'
    };
    var callback = function (error, response, body) {
      if (error) {
        console.log('ERROR: error');
      } else {
        return cb(body, error);
      }
    };
    request(options, callback);
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

})();
