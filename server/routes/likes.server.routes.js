(function(){
  'use strict';

  var likes = require('../controllers/likes.server.controller.js');

  module.exports = function(app) {

    /* Respons with all tags from database */
    app.get('/like/toggle', likes.toggleLike);

    app.get('/like/status', likes.checkLike);

  };




})();
