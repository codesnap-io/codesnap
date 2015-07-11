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
    githubClientID: "7d292489ff2489c0dc96",
    githubClientSecret: "e71a0bab4e85e531adf7957fcef9db4b54ea8d98",
    githubCallbackUrl: "http://127.0.0.1:8000/auth/github/callback"
  };

})();
