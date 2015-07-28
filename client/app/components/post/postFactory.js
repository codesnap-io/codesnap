(function() {
  'use strict';

  angular.module('postFactory', [])

  .factory('postFactory', function ($http, $state) {
    var currentPost = {};
    var liked;

    return {
      /* Retrieves data about all posts from server */
      getPostsData: function() {
        return $http({
          method: 'GET',
          url: '/post/all'
        }).then(function (resp) {
          console.log("posts data: ", resp);
          return resp.data;
        });
      },

      /* Retrieves 20 posts with the most likes */
      getTopPosts: function() {
        return $http({
          method: 'GET',
          url: '/post/top'
        }).then(function (resp) {
          return resp.data;
        });
      },

      /* Retrieves top 20 most recent posts */
      getRecentPosts: function() {
        return $http({
          method: 'GET',
          url: '/post/recent'
        }).then(function (resp) {
          return resp.data;
        });
      },

      //get 20 posts after lastPost
      getMorePosts: function(lastPost) {
        //TODO: instead of sending back entire last post in params, only send back relevant part
        // var param = lastPost[query];
        return $http({
          method: 'GET',
          url: 'post/more',
          params: {
            lastPost: lastPost
          }
        });
      },

      /* Retrieves data for one post (based on given post id) */
      getPostData: function(id) {
        return $http({
          method: 'GET',
          url: '/post/info',
          params: {
            post_id: id
          }
        }).then(function (resp) {
          /* If post id is invalid, redirect to home page */
          if (!resp.data) {
            $state.go('home');
          }
          /* sets current post in factory for retrieval by post controller and subnav */
          currentPost = resp.data;
          return resp.data;
        });
      },

      /* Download post markdown content from Github */
      getPostMarkdown: function(url) {
        return $http({
          method: 'GET',
          url: url
        }).then(function (resp) {
          return resp.data;
        });
      },

      /* Returns true if user likes post after toggle, otherwise returns false. */
      toggleLike: function(userId, postId) {
        return $http({
          method: 'GET',
          url: '/like/toggle',
          params: {
            user_id: userId,
            post_id: postId
          }
        }).then(function (resp) {
          return resp;
        });
      },

      /* Returns true if the user likes the post, otherwise returns false. */
      getLikeStatus: function(userId, postId) {
        return $http({
          method: 'GET',
          url: '/like/status',
          params: {
            user_id: userId,
            post_id: postId
          }
        }).then(function (resp) {
          liked = resp.data;
          return resp.data;
        });
      },


      addPostView: function(postId) {
        return $http({
          method: 'GET',
          url: '/post/addview',
          params: {
            post_id: postId
          }
        });
      },


      //allow current posts and likes to be accessible by controllers
      getCurrentPost: function() {
        return currentPost;
      },

      getCurrentLike: function() {
        return liked;
      }

    };
  });
})();
