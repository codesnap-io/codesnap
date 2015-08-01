(function() {
  'use strict';
  angular.module('userFactory', [])

  .factory('userFactory', function($http, $state, authFactory) {
    var postResults = [];
    var userInfo = null;
    return {
      /* Get user information from server including:
         name, username, id, profile_photo_url, posts */
      getUser: function() {
        return $http({
          method: 'GET',
          url: '/user/info/',
          params: {
            user_id: window.localStorage.codeSnapJwtToken
          }
        });
      },

      getUserByUsername: function(username) {
        return $http({
          method: 'GET',
          url: '/user/profile/',
          params: {
            username: username
          }
        }).then(function(resp) {
          return resp.data;
        });
      },

      /* Send user id to server to remove user and associated posts from database */
      removeUser: function() {
        return $http({
          method: 'DELETE',
          url: '/user/info/',
          params: {
            user_id: localStorage.codeSnapJwtToken
          }
        });
      },

      /* Used on profile page to determine if user viewing page owns the page */
      ownsProfile: function(jwtToken, username) {
        return $http({
          method: 'GET',
          url: '/user/profile/owner',
          params: {
            username: username,
            user_id: localStorage.codeSnapJwtToken
          }
        }).then(function(resp) {
          return resp.data;
        });
      },

      getTopUserPosts: function(username) {
        return $http({
          method: 'GET',
          url: '/post/user/top',
          params: {
            username: username
          }
        }).then(function(resp) {
          return resp.data;
        });
      },

      getRecentUserPosts: function(username) {
        return $http({
          method: 'GET',
          url: '/post/user/recent',
          params: {
            username: username
          }
        }).then(function(resp) {
          return resp.data;
        });
      },

      newUser: function(username) {
        return $http({
          method: 'GET',
          url: '/user/new',
          params: {
            username: username
          }
        });
      },

      /* Sets the user information in the userFactory that is needed for handling comments, etc.
      This is being set in the navbar directive, as it is the first component tha is able to
      access the user token when it is available */
      setUserInfo: function(user) {
        /* save username as id to handle comment deleting */
        userInfo = {
          id: window.localStorage.codeSnapJwtToken,
          avatarUrl: user.profile_photo_url,
          name: user.name,
          username: user.username,
          token: user.token
        };
      },

      /* Download post markdown content from Github */
      getBio: function(url, loggedIn, profileUser, user) {

        if (!loggedIn) {
          return $http({
            method: 'GET',
            url: url
          }).then(function(resp) {
            return resp.data;
          });
        } else if (!!loggedIn) {

          var username = profileUser.username;
          var token = user.token;

          return $http({
            method: 'GET',
            headers: {
              "Authorization": "token " + token
            },
            url: "https://api.github.com/repos/" + username + "/codesnap.io/contents/bio.md"
          }).then(function(resp) {
            return window.atob(resp.data.content);
          });

        }
      },

      getUserInfo: function() {
        return userInfo;
      },



      setPostResult: function(result) {
        postResults = result;
      },
      getPostResult: function() {
        return postResults;
      }

    };
  });
})();
