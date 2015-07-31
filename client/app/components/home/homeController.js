(function() {
  'use strict';

  angular.module('homeController', [])

  .controller('homeController', function($scope, $rootScope, postFactory, tagFactory, userFactory, $window) {

    //for new post link
    $scope.user = userFactory.getUserInfo();

    if ($scope.user) {
      $scope.newPostUrl = "/post/add?username=" + $scope.user.username + "&token=" + $scope.user.token;
    }



    // click new post results in either: go to github new post page in new window, or
    // "you must log in to do that" drop down
    $scope.newPost = function() {
      $scope.loggedIn = $rootScope.loggedIn;
      if ($scope.loggedIn) {
        //go to new post url in new window
        $window.open($scope.newPostUrl);
      } else {
        console.log("new post click no login");
          /* If user tries to like post without being logged in, show a pop up telling them that they need to log in */
        $("body").scrollTop(0);
        $('#post-error-container').slideDown(300);
      }
    };


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
