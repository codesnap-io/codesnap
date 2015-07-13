(function(){

  var request = require('request');

  module.exports.addRepo = function(token, username){

    /* These are the details for the repo that's created */
    var repoName = 'crouton.io';
    var homepage = 'http://www.crouton.io';
    var description = 'A technical blogging platform';

    /* Create repo */
    var options = {
      url: 'https://api.github.com/user/repos',
      method: 'POST',
      body: '{ "name": "' + repoName +'", "homepage": "' + homepage + '", "description": "' + description + '" }',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': 'token ' + token,
        'User-Agent': 'Crouton'
      }
    };

    /* This callback gets run after the repo is created */
    var callback = function(error, response, body) {
      if (error) {
        console.log('ERROR: ', error);
      } else {

        /* Add first dummy post */
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
        var callback = function(error, response, body) {
          if (error) {
            console.log('ERROR: ', error);
          }
        };

        request(options, callback);
      }
    };

    request(options, callback);

  };

})();