(function() {
  'use strict';

  angular.module('searchbarDirective', [])
    .directive('crSearchbar', function () {
      return {
        restrict: 'A',
        controller: function ($scope, $rootScope, $state) {
        $scope.query = {};

        $scope.searchType = function (item){
          if (item.searchType === 'title')
              return 'Titles';
          if (item.searchType === 'tag')
              return 'Tags';
          if (item.searchType === 'author')
              return 'Author';
        };

        // $scope.refreshSearch = function(query) {
        //   var params = {query: query};
        //   return $http.get(
        //     'path/to/thing',
        //     {params: params}
        //   ).then(function(response) {
        //     $scope.results = response.data.results
        //   });
        // };


        $scope.search = function(query) {
          /* right now, queries are being stored in rootScope in order to Pass
          to ui-router's resolve object. TODO: change this to something cleaner. */
          $rootScope.searchQuery = query[0].name;
          $rootScope.searchType = query[0].searchType;
          $state.go('searchResults');
        };


        $scope.results = [{name: "Javascript", searchType: "tag"},
        {name: "Ruby", searchType: "tag"},
        {name: "Lisp", searchType: "tag"},
        {name: "Chris Clayman", searchType: "users.name"},
        {name: "Michael A.", searchType: "users.name"},
        {name: "Sat K.", searchType: "users.name"},
        {name: "Ben S.", searchType: "users.name"},
        {name: "Default Title", searchType: "title"}];

        },
        link: function ($scope, element, attrs) {



          //DOM manipulation stuff goes here
        }
      };
    })
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
