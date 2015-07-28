angular.module('tagController', ['tagFactory'])

.controller('tagController', function ($scope, tagFactory, $stateParams, pattern) {
  $scope.name = $stateParams.name;
  $scope.posts = tagFactory.getPostResult();
  $scope.pattern = pattern[0];
});
