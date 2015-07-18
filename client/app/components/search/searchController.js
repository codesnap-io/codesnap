(function() {
  'use strict';
  angular.module('searchController', [])

  .controller('searchController', function ($scope, searchResults) {
    $scope.results = searchResults;
  });
})();
