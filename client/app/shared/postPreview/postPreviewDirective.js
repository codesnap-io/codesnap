(function() {
  'use strict';

  angular.module('postPreviewDirective', ['authFactory', 'userFactory'])

  .directive('postPreview', function() {
    return {
      restrict: "E",
      templateUrl: "app/shared/postPreview/postPreview.html",
      controller: function($scope, $rootScope, authFactory, userFactory) {

      },
      link: function() {

      }
    };
  });

})();
