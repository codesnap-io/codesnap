angular.module('signupController', ['signupFactory'])

.controller('signupController', function ($scope, signupFactory) {
    $scope.githubSignup = function() {
      return signupFactory.authenticate();
    };
});
