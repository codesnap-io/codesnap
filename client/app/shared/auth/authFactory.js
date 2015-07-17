angular.module('authFactory', [])

.factory('authFactory', function($http, $state) {
  return {
    checkAuth: function(callback) {
      $http({
        method: 'GET',
        url: 'auth/checkauth'
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
    },

    logout: function() {
      delete window.localStorage.jwtToken;
      $state.go('signup');
    }
  };
});
