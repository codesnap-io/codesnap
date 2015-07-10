(function(){
  'use strict';

  process.env.PORT = 3000;
  process.env.DB_HOST = '127.0.0.1';
  process.env.DB_USERNAME = 'root';
  process.env.DB_PASSWORD = '';
  process.env.DB_NAME = 'crouton';

  module.exports = {
    // jwtSecret: process.env.JWT_SECRET || 'abc'

  };

})();