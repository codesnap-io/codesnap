angular.module('navbarDirective', ['authFactory', 'userFactory'])
  .directive('crNavbar', function () {
    return {
      controller: function ($scope, $rootScope, authFactory, userFactory) {

        /* determines whether user is logged in. see app.js for root scope assignment */
        $scope.loggedIn = $rootScope.loggedIn;


        $scope.logout = function() {
          return authFactory.logout();
        };


        $scope.$watch(function() {
          return  window.localStorage.jwtToken;
        }, function(token) {

          if (!$scope.user && !!token) {
            userFactory.getUser()
            .then(function (user) {

              $scope.user = user;
              $scope.loggedIn = !!user;
              // console.log($scope.user);
              // console.log("Logged In: ", $scope.loggedIn);

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
