(function () {
  'use strict';

  process.env.PORT = 8000;
  process.env.RDS_HOSTNAME = '127.0.0.1';
  process.env.RDS_USERNAME = 'root';
  process.env.RDS_PASSWORD = '';
  process.env.RDS_PORT = 3306;
  process.env.DB_NAME = 'crouton';

  module.exports = {
    // jwtSecret: process.env.JWT_SECRET || 'abc'
    githubClientID: "13957cc9f5c21070a6b3",
    githubClientSecret: "220526326332a9ef271501c28adbdfe26be50e78",
    githubCallbackUrl: "http://127.0.0.1:3000/auth/github/callback"
  };

})();
