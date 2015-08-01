(function() {
  'use strict';

  angular.module('footerDirective', [])

  .directive('crFooter', function() {
    return {
      restrict: "E",
      templateUrl: "app/shared/footer/footer.html",
      controller: function($state) {
        
      }
    };
  });

})();
