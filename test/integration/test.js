/*
With Mocha/Chai, there are three different formats you can use to write tests:

assert([1, 2, 3].length, 3);
[1, 2, 3].length.should.equal(3);
expect([1, 2, 3].length).to.equal(3);

Documentation: http://chaijs.com/
*/
var assert = require('assert');
var should = require('chai').should();
var db = require('../../server/config/db');
var User = require('../../server/models/user.server.model');
var Post = require('../../server/models/post.server.model');
var testUser;

describe('Database', function() {
  before(function(next) {
    db.knex.raw('delete from users').then(function(){
      new User({
        name: 'Michael Jordan',
        email: 'michael@gmail.com',
        github_id: 1111111,
      }).save()
      .then(function(user) {
        testUser = user;
        new Post({
          title: "How to dunk a basketball",
          user_id: user.get('id')
        }).save();
        next();
      });
      
    });
  });

  beforeEach(function(){
 
    // simulate async call w/ setTimeout
    setTimeout(function(){
    }, 50);
 
  });

  after(function() {
    process.exit();
  });

  describe('Add', function() {
    new User({'github_id': 1111111})
    .fetch()
    .then(function(userResult) {
      user = userResult;
    });
    it('user to database', function() {
      should.exist(user);
    });

    new Post({'title': 'How to dunk a basketball'})
    .fetch()
    .then(function(postResult) {
      post = postResult;
    });

    it('post to database', function() {
      should.exist(post);
    });
  });

  // describe('Remove', function() {
  //   new User({'id': user.id})
  //   .fetch()
  //   .then(function(userResult) {
  //     user.delete();
  //   });
  //   User.remove(user.id, function(error, user) {
  //     it('user from database', function() {
  //       error.should.equal(null);
  //     });
  //   });



  //   it('post from database', function() {
  //     should.not.exist(post);
  //   });
  // });

  // describe('Post', function() {

  //   new Post({'title': "How to dunk a basketball"})
  //   .fetch()
  //   .then(function(postResult) {
  //     post = postResult;
  //   });

  //   it('should be added', function () {
  //     should.exist(post);
  //   });
  // });
});



