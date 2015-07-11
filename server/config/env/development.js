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
    githubClientSecret: "d3ca1aa8a19339272e0425026b581e2e6294e2f9",
    githubCallbackUrl: "http://127.0.0.1:8000/auth/github/callback"
  };

})();
