(function() {
  'use strict';
  angular.module('authFactory', [])
  .factory('authFactory', function($http, $state) {
    return {
      checkAuth: function(callback) {
        return $http({
          method: 'GET',
          url: 'auth/checkauth'
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

      /* When user logs out, remove the session from the server.  Upon successfully removing session, remove token from localStorage and redirect to signup page. */
      logout: function() {
        $http({
          method: 'GET',
          url: 'auth/logout'
        }).then(function(res) {
          if(res.data) {
            delete window.localStorage.jwtToken;
            $state.go('signup');
          }
        });
      }
    };
  });
})();
