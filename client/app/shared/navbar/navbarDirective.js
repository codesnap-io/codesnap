angular.module('navbarDirective', ['authFactory'])
  .directive('crNavbar', function () {
    return {
      templateUrl: 'app/shared/navbar/navbar.html',
      controller: function ($scope, $rootScope, authFactory) {
        $scope.loggedIn = $rootScope.loggedIn;

        $scope.logout = function() {
          return authFactory.logout();
        };

        $scope.user = {
          name: 'Michael Arnold',
          pic: "https://d262ilb51hltx0.cloudfront.net/fit/c/80/80/0*xZl_kLRGSfBND02C.jpg"
        };
      },
      link: function ($scope, element, attrs) {
        //DOM manipulation stuff goes here
      }
    };
  });
