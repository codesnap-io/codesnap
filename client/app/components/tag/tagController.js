angular.module('tagController', ['tagFactory'])

.controller('tagController', function ($scope, tagFactory, $stateParams, pattern) {
  $scope.name = $stateParams.name;
  $scope.posts = tagFactory.getPostResult();
  console.log(pattern);
  $scope.pattern = pattern[0];
});
