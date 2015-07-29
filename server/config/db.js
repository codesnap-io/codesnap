(function(){
  'use strict';

  /*  Require our config file so we have access to the environment variables declared locally in a development environment */
  require('./config');

  var knex = require('knex')({
    client: 'mysql',
    connection: process.env.CLEARDB_DATABASE_URL || {
      host: process.env.RDS_HOSTNAME,
      user: process.env.RDS_USERNAME,
      password: process.env.RDS_PASSWORD,
      port: process.env.RDS_PORT,
      database: process.env.DB_NAME,
      timezone: "UTC",
      charset: 'utf8'
    }
  });

  module.exports = require('bookshelf')(knex);
})();


