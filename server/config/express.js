'use strict';

// var config = require('./config.js');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');

module.exports = function() {
  var app = express();

  if (process.env.NODE_ENV === 'development') {

    /* morgan is middleware that logs server activity to the console.  We only want to use it in a development setting */
    app.use(morgan('dev'));
  }

  /* body-parser converts data receive in POST requests into JSON */
  app.use(bodyParser.json());

  /* Tell express where to look for static files.  The file listed becomes the root directory for static files. */
  app.use(express.static('public'));


  // Required Routes
  // require('../routes/users')

return app;
};

