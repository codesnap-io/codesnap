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
      //infinite scroll
      'infinite-scroll',
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
      'postSubnavDirective',
      'profileSubnavDirective',
      'navbarDirective',
      'footerDirective'
    ])
    .config(config)
    .run(run);

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

  function config($stateProvider, $urlRouterProvider, $locationProvider) {
    // Default to the index view if the URL loaded is not found
    $urlRouterProvider.otherwise('/');
    //
    // $locationProvider.html5Mode({
    //   enabled:true
    // });
    //TODO: html5mode?
    $stateProvider
      .state('home', {
        url: '/',
        authenticate: false,
        views: {
          content: {
            templateUrl: 'app/components/home/home.html',
            controller: 'homeController'
          }
        },
        resolve: {
          /* If a user is not authenticated in the client, check to see if user is authenticated in the session.  If user is authenticated in the session, save that user's encoded id in localStorage. */
          authUser: function(authFactory) {
            if (!localStorage.codeSnapJwtToken) {
              authFactory.checkAuth()
                .then(function(res) {
                  if (!!res.data) {
                    localStorage.codeSnapJwtToken = res.data;
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
            //empty out search bar
            $('.search-box input').val('');

            return postFactory.getPostData($stateParams.id);
          },
          getLikeStatus: function($rootScope, postFactory, $stateParams) {
            if ($rootScope.loggedIn) {
              return postFactory.getLikeStatus(localStorage.codeSnapJwtToken, $stateParams.id);
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
            //empty out search bar
            $('.search-box input').val('');
            return searchFactory.searchPostsByTag($rootScope.searchQuery);
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
          //empty out search bar
          $('.search-box input').val('');

          return searchFactory.searchPostsByTag($stateParams.name)
            .then(function(posts) {
              tagFactory.setPostResult(posts);
            });
        },
        pattern: function(tagFactory, $stateParams) {
          return tagFactory.getTagPattern($stateParams.name);
        }
      }
    })
    .state('profile', {
      authenticate: false,
      url: '/profile/:username?first',
      views: {
        content: {
          templateUrl: 'app/components/profile/profile.html',
          controller: 'profileController'
        },
        subnav: {
          templateUrl: 'app/shared/subnavs/profileSubnav.html'
        }
      },
      resolve: {
        /* If a user is not authenticated in the client, check to see if user is authenticated in the session.  If user is authenticated in the session, save that user's encoded id in localStorage. */
        authUser: function(authFactory, $rootScope) {
          if (!localStorage.codeSnapJwtToken) {
            authFactory.checkAuth()
              .then(function(res) {
                if (!!res.data) {
                  localStorage.codeSnapJwtToken = res.data;
                  $rootScope.newUser = true;
                }
              });
          }
        },
        fetchRecentPosts: function(userFactory, $stateParams) {
          /* Empty out search bar */
          $('.search-box input').val('');
          return userFactory.getRecentUserPosts($stateParams.username)
          .then(function(posts) {
            userFactory.setPostResult(posts);
          });
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
      if (document.onkeydown !== null) {
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

    //sticky subnav and tag list functionality
    $(window).scroll(function() {
      if($('.sticky').is(':visible')) {
        if ($(window).scrollTop() >= 71) {
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
      }
    });
  }
})();
