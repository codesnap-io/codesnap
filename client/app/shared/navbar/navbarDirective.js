angular.module('navbarDirective', ['authFactory', 'userFactory'])
  .directive('crNavbar', function () {
    return {
      controller: function ($scope, $rootScope, authFactory, userFactory) {

        /* determines whether user is logged in. see app.js for root scope assignment */
        $scope.loggedIn = $rootScope.loggedIn;

        $scope.logout = function() {
          return authFactory.logout();
        };

        /* sets new post url for link according to logged in user */
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
