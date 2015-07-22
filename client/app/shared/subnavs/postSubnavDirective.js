(function() {
  'use strict';
  angular.module('postSubnavDirective', ['postFactory'])
  .directive('postSubnav', function(postFactory) {
      return {
        restrict: 'A',
        controller: function ($scope, postFactory, $timeout) {
          $timeout(function() {
              $scope.postData = postFactory.getCurrentPost();
          }, 200);
        }
      };
    });
})();
