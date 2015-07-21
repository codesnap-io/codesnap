(function(){
  'use strict';
  var search = require('../controllers/search.server.controller.js');

  module.exports = function(app) {

    //return all post metadata to client for frontend searching
    app.get('/search/all', search.getAllMetadata);


    /* Query string: search string and type
       Data returned: post_id, post_title, post_url, post_author */
    app.get('/search', search.postSearch);


  };

})();
