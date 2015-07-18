(function() {
  'use strict';
  angular.module('tagFactory', [])

.factory('tagFactory', function($http) {
  return {
    getTags: function() {
      return $http({
      method: 'GET',
      url: '/tags/',
    }).then(function(resp) {
        return resp.data;
      });
    }
  };
  });
})();