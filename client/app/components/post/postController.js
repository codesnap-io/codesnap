angular.module('postController', [])

.controller('postController', function ($scope, $stateParams, postFactory) {
  /* Set scope id equal to the id passed in as parameter */
  $scope.post_id = $stateParams.id;

  /* Fetch data to this specific post */
  postFactory.getPostData($scope.post_id)
    .then(function (post, err) {
      if (err) {
        console.log(err);
      } else {
        /* If post data is successfully retrieved, get the markdown file at it's specified url */
        postFactory.getPostMarkdown(post[0].post_url)
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
});
