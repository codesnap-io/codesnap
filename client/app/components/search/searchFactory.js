(function() {
  'use strict';

  angular.module('searchFactory', [])
    .factory('searchFactory', function($http) {
      return {
        searchPostsByTag: function(tag) {
          return $http({
            method: 'GET',
            url: 'api/search/tag',
            params: {
              tag: tag
            }
          }).then(function(resp) {
            console.log(resp.data);
            return resp.data;
          });
        }
      };
    });

})();
