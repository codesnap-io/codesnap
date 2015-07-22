(function() {
  'use strict';

  angular.module('homeController', [])

  .controller('homeController', function($scope, $rootScope, postFactory, tagFactory) {

    /* Load posts to post page */
    /* show all posts */

    // $scope.getTopPosts = function() {
    // postFactory.getTopPosts()
    //   .then(function(posts, err) {
    //     if (err) {
    //       console.log("Error: ", err);
    //     } else {
    //       console.log("scope.posts updated");
    //       $scope.posts = posts;
    //     }
    //   });
    // };


    // $scope.getRecentPosts = function() {
    postFactory.getRecentPosts()
      .then(function(posts, err) {
        if (err) {
          console.log("Error: ", err);
        } else {
          $scope.posts = posts;
        }
      });
    // };

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
      } else {
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
      .then(function(data){
        $scope.tags = data;
      });

  });

})();
