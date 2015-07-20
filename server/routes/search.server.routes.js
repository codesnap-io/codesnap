(function(){
  'use strict';
  var search = require('../controllers/search.server.controller.js');

  module.exports = function(app) {

    //return all post metadata to client for frontend searching
    app.get('/search/all', search.getAllMetadata);

  };

})();
