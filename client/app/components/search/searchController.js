(function() {
  'use strict';
  angular.module('searchController', [])

  .controller('searchController', function ($scope, searchResults, $rootScope) {
    $scope.searchType = $rootScope.searchType;
    $scope.searchQuery = $rootScope.searchQuery;
    $scope.results = searchResults;
  });
})();
