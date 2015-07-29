(function() {
  'use strict';

  angular.module('searchFactory', [])
    .factory('searchFactory', function($http) {
      return {
        searchPosts: function(searchQuery, searchType) {
          console.log('searching posts with ' + searchQuery + " and " + searchType);
          return $http({
            method: 'GET',
            url: '/search/results',
            params: {
              searchQuery: searchQuery,
              searchType: searchType
            }
          }).then(function(resp) {
            return resp.data;
          });
        }

        // getAllData: function(callback) {
        //   return $http({
        //     method: 'GET',
        //     url: 'search/all'
        //   });
        // }
      };
    });

})();
