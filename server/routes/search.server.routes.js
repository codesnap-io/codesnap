(function(){
  'use strict';
  var search = require('../controllers/search.server.controller.js');

  module.exports = function(app) {

    //return all post metadata to client for frontend searching
    // app.get('/search/all', search.getAllMetadata);


    /* autocomplete results */
    app.get('/search', search.findAutocompletePosts);
    /*search results for tags, authors, and all */
    app.get('/search/results', search.findPosts);


  };

})();
