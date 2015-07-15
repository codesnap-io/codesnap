angular.module('postFactory', [])

.factory('postFactory', function ($http) {
  return {
    getPostData: function (id) {
      console.log("id: ", id);
      return $http({
        method: 'GET',
        url: '/post/info',
        params: {
          post_id: id
        }
      }).then(function (resp) {
        // console.log("getPostData resp: ", resp);
        return resp.data;
      });
    },
    getPost: function (url) {
      return $http({
        method: 'GET',
        url: url
      }).then(function (resp) {
        // console.log("getPost resp: ", resp.data);
        return resp.data;
      });
    }
  };
});
