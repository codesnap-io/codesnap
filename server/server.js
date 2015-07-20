(function(){
  'use strict';

  /* Sets the NODE_ENV variable equal to development if it is otherwise undefined.  In a production environment, NODE_ENV will be assigned a value from our host */
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';

  var express = require('./config/express');
  var app = express();

  app.listen(process.env.PORT);
  module.exports = app;
  console.log('Server running at port: ' + process.env.PORT);


  var tagHandler = require('./services/tagHandler');
  tagHandler.addTags(40, ["Anglr", "Backbone", "Javascript", "j", "net", "angluar-dir", "angulr", "a", "java", "errorhandling", "c"]);
  // tagHandler.addTags(40, ["js"]);


 


})();
