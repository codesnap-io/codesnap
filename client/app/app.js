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
<<<<<<< HEAD
    'postFactory',
    'userController',
    //markdown parser
    'mdParserDirective'
=======
    'userController',
    'authFactory'
>>>>>>> # This is a combination of 2 commits.
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
<<<<<<< HEAD
        url: '/',
        views: {
          content: {
            templateUrl: 'app/components/home/home.html',
            controller: 'homeController'
          },
          subnav: {
            templateUrl: 'app/shared/subnavs/homeSubnav.html',
            controller: 'homeController'
=======
        url: '/?token',
        templateUrl: 'app/components/home/home.html',
        controller: 'homeController',
        resolve: {
          authUser: function($stateParams, $location, authFactory) {
            if (!!$stateParams.token) {
              /* Check for valid token */
              authFactory.checkNewToken($stateParams.token, function(valid) {
                /* If token is valid, set it to local storage */
                if (valid) {
                  localStorage.jwtToken = $stateParams.token;
                /* If token is not valid, remove existing token if it exists as a security measure */
                } else {
                  authFactory.removeToken();
                }      

                /* Redirect back to home page so user never sees parameters */
                window.location = "/";          
              });
            }            
>>>>>>> # This is a combination of 2 commits.
          }
        }
      })
      .state('post', {
        url: '/post/{id:int}',
        views: {
          content: {
            templateUrl: 'app/components/post/post.html',
            controller: 'postController'
          }
        }
      })
      .state('signup', {
        url: '/signup',
        views: {
          content: {
            templateUrl: 'app/components/signup/signup.html',
            controller: 'signupController'
          }
        }
      })
      .state('profile', {
        url: '/profile',
        views: {
          content: {
            templateUrl: 'app/components/user/user.html',
            controller: 'userController'
          }
        }
      });
  }

  function run() {
    // Enable FastClick to remove the 300ms click delay on touch devices
    FastClick.attach(document.body);

  }

  //hacky fix because we're not using Foundation's routing system
  window.foundationRoutes = [];
})();
