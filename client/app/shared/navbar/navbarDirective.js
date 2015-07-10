angular.module('crouton', [])
  .directive('crNavbar', function () {
    return {
      templateUrl: 'app/shared/navbar/navbar.html',
      scope: {
        current: '@'
      },
      link: function ($scope, element, attrs) {
        //DOM manipulation stuff goes here
      }
    }
  });
