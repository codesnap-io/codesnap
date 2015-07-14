angular.module('authFactory', [])

.factory('authFactory', function($http) {
  return {
    /* Validates a token before saving it to localStorage and potentially overwriting an existing token.  This is to prevent users from typing in invalid parameters into the url */
    checkNewToken: function(token, callback) {
      $http({
        method: 'POST',
        url: 'auth/checktoken',
        data: {
          jwtToken: token
        }
      }).then(function(res) {
        callback(res.data);
      });

    },

    /* Returns true or false depending on whether the current user is logged in. */
    loggedIn: function() {
      return !!window.localStorage.jwtToken;
    },

    /* Removes jwtToken from localStorage.  This function was built to help with logout */
    removeToken: function() {
      delete window.localStorage.jwtToken;
    }
  };
});
