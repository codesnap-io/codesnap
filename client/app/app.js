/*
Handle setup of app, load in Angular dependencies, routing, etc.
*/

var crouton = angular.module('crouton', ['ui.router']);

crouton.config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'component/home/home.html',
        controller: 'homeController'
      });
  }
]);

//TODO: use $templateCache to speed template loading
