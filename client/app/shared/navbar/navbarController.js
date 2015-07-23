(function() {
  'use strict';

  angular.module('navbarController', ['authFactory', 'userFactory'])

  .controller('navbarController', function($scope, $rootScope, authFactory, userFactory, $state) {

    $scope.logout = function() {
      authFactory.logout();
    };


    $scope.$watch(function() {
      return window.localStorage.jwtToken;
    }, function(token) {

      if (!$rootScope.user && !!token) {
        userFactory.getUser()
          .then(function(user) {
            $rootScope.user = user;
            $scope.loggedIn = !!user;
            $scope.newPostUrl = "https://github.com/" + user.username + "/crouton.io/new/master/posts";
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
