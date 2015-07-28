(function() {
  'use strict';

  var db = require('./db');

  ////////////////////////////////////////////////
  /// Users Table Schema
  ////////////////////////////////////////////////


  db.knex.schema.hasTable('users').then(function(exists) {
    // /* Drops the table if it exists.  This is useful to uncomment when you are working on editing the schema */
    // if (exists) {
    //   db.knex.schema.dropTable('users').then(function() {
    //     console.log("Removed Users Table");
    //   });
    //   exists = false;
    // }

    /* Create users table if it doesn't exist. */
    if (!exists) {
      db.knex.schema.createTable('users', function(user) {
        user.increments('id').primary();
        user.string('name', 60);
        user.string('email', 30);
        user.string('username', 30);
        user.string('profile_photo_url', 200);
        user.integer('github_id');
        user.string('github_token', 150);
        user.timestamp('created_at').notNullable().defaultTo(db.knex.raw('now()'));
      }).then(function(table) {
        console.log('Created Users Table');
      });
    }
  })


  ////////////////////////////////////////////////
  /// Posts Table Schema
  ////////////////////////////////////////////////

  .then(function() {
    db.knex.schema.hasTable('posts').then(function(exists) {
      /* Drops the table if it exists.  This is useful to uncomment when you are working on editing the schema */
      // if (exists) {
      //   db.knex.schema.dropTable('posts').then(function() {
      //     console.log("Removed Post Table");
      //   });
      //   exists = false;
      // }

      /* Create users table if it doesn't exist. */
      if (!exists) {
        db.knex.schema.createTable('posts', function(post) {
          post.increments('id').primary();
          post.string('title', 255);
          post.string('summary', 255);
          post.string('file', 255);
          post.string('url', 255);
          post.boolean('published').defaultTo(true);
          post.integer('views').defaultTo(0);
          post.integer('user_id').unsigned().references('users.id').onDelete('CASCADE');
          post.timestamp('created_at').notNullable().defaultTo(db.knex.raw('now()'));
        }).then(function(table) {
          console.log('Created Posts Table');
        });
      }
    });
  })


  ////////////////////////////////////////////////
  /// Tags Table Schema
  ////////////////////////////////////////////////

  .then(function() {
    db.knex.schema.hasTable('tags').then(function(exists) {

      // /* Drops the table if it exists.  This is useful to uncomment when you are working on editing the schema */
      // if (exists) {
      //   db.knex.schema.dropTable('tags').then(function() {
      //     console.log("Removed Tags Table");
      //   });
      //   exists = false;
      // }

      /* Create users table if it doesn't exist. */
      if (!exists) {
        db.knex.schema.createTable('tags', function(tag) {
          tag.increments('id').primary();
          tag.string('title', 50);
          tag.timestamp('created_at').notNullable().defaultTo(db.knex.raw('now()'));
          tag.string('pattern', 255);
        }).then(function(table) {
          console.log('Created Tags Table');
        });
      }
    });
  })


  ////////////////////////////////////////////////
  /// Post Tags Table Schema
  ////////////////////////////////////////////////

  .then(function() {
    db.knex.schema.hasTable('post_tag_join').then(function(exists) {
      /* Drops the table if it exists.  This is useful to uncomment when you are working on editing the schema */
      // if (exists) {
      //   db.knex.schema.dropTable('post_tag_join').then(function() {
      //     console.log("Removed Post Tag Join Table");
      //   });
      //   exists = false;
      // }

      if (!exists) {
        db.knex.schema.createTable('post_tag_join', function(post_tag_join) {
          post_tag_join.increments('id').primary();
          post_tag_join.integer('post_id').unsigned().references('posts.id').onDelete('CASCADE');
          post_tag_join.integer('tag_id').unsigned().references('tags.id');
          post_tag_join.timestamp('created_at').notNullable().defaultTo(db.knex.raw('now()'));
        }).then(function(table) {
          console.log('Created Post Tag Join Table');
        });
      }
    });
  })


  ////////////////////////////////////////////////
  /// Comments Table Schema
  ////////////////////////////////////////////////

  .then(function() {
    db.knex.schema.hasTable('comments').then(function(exists) {

      // /* Drops the table if it exists.  This is useful to uncomment when you are working on editing the schema */
      // if (exists) {
      //   db.knex.schema.dropTable('comments').then(function() {
      //     console.log("Removed Comments Table");
      //   });
      //   exists = false;
      // }

      /* Create users table if it doesn't exist. */
      if (!exists) {
        db.knex.schema.createTable('comments', function(comment) {
          comment.increments('id').primary();
          comment.string('text', 255);
          comment.integer('post_id').unsigned().references('posts.id').onDelete('CASCADE');
          comment.integer('user_id').unsigned().references('users.id').onDelete('CASCADE');
          comment.timestamp('created_at').notNullable().defaultTo(db.knex.raw('now()'));
        }).then(function(table) {
          console.log('Created Comments Table');
        });
      }
    });
  })


  ////////////////////////////////////////////////
  /// Votes Table Schema
  ////////////////////////////////////////////////

  .then(function() {
    db.knex.schema.hasTable('likes').then(function(exists) {

      // /* Drops the table if it exists.  This is useful to uncomment when you are working on editing the schema */
      // if (exists) {
      //   db.knex.schema.dropTable('votes').then(function() {
      //     console.log("Removed Votes Table");
      //   });
      //   exists = false;
      // }

      if (!exists) {
        db.knex.schema.createTable('likes', function(vote) {
          vote.increments('id').primary();
          vote.integer('post_id').unsigned().references('posts.id').onDelete('CASCADE');
          vote.integer('user_id').unsigned().references('users.id').onDelete('CASCADE');
          vote.timestamps(); /* Creates created_at, updated_at */
        }).then(function(table) {
          console.log('Created Likes Table');
        });
      }
    });
  });


  ////////////////////////////////////////////////
  /// Relationships
  ////////////////////////////////////////////////

  var User = exports.User = db.Model.extend({
    tableName: 'users',
    posts: function() {
      return this.hasMany(Post);
    },
    comments: function() {
      return this.hasMany(Comment);
    },
    votes: function() {
      return this.hasMany(Vote);
    }
  });

  var Post = exports.Post = db.Model.extend({
    tableName: 'posts',
    user: function() {
      return this.belongsTo(User, 'user_id');
    },
    tags: function() {
      return this.belongsToMany(Tag, 'tag_id');
    },
    comments: function() {
      return this.hasMany(Comment);
    },
    votes: function() {
      return this.hasMany(Vote);
    }
  });

  var Comment = exports.Comment = db.Model.extend({
    tableName: 'comments',
    user: function() {
      return this.belongsTo(User, 'user_id');
    },
    post: function() {
      return this.belongsTo(Post, 'post_id');
    }
  });

  var Tag = exports.Tag = db.Model.extend({
    tableName: 'tags',
    posts: function() {
      return this.belongsToMany(Post, 'post_id');
    }
  });

  var Like = exports.Like = db.Model.extend({
    tableName: 'likes',
    user: function() {
      this.belongsto(User, 'user_id');
    },
    post: function() {
      this.belongsTo(Post, 'post_id');
    }
  });

  var PostTagJoin = exports.PostTagJoin = db.Model.extend({
    tableName: 'post_tag_join'
  });
})();
