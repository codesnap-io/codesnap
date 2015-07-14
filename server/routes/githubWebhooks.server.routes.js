(function(){
  'use strict';
  var githubWebhooks = require('../controllers/githubWebhooks.server.controller.js');

  module.exports = function(app) {
    /* Paramenters:
       Data returned:  */
    app.post('/github/postreceive', githubWebhooks.postreceive);
  };

})();
