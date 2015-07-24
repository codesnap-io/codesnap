(function() {
  'use strict';
  angular.module('userFactory', [])

  .factory('userFactory', function($http, $state, authFactory) {
    return {
      /* Get user information from server including:
         name, username, id, profile_photo_url, posts */
      getUser: function() {
        return $http({
          method: 'GET',
          url: '/user/info/',
          params: {
            user_id: localStorage.codeSnapJwtToken
          }
        }).then(function(resp) {
          //address issue where database dropped while logged in, causing token to be out of date.
          if (resp.data === "Invalid user id.\n") {
            console.log("user log in weirdness detected. Deleting token and redirecting to /signup.");
            delete window.localStorage.codeSnapJwtToken;
            $state.go('signup');
          }
          return resp.data;
        });
      },

      /* Send user id to server to remove user and associated posts from database */
      removeUser: function() {
        return $http({
          method: 'DELETE',
          url: '/user/info/',
          params: {
            user_id: localStorage.codeSnapJwtToken
          }
        });
      }

    };
  });
})();
