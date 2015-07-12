(function(){
  'use strict';

  var db = require('./db');
  
  ////////////////////////////////////////////////
  /// Users Table Schema
  ////////////////////////////////////////////////

  db.knex.schema.hasTable('users').then(function(exists) {
    /* Drops the table if it exists.  This is useful to uncomment when you are working on editing the schema */
    // if (exists) {
    //   db.knex.schema.dropTable('users').then(function() {
    //     console.log("Removed User Table");
    //   });
    // }

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


  ////////////////////////////////////////////////
  /// Posts Table Schema
  ////////////////////////////////////////////////

  db.knex.schema.hasTable('posts').then(function(exists) {
    /* Drops the table if it exists.  This is useful to uncomment when you are working on editing the schema */
    // if (exists) {
    //   db.knex.schema.dropTable('posts').then(function() {
    //     console.log("Removed Post Table");
    //   });
    // }

    /* Create users table if it doesn't exist. */
    if (!exists) {
      db.knex.schema.createTable('posts', function(post) {
        post.increments('id').primary();
        post.string('title', 255);
        post.string('url', 255);
        post.timestamps(); /* Creates created_at, updated_at */
        post.integer('user_id').unsigned().references('users.id');
      }).then(function(table) {
        console.log('Created Posts Table');
      });
    }
  });



  ////////////////////////////////////////////////
  /// Relationships
  ////////////////////////////////////////////////

  var User = exports.User = db.Model.extend({
    tableName: 'users',
    posts: function() {
      return this.hasMany(Post);
    }
  });
  
  var Post = exports.Post = db.Model.extend({
    tableName: 'posts',
    user: function() {
      return this.belongsTo(User, 'user_id');
    }
  });
})();