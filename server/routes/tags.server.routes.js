(function(){
  'use strict';

  var tags = require('../controllers/tags.server.controller.js');

  module.exports = function(app) {

    /* Respons with all tags from database */
    app.get('/tags', tags.getTags);

  };




})();
