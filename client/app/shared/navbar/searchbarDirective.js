(function() {
  'use strict';

  angular.module('searchbarDirective', ['searchFactory', 'LocalStorageModule'])
    .directive('crSearchbar', function (searchFactory, localStorageService) {
      return {
        restrict: 'A',
        controller: function ($scope, $rootScope, $state, searchFactory, localStorageService) {

        $scope.results = [];
        $scope.query = {};


        /* determine groupings in search bar by type */
        $scope.searchType = function (item){
          if (item.searchType === 'title')
              return 'Titles';
          if (item.searchType === 'tag')
              return 'Tags';
          if (item.searchType === 'users.name')
              return 'Author';
        };



        $scope.results = localStorageService.cookie.get('postData');

        /* Get all metadata and map properly */

        if (!$scope.results) {
          console.log('getting data');
          searchFactory.getAllData(function(results) {
              var authors = results.authors.map(function(item) {
                return {name: item, searchType: 'users.name'};
              });

              var titles = results.titles.map(function(item) {
                return {name: item, searchType: 'title'};
              });

              var tags = results.titles.map(function(item) {
                return {name: item, searchType: 'tag'};
              });

              localStorageService.cookie.set('postData', authors.concat(titles, tags), 1);
              $scope.results = localStorageService.cookie.get('postData');;
          });
        }



        /* the actual calling for search results, resolved in app.js */
        $scope.search = function(query) {
          /* right now, queries are being stored in rootScope in order to Pass
          to ui-router's resolve object. TODO: change this to something cleaner. */
          $rootScope.searchQuery = query[0].name;
          $rootScope.searchType = query[0].searchType;
          $state.go('searchResults');
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
    })
    //filter searchable objects to match cases and potentially multiple properties
    .filter('propsFilter', function() {
      return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
          items.forEach(function(item) {
            var itemMatches = false;

            var keys = Object.keys(props);
            for (var i = 0; i < keys.length; i++) {
              var prop = keys[i];
              var text = props[prop].toLowerCase();
              if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                itemMatches = true;
                break;
              }
            }

            if (itemMatches) {
              out.push(item);
            }
          });
        } else {
          // Let the output be the input untouched
          out = items;
        }

        return out;
      };
    });


})();
