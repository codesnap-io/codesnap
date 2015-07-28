(function(){
  'use strict';

  var tags = require('../controllers/tags.server.controller.js');

  module.exports = function(app) {

    /* Responds with all tags from database */
    app.get('/tags', tags.getTags);

    /* Responds with top tags from database */
    app.get('/tags/popular', tags.getPopularTags);

    /* Responds a list of tags assigned to a users published post */
    app.get('/tags/user', tags.getUserTags);

    app.get('/tags/pattern', tags.getTagPattern);
  };




})();
