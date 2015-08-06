(function () {
  'use strict';

  var config = require('./config.js');
  var express = require('express');
  var morgan = require('morgan');
  var bodyParser = require('body-parser');
  var passport = require('passport');
  var path = require('path');
  var session = require('express-session');

  module.exports = function () {
    var app = express();
    app.use(session({ secret: process.env.SESSION_SECRET, cookie: { maxAge: 60000 }}));

    if (process.env.NODE_ENV === 'development') {
      /* morgan is middleware that logs server activity to the console.  We only want to use it in a development setting */
      app.use(morgan('dev'));
    }


    /* body-parser converts data receive in POST requests into JSON */
    app.use(bodyParser.json());

    /* Tell express where to look for static files.  The file listed becomes the root directory for static files. */
    app.use('/', express.static(process.env.CLIENT_FILES));
    // app.all(['/', '/profile/*', '/tag/*', '/post/*', '/signup', '/faq', '/account'], function(req, res, next) {
    //   // Just send the index.html for other files to support HTML5Mode
    //   res.sendFile('index.html', { root: __dirname + "../../../" + process.env.CLIENT_FILES });
    // });



    /* Initialize passport for authentication */
    app.use(passport.initialize());


    // routing for html5 mode
    // app.all('/*', function(req, res, next) {
    //   // Just send the index.html for other files to support HTML5Mode
    //   res.sendFile('index.html', { root: __dirname });
    // });


    /* Required Routes */
    require('../routes/posts.server.routes')(app);
    require('../routes/users.server.routes')(app);
    require('../routes/tags.server.routes')(app);
    require('../routes/likes.server.routes')(app);
    require('../routes/comments.server.routes')(app);
    require('../routes/views.server.routes')(app);
    require('../routes/search.server.routes')(app);
    require('../routes/githubWebhooks.server.routes')(app);

    return app;
  };

})();
