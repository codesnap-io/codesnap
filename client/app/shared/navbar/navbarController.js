(function() {
  'use strict';

  angular.module('navbarController', ['authFactory', 'userFactory'])

      .controller('navbarController', function ($scope, $rootScope, authFactory, userFactory, $state) {

        $scope.logout = function() {
          authFactory.logout();
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
                  userFactory.setCurrentUser($scope.user);
                });
          }
        });


        //load semantic ui dropdown
        setTimeout(function() {
          $('.ui.dropdown')
            .dropdown();
        }, 100);



      });

})();
