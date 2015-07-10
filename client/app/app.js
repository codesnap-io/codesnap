/*
Handle setup of app, load in Angular dependencies, routing, etc.
*/

//TODO: use $templateCache to speed template loading


(function () {
  'use strict';
  angular.module('crouton', [
    // Angular libraries
    'ui.router',
    'ngAnimate',
    // Foundation UI components
    'foundation',
    // Routing with front matter
    'foundation.dynamicRouting',
    // Transitioning between views
    'foundation.dynamicRouting.animations'
  ])
    .config(config)
    .run(run);
  config.$inject = ['$urlRouterProvider', '$locationProvider'];

  function config($stateProvider, $urlRouterProvider) {
    // Default to the index view if the URL loaded is not found
    $urlRouterProvider.otherwise('/');
    //TODO: html5mode?
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'component/home/home.html',
        controller: 'homeController'
      });
  }

  function run() {
    // Enable FastClick to remove the 300ms click delay on touch devices
    FastClick.attach(document.body);
  }
})();
