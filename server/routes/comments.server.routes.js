(function(){
  'use strict';
  var comments = require('../controllers/comments.server.controller.js');

  module.exports = function(app) {

    /* Adds comment to database */
    app.post('/comment/add', comments.addComment);

    /* Remove comment from database */
    app.delete('/comment/delete', comments.deleteComment);
  };

})();
