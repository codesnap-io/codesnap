angular.module('navbarDirective', ['authFactory', 'userFactory'])
  .directive('crNavbar', function () {
    return {
      controller: function ($scope, $rootScope, authFactory, userFactory) {

        /* determines whether user is logged in. see app.js for root scope assignment */
        $scope.loggedIn = $rootScope.loggedIn;


        $scope.logout = function() {
          return authFactory.logout();
        };


        // $scope.$watch('$rootScope.loggedIn', function() {
          $scope.loggedIn = $rootScope.loggedIn;
          if ($rootScope.loggedIn) {
            userFactory.getUser()
            .then(function (user) {
              console.log(user);
              $scope.user = user;

              $scope.newPostUrl = "https://github.com/" + user.username + "/crouton.io/new/master/posts";
            });
          }
        // });

      },
      link: function ($scope, element, attrs) {
        //DOM manipulation stuff goes here
      }
    };
  });
