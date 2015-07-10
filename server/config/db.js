(function(){
  'use strict';

  /*  Require our config file so we have access to the environment variables declared locally in a development environment */
  require('./config');

  var knex = require('knex')({
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: 'utf8'
    }
  });

  module.exports = require('bookshelf')(knex);
})();