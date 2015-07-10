angular.module('crouton', [])
  .directive('navbar', function () {
    return {
      templateUrl: 'navbar.html',
      scope: {
        current: '@'
      },
      link: function ($scope, element, attrs) {
        //DOM manipulation stuff goes here
      }
    }
  });
