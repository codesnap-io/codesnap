angular.module('userController', ['userFactory'])

  .controller('userController', function($scope, userFactory) {
    //TODO: how to get a user?
    $scope.userID = 3;

    userFactory.getUser($scope.userID)
      .then(function(user) {
        $scope.user = user;
        console.log(user);
      });

    userFactory.removeUser($scope.userID)
      .then(function(user) {
        console.log($scope.user);
      });


  });
