angular.module('postFactory', [])

.factory('postFactory', function ($http) {
  return {
    getPostsData: function () {
      return $http({
        method: 'GET',
        url: '/post/info'
      }).then(function (resp) {
        return resp.data;
      });
    },
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
    getPost: function (url) {
      return $http({
        method: 'GET',
        url: url
      }).then(function (resp) {
        return resp.data;
      });
    }
  };
});
