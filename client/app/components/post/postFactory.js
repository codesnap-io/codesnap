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

      /* Download post markdown content from Github*/
      getPostMarkdown: function (url) {
        return $http({
          method: 'GET',
          url: url
        }).then(function (resp) {
          return resp.data;
        });
      }
    };
  });
})();
