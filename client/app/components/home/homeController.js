(function() {
  'use strict';

  angular.module('homeController', [])

  .controller('homeController', function($scope, $rootScope, postFactory, tagFactory) {

    //for new post link
    $scope.user = $rootScope.user;
    console.log($scope.user);
    $scope.newPostUrl = "/post/add?username=" + "fakeusername";

    $scope.posts = [];
    $scope.busy = false;

    /* Load recent posts to page when page first loads */
    postFactory.getRecentPosts()
      .then(function(posts, err) {
        if (err) {
          console.log("Error: ", err);
        } else {
          $scope.posts = posts;
          console.log($scope.posts);
        }
      });

    //add more posts on scroll--takes post to get more after
    $scope.addMorePosts = function(lastPost) {
      console.log("getting more posts...");
      $scope.busy = true;
      postFactory.getMorePosts(lastPost)
        .then(function(resp, err) {
          var posts = resp.data;
          $scope.busy = false;
          if (err) {
            console.log("Error: ", err);
          } else if (resp.status === 200) {
            posts.forEach(function(post) {
              $scope.posts.push(post);
            });
          } else if (resp.status === 204) {
            $scope.busy = true;
            console.log("no more posts to display");
          }
        });
    };

    $rootScope.$on('changeHomePostList', function(event, list) {
      if (list === 'recent') {
        postFactory.getRecentPosts()
          .then(function(posts, err) {
            if (err) {
              console.log("Error: ", err);
            } else {
              $scope.posts = posts;
            }
          });
      } else if (list === 'top') {
        postFactory.getTopPosts()
          .then(function(posts, err) {
            if (err) {
              console.log("Error: ", err);
            } else {
              $scope.posts = posts;
            }
          });
      }
    });

    tagFactory.getPopularTags()
      .then(function(data) {
        $scope.tags = data;
      });

  });

})();
