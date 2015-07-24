(function() {
  'use strict';
  angular.module('postController', ['postFactory'])

  .controller('postController', function ($scope, $rootScope, $stateParams, postFactory, $state) {
    /* Set scope id equal to the id passed in as parameter */
    $scope.post_id = $stateParams.id;

    /* Fetch data to this specific post */
    postFactory.getPostData($scope.post_id)
      .then(function (post, err) {
        if (err) {
          console.log(err);
        } else {
          /* post data for author information */
          $scope.postData = post;
          /* The Url to propose changes to the post on github */
          $scope.postData.editUrl = "https://github.com/" + post.username + "/codesnap.io/edit/master/" + post.file;
          postFactory.setCurrentPost(post);

          /* If post data is successfully retrieved, get the markdown file at it's specified url */
          postFactory.getPostMarkdown(post.post_url)
          .then(function (post, err) {
            if (err) {
              console.log(err);
            } else {
              /* Set scope post equal to the markdown content retrieved from Github */
              $scope.post = post;
            }
          });
        }
      });

    /* Determine like status when post page loads */
    if ($rootScope.loggedIn) {
      postFactory.getLikeStatus(localStorage.jwtToken, $scope.post_id)
        .then(function (data) {
          $scope.like = data;
        });
    }

    $scope.search = function(query) {
      /* right now, queries are being stored in rootScope in order to Pass
      to ui-router's resolve object. TODO: change this to something cleaner. */
      $rootScope.searchQuery = query;
      $rootScope.searchType = 'tag';
      $scope.query = [];
      $state.go('searchResults');
    };

    postFactory.addPostView($scope.post_id);

  });
})();
