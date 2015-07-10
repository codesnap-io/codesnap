(function(){
  'use strict';

  process.env.PORT = 3000;
  process.env.RDS_HOSTNAME = '127.0.0.1';
  process.env.RDS_USERNAME = 'root';
  process.env.RDS_PASSWORD = '';
  process.env.RDS_PORT = 3306;
  process.env.DB_NAME = 'crouton';

  module.exports = {
    // jwtSecret: process.env.JWT_SECRET || 'abc'

  };

})();