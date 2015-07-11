(function(){
  'use strict';

  var db = require('../config/db');

  var User = db.Model.extend({
    tableName: 'users'
  });

  db.knex.schema.hasTable('users').then(function(exists) {
    /* Drops the table if it exists.  This is useful to uncomment when you are working on editing the schema */
    if (exists) {
      db.knex.schema.dropTable('users').then(function() {
        console.log("Removed User Table");
      });
    }


    /* Create users table if it doesn't exist. */
    if (!exists) {
      db.knex.schema.createTable('users', function(user) {
        user.increments('id').primary();
        user.string('name', 60);
        user.string('email', 30);
        user.string('username', 30);
        user.integer('github_id');
        user.string('token', 80);
        user.timestamps(); /* Creates created_at, updated_at */
      }).then(function(table) {
        console.log('Created Users Table');
      });
    }
  });



  module.exports = User;
})();
