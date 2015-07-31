(function(){
  'use strict';

  var views = require('../controllers/views.server.controller.js');

  module.exports = function(app) {

    /* Parameters: post_id, address
       Data returned: true or false depending on whether new view was added */
    app.post('/view/add', views.addView);
  };




})();
