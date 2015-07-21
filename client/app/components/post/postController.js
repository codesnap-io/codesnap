(function() {
  'use strict';
  angular.module('postController', [])

  .controller('postController', function ($scope, $rootScope, $stateParams, postFactory) {
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
          $scope.editUrl = "https://github.com/" + post.username + "/crouton.io/edit/master/" + post.file;
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

  });
})();