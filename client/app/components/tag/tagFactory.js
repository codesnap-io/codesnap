(function() {
  'use strict';
  angular.module('tagFactory', [])

  .factory('tagFactory', function($http) {
    var postResults = [];
    return {
      getTags: function() {
        return $http({
        method: 'GET',
        url: 'api/tags'
        }).then(function(resp) {
          return resp.data;
        });
      },
      getPopularTags: function() {
        return $http({
          method: 'GET',
          url: 'api/tags/popular'
        }).then(function(resp) {
          return resp.data;
        });
      },

      getUserTags: function(username){
        return $http({
          method: 'GET',
          url: 'api/tags/user',
          params: {
            username: username
          }
        }).then(function(resp) {
          return resp.data;
        });
      },
      setPostResult: function(result) {
        postResults = result;
      },
      getPostResult: function() {
        return postResults;
      },
      getTagPattern: function(tagName) {
        return $http({
          method: 'GET',
          url: 'api/tags/pattern',
          params: {
            tagName: tagName
          }
        }).then(function(resp) {
          return resp.data;
        });
      }
    };
  });


})();
