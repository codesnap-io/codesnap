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
              searchDelay: 0,
              cache: true,
              minCharacters: 2
            });
        }
      };
    });
})();
