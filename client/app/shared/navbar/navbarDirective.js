(function() {
  'use strict';

  angular.module('navbarDirective', ['authFactory', 'userFactory'])

  .directive('crNavbar', function() {
    return {
      restrict: "E",
      templateUrl: "app/shared/navbar/navbar.html",
      controller: function($scope, $rootScope, authFactory, userFactory) {
        $scope.logout = function() {
          authFactory.logout();
        };



        //Initially showing navbar. TODO: change this according to proper user path
        $scope.showNav = true;

        //listening during state change on whether to hide navbar
        $rootScope.$on('navbar', function(event, data) {
          $scope.showNav = data;
        });



        /* watch for jwt token, and when it loads, load user information into root scope */
        $scope.$watch(function() {
          return window.localStorage.codeSnapJwtToken;
        }, function(token) {

          if (!$rootScope.user && !!token) {
            userFactory.getUser()
              .then(function(resp) {
                //address issue where database dropped while logged in, causing token to be out of date.
                if (resp.data === "Invalid user id.\n") {
                  console.log("user log in weirdness detected. Deleting token and redirecting to /signup.");
                  delete window.localStorage.codeSnapJwtToken;
                  $state.go('signup');
                }
                return resp.data;
              })
              .then(function(user) {
              $rootScope.user = user;
              $scope.loggedIn = !!user;
              $scope.newPostUrl = "/post/add?username=" + user.username;
            });
          }
        });
      },
      link: function() {
        //load semantic ui dropdown
        setTimeout(function() {
          $('.ui.dropdown')
            .dropdown();
        }, 100);
      }
    };
  });

})();
