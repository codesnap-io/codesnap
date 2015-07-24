var GitHubStrategy = require('passport-github2').Strategy;
var bcrypt = require('bcrypt');
var passport = require("passport");
var User = require('../models/user.server.model.js');
var repoService = require('../services/repo.server.service.js');
var postCtrl = require('../controllers/posts.server.controller.js');

exports.githubStrategy = function() {
  passport.use(new GitHubStrategy({
      /* These variables are tied to our application's account.  By including them here, we gain access to the users we authenticate */
      clientID: process.env.githubClientID,
      clientSecret: process.env.githubClientSecret,
      callbackURL: process.env.githubCallbackUrl
    },
    function(accessToken, refreshToken, profile, done) {
      //check if user is in db
      User.where({
          github_id: profile.id
        })
        .fetch()
        .then(function(user) {
          //if user exists
          if (user) {
            //finish auth
            return done(null, user);
          }
          //if user does not exist
          /* If user does not exist, create user */
          if (!user) {
            User.forge({
                github_id: profile.id,
                username: profile.username,
                name: profile.displayName,
                email: profile._json.email,
                profile_photo_url: profile._json.avatar_url,
              })
              .save()
              .then(function(newUser) {
                //get all user repos
                repoService.getFileFromGHAPI(accessToken, profile._json.repos_url)
                  .then(function(body) {
                    console.log("got repos from GH");
                    return JSON.parse(body);
                  })
                  .then(function(repos) {
                    // search through all user repos for codesnap.io repo
                    repos.forEach(function(repo) {
                      if (repo.name === "codesnap.io") {
                        //get all user posts
                        repoService.getFileFromGHAPI(accessToken, repo.url + '/contents/posts')
                          .then(function(posts) {
                            //if has posts
                            posts = JSON.parse(posts);
                            //import posts into DB
                            var postPaths = posts.map(function(post) {
                              return post.path;
                            });
                            //add all posts to DB
                            postCtrl.addPostsToDb(postPaths, profile.username, newUser.id, 'codesnap.io');
                          }).catch(function(err) {
                            console.log("Error: ", err);
                            //if has no posts
                            console.log('no posts found, adding first post to gh');
                            //add first post and first image
                            var firstPostPath = {
                              //first post
                              repoPath: 'https://api.github.com/repos/' + profile.username + '/codesnap.io/contents/posts/myFirstPost.md',
                              message: "(init) setup repo and add first post",
                              serverPath: "./server/assets/firstPost.md"
                            };
                            var firstImagePath = {
                              //first image
                              repoPath: 'https://api.github.com/repos/' + profile.username + '/codesnap.io/contents/images/sample.jpg',
                              message: "(init) add first image",
                              serverPath: "./server/assets/sample.jpg"
                            };

                            repoService.addFileToGHRepo(accessToken, profile.username, firstPostPath);
                            repoService.addFileToGHRepo(accessToken, profile.username, firstImagePath);

                          });
                      } else {
                        //if no codesnap.io repo, create repo, readme, image, posts, etc.
                        repoService.addGHRepo(accessToken, profile.username);
                      }
                    });
                  });
                console.log("auth and file add complete");
                return done(null, newUser);
              });
          }
        });

    }
  ));
};

/* Determines what data from the user object should be stored in the session result of serializeUser method is attached to the session as req.session.passport.user */
passport.serializeUser(function(user, done) {
  done(null, user);
});

/* Pass in key that is saved in req.session.passport.user -- this key is used to retrieve the user object attaches the user object to the request as req.user */
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
