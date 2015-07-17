var GitHubStrategy = require('passport-github2').Strategy;
// var development = require('../config/env/development.js');
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
                profile_photo_url: profile._json.avatar_url
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
                    // search through all user repos for crouton.io repo
                    repos.forEach(function(repo) {
                      if (repo.name === "crouton.io") {
                        //get all user posts
                        repoService.getFileFromGHAPI(accessToken, repo.url + '/contents/posts')
                          .then(function(posts) {
                            //if has posts
                            console.log(posts);
                            posts = JSON.parse(posts);
                            //import posts into DB
                            var postPaths = posts.map(function(post) {
                              return post.path;
                            });
                            //add all posts to DB
                            postCtrl.addPostsToDb(postPaths, profile.username, newUser.id, 'crouton.io');
                          }).catch(function(err) {
                            console.log("Error: ", err);
                            //if has no posts
                            console.log('no posts found, adding first post to gh');
                            //add first post and first image
                            var firstPostPath = {
                              //first post
                              repoPath: 'https://api.github.com/repos/' + profile.username + '/crouton.io/contents/posts/myFirstPost.md',
                              message: "(init) setup repo and add first post",
                              serverPath: "./server/assets/firstPost.md"
                            };
                            var firstImagePath = {
                              //first image
                              repoPath: 'https://api.github.com/repos/' + profile.username + '/crouton.io/contents/images/sample.jpg',
                              message: "(init) add first image",
                              serverPath: "./server/assets/sample.jpg"
                            };

                            repoService.addFileToGHRepo(accessToken, profile.username, firstPostPath);
                            repoService.addFileToGHRepo(accessToken, profile.username, firstImagePath);

                          });
                      } else {
                        //if no crouton.io repo, create repo, readme, image, posts, etc.
                        repoService.addGHRepo(accessToken, profile.username);
                      }
                    });
                  });
                return done(null, newUser);
              });
          }
        });

    }
  ));
};













//             //ask for newUser's repos

//               .then(function(body) {

//                 //go through each repo and...
//                 repos.forEach(function(repo) {

//                   var firstImagePath = {
//                     //first image
//                     repoPath: 'https://api.github.com/repos/' + profile.username + '/' + repo.name + '/contents/images/sample.jpg',
//                     message: "(init) add first image",
//                     serverPath: "./server/assets/sample.jpg"
//                   };
//                   //...if find "crouton.io"...
//                   if (repo.name === 'crouton.io') {
//                     console.log("calling addFiletoGHRepo...");
//                     //...add first image...
//                     repoService.addFileToGHRepo(accessToken, profile.username, firstImagePath)
//                       .then(function(body) {
//                         console.log('first image added to repo');
//                           //...and get all posts...
//                         repoService.getFileFromGHAPI(accessToken, 'https://api.github.com/repos/' + profile.username + '/crouton.io/contents/posts')
//                           .then(function(body) {
//                             var files = JSON.parse(body);
//                             var fileNames = files.map(function(file) {
//                               return "posts/" + file.name;
//                             });

//                             var firstPostPath = {
//                               //first post
//                               repoPath: 'https://api.github.com/repos/' + profile.username + '/' + repo.name + '/contents/posts/myFirstPost.md',
//                               message: "(init) setup repo and add first post",
//                               serverPath: "./server/assets/firstPost.md"
//                             };

//                             //...if newUser has no old crouton posts, then add first post to repo...
//                             if (files.length === 0 || !files) {
//                               repoService.addFiletoGHRepo(accessToken, profile.username, firstPostPath)
//                                 .then(function(body) {
//                                   console.log('first post added to repo');
//                                 });
//                                 //...or else add old posts to db...
//                             } else {
//                               //add posts to db
//                               postCtrl.addPosts(fileNames, profile.username, newUser.id, "crouton.io");
//                             }
//                           })
//                           .catch(function(error) {
//                             console.error(error.message);
//                           });
//                       });
//                   } else {
//                     /* Create a new repo in the user's GitHub account */
//                     repoService.addGHRepo(accessToken, profile.username);
//                     return done(null, newUser);
//                   }
//                 });
//               });
//           });
//           //If user does exist, return done
//       } else {
//         return done(null, user);
//       }
//     });
// }))
// };

/* Determines what data from the user object should be stored in the session result of serializeUser method is attached to the session as req.session.passport.user */
passport.serializeUser(function(user, done) {
  done(null, user);
});

/* Pass in key that is saved in req.session.passport.user -- this key is used to retrieve the user object attaches the user object to the request as req.user */
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
