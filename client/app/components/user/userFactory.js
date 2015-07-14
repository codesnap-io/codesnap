angular.module('userFactory', [])

.factory('userFactory', function($http) {
  return {
    getUser: function(user) {
      return $http({
      method: 'GET',
      url: '/user/info/?user_id=' + user
    }).then(function(resp) {
        return resp.data;
      });
    },
    removeUser: function(user) {
        console.log(user);
        return $http({
          method: 'DELETE',
          url: '/user/info/?user_id=' + user
        }).then(function(resp) {
        return resp;
        });
    }
  };
});
