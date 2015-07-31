(function() {
  'use strict';

  angular.module('searchbarDirective', ['searchFactory'])
    .directive('crSearchbar', function(searchFactory) {
      return {
        restrict: 'A',
        link: function() {
          $('.ui.search')
            .search({
              apiSettings: {
                url: 'search/?q={query}'
              },
              type: 'category',
              searchDelay: 100,
              cache: true,
              minCharacters: 1
            });
        }
      };
    });
})();
