(function () {
  'use strict';

  // var config = require('./config.js');
  var express = require('express');
  var morgan = require('morgan');
  var bodyParser = require('body-parser');
  var passport = require('passport');
  var path = require('path');

  module.exports = function () {
    var app = express();

    if (process.env.NODE_ENV === 'development') {

      /* morgan is middleware that logs server activity to the console.  We only want to use it in a development setting */
      app.use(morgan('dev'));
    }

    /* body-parser converts data receive in POST requests into JSON */
    app.use(bodyParser.json());

    /* Tell express where to look for static files.  The file listed becomes the root directory for static files. */
    app.use(express.static('client'));


    /* initialize passport for authentication */
    app.use(passport.initialize());

    /* serve static files */
    app.use(express.static(path.join(__dirname, '../../client')));

    /* Required Routes */
    require('../routes/users.server.routes')(app);

    return app;
  };

})();
