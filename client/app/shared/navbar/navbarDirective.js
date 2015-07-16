angular.module('navbarDirective', ['authFactory', 'userFactory'])
  .directive('crNavbar', function () {
    return {
      templateUrl: 'app/shared/navbar/navbar.html',
      controller: function ($scope, $rootScope, authFactory, userFactory) {
        $scope.loggedIn = $rootScope.loggedIn;

        $scope.logout = function() {
          return authFactory.logout();
        };

        userFactory.getUser(localStorage.userId)
          .then(function (user) {
            $scope.user = user;
            $scope.newPostUrl = "https://github.com/" + user.username + "/crouton.io/new/master/posts";
          });
      },
      link: function ($scope, element, attrs) {
        //DOM manipulation stuff goes here
      }
    };
  });
