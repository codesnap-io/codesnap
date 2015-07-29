(function() {
  'use strict';

  angular.module('searchbarDirective', ['searchFactory', 'LocalStorageModule'])
    .directive('crSearchbar', function(searchFactory, localStorageService) {
      return {
        restrict: 'A',
        controller: function($scope, $rootScope, $state, searchFactory, localStorageService) {

          // /* the actual calling for search results, resolved in app.js */
          // $scope.search = function(query) {
          //
          //   /* right now, queries are being stored in rootScope in order to Pass
          //   to ui-router's resolve object. TODO: change this to something cleaner. */
          //   $rootScope.searchQuery = query.title;
          //   $rootScope.searchType = query.searchType;
          //   if ($rootScope.searchType === "tag") {
          //     $state.go("tag", {
          //       "name": $rootScope.searchQuery
          //     });
          //   } else if ($rootScope.searchType === "user.username") {
          //     $state.go("profile", {
          //       "username": query.username
          //     });
          //   } else if ($rootScope.searchType === "title") {
          //     $state.go("post", {
          //       "id": query.id
          //     });
          //   }
          //
          //   else {
          //     $scope.query = [];
          //     $state.go('searchResults', null, {
          //       reload: true
          //     });
          //   }
          // };

        },
        link: function() {
          $('.ui.search')
            .search({
              apiSettings: {
                url: 'search/?q={query}'
              },
              type: 'category',
              searchDelay: 100,
              cache: true,
              maxResults: 8,
              minCharacters: 1
            });
        }
      };
    });
})();
