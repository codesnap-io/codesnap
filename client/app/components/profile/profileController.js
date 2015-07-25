(function() {
  'use strict';
  angular.module('profileController', ['userFactory', 'tagFactory'])
  .controller('profileController', function ($scope, userFactory, tagFactory, $stateParams) {
    $scope.username = $stateParams.username;
    $scope.posts = userFactory.getPostResult();

    /* passes in local user id to determine which profile to look at */
    userFactory.getUserByUsername($scope.username)
    .then(function(user) {
      $scope.user = user;
    });

    tagFactory.getUserTags($scope.username)
    .then(function(tags) {
      $scope.tags = tags;
      console.log($scope.tags);
    });
  });
})();
