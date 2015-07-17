(function() {
  'use strict';
  angular.module('userFactory', [])

.factory('userFactory', function($http, authFactory) {
  return {
    /* Get user information from server including:
       name, username, id, profile_photo_url, posts */
    getUser: function() {
      return $http({
      method: 'GET',
      url: '/user/info/',
      params: {
        user_id: localStorage.jwtToken
      }
    }).then(function(resp) {
        return resp.data;
      });
    },

    /* Send user id to server to remove user and associated posts from database */
    removeUser: function() {
      return $http({
        method: 'DELETE',
        url: '/user/info/',
        params: {
          user_id: localStorage.jwtToken
        }
      });
    }

    };
  });
})();
