angular.module('tagController', ['tagFactory'])

.controller('tagController', function ($scope, tagFactory) {

  /* Tags */
  tagFactory.getTags()
    .then(function(tags) {
      $scope.tags = tags;
    });
});
