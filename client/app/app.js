/*
Handle setup of app, load in Angular dependencies, routing, etc.
*/

//TODO: use $templateCache to speed template loading


(function () {
  'use strict';
  window.foundationRoutes = [];
  angular.module('crouton', [
    // Angular libraries
    'ui.router',
    'ngAnimate',
    // Foundation UI components
    'foundation',
    // Routing with front matter
    'foundation.dynamicRouting',
    // Transitioning between views
    'foundation.dynamicRouting.animations',
    //shared
    'navbarDirective',
    //components
    'homeController',
    'signupController',
    'postController'
  ])
    .config(config)
    .run(run);

  // //dynamicRouting version:
  // config.$inject = ['$urlRouterProvider', '$locationProvider'];
  // function config($urlProvider, $locationProvider) {
  //   // Default to the index view if the URL loaded is not found
  //   $urlProvider.otherwise('/');
  //   // Use this to enable HTML5 mode
  //   $locationProvider.html5Mode({
  //     enabled: false,
  //     requireBase: false
  //   });
  //   // Use this to set the prefix for hash-bangs
  //   // Example: example.com/#!/page
  //   $locationProvider.hashPrefix('!');
  // }

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config($stateProvider, $urlRouterProvider) {
    // Default to the index view if the URL loaded is not found
    $urlRouterProvider.otherwise('/');
    //TODO: html5mode?
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/components/home/home.html',
        controller: 'homeController'
      })
      .state('post', {
        url: '/post/{id:int}',
        templateUrl: 'app/components/post/post.html',
        controller: 'postController'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/components/signup/signup.html',
        controller: 'signupController'
      });
  }

  function run() {
    // Enable FastClick to remove the 300ms click delay on touch devices
    FastClick.attach(document.body);
  }
})();
