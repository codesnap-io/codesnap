(function() {
  'use strict';

  angular.module('homeController', [])

  .controller('homeController', function($scope, $rootScope, postFactory, tagFactory) {

    //for new post link
    $scope.user = $rootScope.user;
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
        }
      });

    /* This function fetches more posts when user scrolls down to bottom of post-list div.  This function takes in the last post.  We then take the post id from this post and fetch the next posts with a lower post_id (created before the last post) */
    $scope.addMorePosts = function(lastPost) {
      $scope.busy = true;
      postFactory.getMorePosts(lastPost.post_id)
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
