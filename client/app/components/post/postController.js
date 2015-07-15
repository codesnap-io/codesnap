angular.module('postController', [])

.controller('postController', function ($scope, $stateParams, postFactory) {
  $scope.post_id = $stateParams.id;
  postFactory.getPostData($scope.post_id)
    .then(function (post, err) {
      if (err) {
        console.log(err);
      }
      postFactory.getPost(post[0].post_url)
        .then(function (post, err) {
          if (err) {
            console.log(err);
          }
          $scope.post = post;
        });
    });
});
