(function() {
  'use strict';

  angular.module('navbarDirective', ['authFactory', 'userFactory'])
    .directive('crNavbar', function () {
      return {
        controller: function ($scope, $rootScope, authFactory, userFactory, $state) {


        $scope.logout = function() {
          return authFactory.logout();
        };

        $scope.$watch(function() {
          return window.localStorage.jwtToken;
        }, function(token) {

          if (!$scope.user && !!token) {
            userFactory.getUser()
            .then(function (user) {
              $scope.user = user;
              $scope.loggedIn = !!user;
              $scope.newPostUrl = "https://github.com/" + user.username + "/crouton.io/new/master/posts";
              });
            }
          });

        },
        link: function ($scope, element, attrs) {
          //DOM manipulation stuff goes here
        }
      };
    });

})();
