angular.module('userController', ['userFactory'])

.controller('userController', function ($scope, userFactory) {
  $scope.userId = localStorage.userId;

  /* passes in local user id to determine which profile to look at */
  userFactory.getUser($scope.userId)
    .then(function (user) {
      $scope.user = user;
    });


  /* removes user from DB */
  $scope.removeUser = function () {
    userFactory.removeUser($scope.user.id)
      .then(function (user) {
      });
  };


});
