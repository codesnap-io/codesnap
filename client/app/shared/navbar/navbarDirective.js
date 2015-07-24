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
        })



        /* watch for jwt token, and when it loads, load user information into root scope */
        $scope.$watch(function() {
          return window.localStorage.jwtToken;
        }, function(token) {

          if (!$rootScope.user && !!token) {
            userFactory.getUser()
              .then(function(user) {
                $rootScope.user = user;
                $scope.loggedIn = !!user;
                $scope.newPostUrl = "http://127.0.0.1:8000/post/add?username=" + user.username;
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
