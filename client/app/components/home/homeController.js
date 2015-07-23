(function() {
  'use strict';

  angular.module('homeController', [])

  .controller('homeController', function($scope, $rootScope, postFactory, tagFactory, $state) {

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


    /* the actual calling for search results, resolved in app.js */
    $scope.search = function(query) {
      /* right now, queries are being stored in rootScope in order to Pass
      to ui-router's resolve object. TODO: change this to something cleaner. */
      $rootScope.searchQuery = query;
      $rootScope.searchType = 'tag';
      $scope.query = [];
      $state.go('searchResults');
    };


    tagFactory.getPopularTags()
      .then(function(data){
        $scope.tags = data;
      });

  });

})();
