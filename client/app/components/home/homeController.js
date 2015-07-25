(function() {
  'use strict';

  angular.module('homeController', [])

  .controller('homeController', function($scope, $rootScope, postFactory, tagFactory) {

    /* Load recent posts to page when page first loads */
    postFactory.getRecentPosts()
      .then(function(posts, err) {
        if (err) {
          console.log("Error: ", err);
        } else {
          $scope.posts = posts;
        }
      });

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
