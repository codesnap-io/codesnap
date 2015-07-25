(function() {
  'use strict';
  angular.module('profileController', ['userFactory'])
  .controller('profileController', function ($scope, userFactory, $stateParams) {
    $scope.username = $stateParams.username;
    $scope.user.posts = userFactory.getPostResult();

    /* passes in local user id to determine which profile to look at */
    userFactory.getUserByUsername($scope.username)
     .then(function(user) {
       $scope.user = user;
     });
  });
})();
