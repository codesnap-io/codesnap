angular.module('userController', ['userFactory'])

.controller('userController', function($scope, $state, userFactory) {
  /* passes in local user id to determine which profile to look at */
  // userFactory.getUser()
  //   .then(function(user) {
  //     $scope.user = user;
  //   });
  $scope.user = userFactory.getCurrentUser();


  /* removes user from DB */
  $scope.removeUser = function() {
    userFactory.removeUser();
    delete window.localStorage.jwtToken;
    $state.go('signup');
  };

});
