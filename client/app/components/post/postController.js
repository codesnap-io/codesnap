(function() {
  'use strict';
  angular.module('postController', ['postFactory'])

  .controller('postController', function ($scope, $rootScope, $stateParams, postFactory) {
    /* Set scope id equal to the id passed in as parameter */
    $scope.post_id = $stateParams.id;
    $scope.postData = postFactory.getCurrentPost();
    $scope.postData.editUrl = "https://github.com/" + $scope.postData.username + "/codesnap.io/edit/master/" + $scope.postData.file;
    $scope.like = postFactory.getCurrentLike();
    postFactory.addPostView($scope.post_id);

    /* If post data is successfully retrieved, get the markdown file at it's specified url */
    postFactory.getPostMarkdown($scope.postData.post_url)
    .then(function (post, err) {
      if (err) {
        console.log(err);
      } else {
        /* Set scope post equal to the markdown content retrieved from Github */
        $scope.post = post;
      }
    });

  });
})();
