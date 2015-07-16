angular.module('userController', ['userFactory'])

.controller('userController', function ($scope, userFactory) {
  $scope.userId = localStorage.userId;

  userFactory.getUser($scope.userId)
    .then(function (user) {
      $scope.user = user;
    });

  $scope.removeUser = function () {
    userFactory.removeUser($scope.userID)
      .then(function (user) {
      });
  };


});
