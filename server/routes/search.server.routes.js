(function(){
  'use strict';
  var search = require('../controllers/search.server.controller.js');

  module.exports = function(app) {

    /* autocomplete results */
    app.get('/search', search.findAutocompletePosts);
    /*search results for tags, authors, and all */
    app.get('/search/tag', search.findPostsByTag);
  };

})();
