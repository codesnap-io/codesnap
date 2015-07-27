(function() {
  'use strict';

  angular.module('searchbarDirective', ['searchFactory', 'LocalStorageModule'])
    .directive('crSearchbar', function(searchFactory, localStorageService) {
      return {
        restrict: 'A',
        controller: function($scope, $rootScope, $state, searchFactory, localStorageService) {
          $scope.query = [];


          /* we could cookie cache the post titles once DB size gets large */
          // $scope.results = localStorageService.cookie.get('postData');

          /* Get all metadata and map properly */

          if (!$scope.results) {
            // console.log("Look for search results");
            searchFactory.getAllData()
              .then(function(results) {
                var authors = results.data.authors.map(function(item) {
                  return {
                    title: item.name + " - " + item.username,
                    searchType: 'user.username',
                    username: item.username
                  };
                });

                var titles = results.data.titles.map(function(item) {
                  return {
                    title: item.title,
                    id: item.id,
                    searchType: 'title'
                  };
                });

                var tags = results.data.tags.map(function(item) {
                  return {
                    title: item,
                    searchType: 'tag'
                  };
                });

                $scope.results = authors.concat(titles, tags);
                $('.ui.search')
                  .search({
                    source: $scope.results,
                    maxResults: 5,
                    onSelect: function(result, response) {
                      $scope.search(result);
                    }
                  });
              });
          }



          /* the actual calling for search results, resolved in app.js */
          $scope.search = function(query) {

            /* right now, queries are being stored in rootScope in order to Pass
            to ui-router's resolve object. TODO: change this to something cleaner. */
            $rootScope.searchQuery = query.title;
            $rootScope.searchType = query.searchType;
            if ($rootScope.searchType === "tag") {
              $state.go("tag", {
                "name": $rootScope.searchQuery
              });
            } else if ($rootScope.searchType === "user.username") {
              $state.go("profile", {
                "username": query.username
              });
            } else if ($rootScope.searchType === "title") {
              $state.go("post", {
                "id": query.id
              });
            }

            else {
              $scope.query = [];
              $state.go('searchResults', null, {
                reload: true
              });
            }
          };

          /* TODO: one future option for search autocomplete will be to request objects
          every few seconds. this ui element has a refresh delay attr built in. */
          // $scope.refreshSearch = function(query) {
          //   var params = {query: query};
          //   return $http.get(
          //     'path/to/thing',
          //     {params: params}
          //   ).then(function(response) {
          //     $scope.results = response.data.results
          //   });
          // };

        }
      };
    });
    //filter searchable objects to match cases and potentially multiple properties
    // .filter('propsFilter', function() {
    //   return function(items, props) {
    //     var out = [];
    //
    //     if (angular.isArray(items)) {
    //       items.forEach(function(item) {
    //         var itemMatches = false;
    //
    //         var keys = Object.keys(props);
    //         for (var i = 0; i < keys.length; i++) {
    //           var prop = keys[i];
    //           var text = props[prop].toLowerCase();
    //           if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
    //             itemMatches = true;
    //             break;
    //           }
    //         }
    //
    //         if (itemMatches) {
    //           out.push(item);
    //         }
    //       });
    //     } else {
    //       // Let the output be the input untouched
    //       out = items;
    //     }
    //
    //     return out;
    //   };
    //
    // });


})();
