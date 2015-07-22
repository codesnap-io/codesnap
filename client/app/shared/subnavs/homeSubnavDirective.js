(function() {
  'use strict';
  angular.module('homeSubnavDirective', [])
  .directive('homeSubnav', function() {
      return {
        restrict: 'A',
        controller: function ($scope, $rootScope) {
          /* By default, recent posts are shown.  When user clicks top posts, $scope.recent is set to false.  This variable is used to determine which category list (Recent vs. Top Posts) should be underscored */
          $scope.category = 'recent';

          $scope.getTopPosts = function() {
            $scope.category = 'top';
            $rootScope.$emit('changeHomePostList', 'top');
          };

          $scope.getRecentPosts = function() {
            $scope.category = 'recent';
            $rootScope.$emit('changeHomePostList', 'recent');
          };
        }
      };
    });
})();
