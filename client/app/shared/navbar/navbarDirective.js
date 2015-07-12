angular.module('navbarDirective', [])
  .directive('crNavbar', function () {
    return {
      templateUrl: 'app/shared/navbar/navbar.html',
      controller: function ($scope) {
        $scope.user = {
          name: 'Michael Arnold',
          pic: "http://sciactive.com/pnotify/includes/github-icon.png"
        }
      },
      link: function ($scope, element, attrs) {
        //DOM manipulation stuff goes here
      }
    };
  });
