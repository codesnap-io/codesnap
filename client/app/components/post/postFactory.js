(function() {
  'use strict';

  angular.module('postFactory', [])

  .factory('postFactory', function ($http) {
    return {
      /* Retrieves data about all posts from server */
      getPostsData: function () {
        return $http({
          method: 'GET',
          url: '/post/info/all'
        }).then(function (resp) {
          console.log("posts data: ", resp);
          return resp.data;
        });
      },
      /* Retrieves data for one post (based on given post id) */
      getPostData: function (id) {
        return $http({
          method: 'GET',
          url: '/post/info',
          params: {
            post_id: id
          }
        }).then(function (resp) {
          return resp.data;
        });
      },

      /* Download post markdown content from Github */
      getPostMarkdown: function (url) {
        return $http({
          method: 'GET',
          url: url
        }).then(function (resp) {
          return resp.data;
        });
      },

      /* Returns true if the user likes the post, otherwise returns false. */
      getLikeStatus: function(userId, postId) {
        return $http({
          method: 'GET',
          url: '/like/toggle',
          params: {
            user_id: userId,
            post_id: postId
          }
        }).then(function (resp) {
          return resp.data;
        });
      },

      /* Returns true if user likes post after toggle, otherwise returns false. */
      toggleLike: function(userId, postId) {
        return $http({
          method: 'GET',
          url: '/like/status',
          params: {
            user_id: userId,
            post_id: postId
          }
        }).then(function (resp) {
          return resp.data;
        });
      }
    };
  });
})();
