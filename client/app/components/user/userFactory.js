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
          console.log(resp.data)
          //address issue where database dropped while logged in, causing token to be out of date.
          if (resp.data === "Invalid User Id") { //not sure if correct string
            delete window.localStorage.jwtToken;
            $state.go('signup');
          };
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
