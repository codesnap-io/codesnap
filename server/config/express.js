(function () {
  'use strict';

  var config = require('./config.js');
  var express = require('express');
  var morgan = require('morgan');
  var bodyParser = require('body-parser');
  var passport = require('passport');
  var path = require('path');
  var cors = require('cors');
  var session = require('express-session');

  module.exports = function () {
    var app = express();
    app.use(session({ secret: 'qoiwej2o3iej23', cookie: { maxAge: 60000 }}));

    if (process.env.NODE_ENV === 'development') {
      /* morgan is middleware that logs server activity to the console.  We only want to use it in a development setting */
      app.use(morgan('dev'));
    }

    /* cors initialization and options for whitelist */
    app.cors = cors;


    /* whitelist of CORS available origins */
    // TODO: change these origins for production
    var whitelist = ['http://www.crouton.io'];
    app.corsOptions = {
      origin: function(origin, callback){
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
      }
    };

    /* body-parser converts data receive in POST requests into JSON */
    app.use(bodyParser.json());

    /* Tell express where to look for static files.  The file listed becomes the root directory for static files. */
    console.log(process.env.CLIENT_FILES);
    app.use(express.static(process.env.CLIENT_FILES));

    /* Initialize passport for authentication */
    app.use(passport.initialize());

    /* Required Routes */
    require('../routes/posts.server.routes')(app);
    require('../routes/users.server.routes')(app);
    require('../routes/githubWebhooks.server.routes')(app);

    return app;
  };

})();
