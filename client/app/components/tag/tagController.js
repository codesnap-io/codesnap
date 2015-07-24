angular.module('tagController', ['tagFactory'])

.controller('tagController', function ($scope, tagFactory, $stateParams) {
  $scope.name = $stateParams.name;
  $scope.posts = tagFactory.getPostResult();
});
