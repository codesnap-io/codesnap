(function(){
  'use strict';
  var postCtrl = require('../controllers/posts.server.controller.js');

  module.exports = function(app) {
    /* Receives Github webhooks containing information on which posts have been added, edited and deleted. */
    app.post('/postreceive/github', postCtrl.postReceive);
  };

})();
