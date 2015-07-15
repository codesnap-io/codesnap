(function () {
  'use strict';

  process.env.PORT = 8000;
  process.env.RDS_HOSTNAME = '127.0.0.1';
  process.env.RDS_USERNAME = 'root';
  process.env.RDS_PASSWORD = '';
  process.env.RDS_PORT = 3306;
  process.env.DB_NAME = 'crouton';
  process.env.githubClientID = "FILL THIS IN";
  process.env.githubClientSecret = "FILL THIS IN";
  process.env.githubCallbackUrl = "FILL THIS IN";
  process.env.jwtSecret = "asodij23oije";

})();