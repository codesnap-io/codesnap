(function () {
  'use strict';

  // var config = require('./config.js');
  var express = require('express');
  var morgan = require('morgan');
  var bodyParser = require('body-parser');
  var passport = require('passport');
  var path = require('path');
  var cors = require('cors');

  module.exports = function () {
    var app = express();

    if (process.env.NODE_ENV === 'development') {
      /* morgan is middleware that logs server activity to the console.  We only want to use it in a development setting */
      app.use(morgan('dev'));
    }

    /* cors initialization and options for whitelist */
    app.cors = cors;


    /* whitelist of CORS available origins */
    // TODO: change these origins for production
    var whitelist = ['http://localhost:8000', 'http://localhost:5000'];
    app.corsOptions = {
      origin: function(origin, callback){
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
      }
    };

    /* body-parser converts data receive in POST requests into JSON */
    app.use(bodyParser.json());

    /* Tell express where to look for static files.  The file listed becomes the root directory for static files. */
    app.use(express.static('client'));

    /* Initialize passport for authentication */
    app.use(passport.initialize());

    /* Required Routes */
    require('../routes/posts.server.routes')(app);
    require('../routes/users.server.routes')(app);
    require('../routes/githubWebhooks.server.routes')(app);

    return app;
  };

})();
