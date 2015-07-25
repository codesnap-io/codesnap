/*
Handle setup of app, load in Angular dependencies, routing, etc.
*/

(function() {
  'use strict';
  angular.module('codesnap', [
      // Angular libraries
      'ui.router',
      //markdown parser
      'mdParserDirective',
      //select for search
      'ui.select',
      'ngSanitize',
      //localStorage
      'LocalStorageModule',
      //components
      'homeController',
      'signupController',
      'postController',
      'postFactory',
      'authFactory',
      'searchFactory',
      'searchController',
      'tagController',
      'tagFactory',
      'faqController',
      'profileController',
      //shared directives
      'userController',
      'userFactory',
      'searchbarDirective',
      'homeSubnavDirective',
      'postSubnavDirective',
      'navbarDirective'
    ])
    .config(config)
    .run(run);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config($stateProvider, $urlRouterProvider) {
    // console.log(localStorageServiceProvider);
    // //prefix local storage variables for safety and profit
    // localStorageServiceProvider
    // .setPrefix('codesnap');



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
        },
        resolve: {
          /* If a user is not authenticated in the client, check to see if user is authenticated in the session.  If user is authenticated in the session, save that user's encoded id in localStorage. */
          authUser: function(authFactory) {
            if (!localStorage.jwtToken) {
              authFactory.checkAuth()
                .then(function(res) {
                  if (!!res.data) {
                    localStorage.jwtToken = res.data;
                  }
                });
            }
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
          },
          subnav: {
            templateUrl: 'app/shared/subnavs/postSubnav.html'
          }
        },
        resolve: {
          getPost: function(postFactory, $stateParams) {
            return postFactory.getPostData($stateParams.id)
          },
          getLikeStatus: function($rootScope, postFactory, $stateParams) {
            if ($rootScope.loggedIn) {
              return postFactory.getLikeStatus(localStorage.jwtToken, $stateParams.id);
            }
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
      .state('account', {
        authenticate: true,
        url: '/account',
        views: {
          content: {
            templateUrl: 'app/components/account/account.html',
            controller: 'userController'
          }
        }
      })
      .state('searchResults', {
        authenticate: false,
        url: '/searchresults',
        views: {
          content: {
            templateUrl: 'app/components/search/searchresults.html',
            controller: 'searchController'
          }
        },
        resolve: {
          searchResults: function(searchFactory, $rootScope) {
            return searchFactory.searchPosts($rootScope.searchQuery, $rootScope.searchType);
          }
        }
      })
      .state('faq', {
        authenticate: false,
        url: '/faq',
        views: {
          content: {
            templateUrl: 'app/components/faq/faq.html',
            controller: 'faqController'
          }
        }
      })
    .state('tag', {
      authenticate: false,
      url: '/tag/:name',
      views: {
        content: {
          templateUrl: 'app/components/tag/tag.html',
          controller: 'tagController'
        }
      },
      resolve: {
        searchPosts: function(searchFactory, tagFactory, $stateParams) {
          return searchFactory.searchPosts($stateParams.name, 'tag')
            .then(function(posts) {
              tagFactory.setPostResult(posts);
            })
        }
      }
    })
    .state('profile', {
      authenticate: false,
      url: '/profile/:username',
      views: {
        content: {
          templateUrl: 'app/components/profile/profile.html',
          controller: 'profileController'
        }
      },
      resolve: {
        searchPosts: function(searchFactory, userFactory, $stateParams) {
          return searchFactory.searchPosts($stateParams.username, 'users.username')
            .then(function(posts) {
              userFactory.setPostResult(posts);
            })
        }
      }
    });

  }

  function run($rootScope, $state, authFactory) {

    //remove "back" browser functionality from backspace key
    function killBackSpace(e) {
      e = e ? e : window.event;
      var t = e.target ? e.target : e.srcElement ? e.srcElement : null;
      if (t && t.tagName && (t.type && /(password)|(text)|(file)/.test(t.type.toLowerCase())) || t.tagName.toLowerCase() === 'textarea') {
        return true;
      }
      var k = e.keyCode ? e.keyCode : e.which ? e.which : null;
      if (k === 8) {
        if (e.preventDefault) {
          e.preventDefault();
        }
        return false;
      }
      return true;
    }

    if (typeof document.addEventListener !== 'undefined') {
      document.addEventListener('keydown', killBackSpace, false);
    } else if (typeof document.attachEvent !== 'undefined') {
      document.attachEvent('onkeydown', killBackSpace);
    } else {
      if (document.onkeydown != null) {
        var oldOnkeydown = document.onkeydown;
        document.onkeydown = function(e) {
          oldOnkeydown(e);
          killBackSpace(e);
        };
      } else {
        document.onkeydown = killBackSpace;
      }
    }

    // Enable FastClick to remove the 300ms click delay on touch devices
    FastClick.attach(document.body);
    $rootScope.currentUser = {};

    /* Event listener for state change, and checks for authentication via authFactory
    Redirects is false returned  */
    $rootScope.$on("$stateChangeStart",
      function(event, toState, toParams, fromState, fromParams) {

        //let the client know at the root scope whether user is actually logged in.
        //This will allow certain elements to hide and show based on user status
        $rootScope.loggedIn = authFactory.loggedIn();

        //redirect to signup if state destination needs auth and if user is not logged in.
        if (toState.authenticate && !authFactory.loggedIn()) {
          $state.go("signup");
          event.preventDefault();
        }
      });

    $(window).scroll(function() {
      if ($(window).scrollTop() >= 87) {
        $('.sticky').css('position', 'fixed');
        $('.sticky').each(function() {
          var offset = ($(this).attr('offset') || '0px');
          $(this).css('top', offset);
        });
        $('.page-content').find('.content').css('margin-top', '55px');
      } else {
        $('.sticky').css('position', 'static');
        $('.page-content').find('.content').css('margin-top', '0px');
      }
    });
  }
})();
