/*
Handle setup of app, load in Angular dependencies, routing, etc.
*/

//TODO: use $templateCache to speed template loading

(function () {
  'use strict';
  angular.module('crouton', [
    // Angular libraries
    'ui.router',
    // 'ngAnimate',
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
    'postController',
    'postFactory',
    'userController',
    'authFactory',
    //markdown parser
    'mdParserDirective'
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
        authenticate: false,
        views: {
          content: {
            templateUrl: 'app/components/home/home.html',
            controller: 'homeController'
          },
          subnav: {
            templateUrl: 'app/shared/subnavs/homeSubnav.html',
            controller: 'homeController'
          }
        }
      })
      .state('post', {
        url: '/post/{id:int}',
        authenticate: false,
        views: {
          content: {
            templateUrl: 'app/components/post/post.html',
            controller: 'postController'
          }
        }
      })
      .state('signup', {
        authenticate: false,
        url: '/signup',
        views: {
          content: {
            templateUrl: 'app/components/signup/signup.html',
            controller: 'signupController'
          }
        }
      })
      .state('profile', {
        authenticate: true,
        url: '/profile',
        views: {
          content: {
            templateUrl: 'app/components/user/user.html',
            controller: 'userController'
          }
        }
      });
  }

  function run($rootScope, $state, authFactory) {
    // Enable FastClick to remove the 300ms click delay on touch devices
    FastClick.attach(document.body);



    /* Event listener for state change, and checks for authentication via authFactory
    Redirects is false returned  */
    $rootScope.$on("$stateChangeStart",
        function(event, toState, toParams, fromState, fromParams) {
            $rootScope.loggedIn = true;
            if (toState.authenticate && !authFactory.loggedIn()) {
                $rootScope.loggedIn = false;
                $state.go("signup");
                event.preventDefault();
            }
    });



  }

  //hacky fix because we're not using Foundation's routing system
  window.foundationRoutes = [];
})();
