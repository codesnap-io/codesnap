(function() {
  'use strict';

  angular.module('postFactory', [])

  .factory('postFactory', function($http, $state) {
    var currentPost = {};
    var currentPostComments = [];
    var liked;

    return {
      /* Retrieves 20 posts with the most likes */
      getTopPosts: function() {
        return $http({
          method: 'GET',
          url: '/post/top'
        }).then(function(resp) {
          return resp.data;
        });
      },

      /* Retrieves top 20 most recent posts */
      getRecentPosts: function() {
        return $http({
          method: 'GET',
          url: '/post/recent'
        }).then(function(resp) {
          return resp.data;
        });
      },

      //get 20 posts after lastPost
      getMorePosts: function(lastPostId, lastLike) {
        //TODO: instead of sending back entire last post in params, only send back relevant part
        // var param = lastPost[query];
        //determine whether asking for top or recent posts
        if (lastLike !== 'undefined' && lastLike !== null) {
          return $http({
            method: 'GET',
            url: 'post/more/top',
            params: {
              last_post_id: lastPostId,
              last_like: lastLike
            }
          });
        } else {
          return $http({
            method: 'GET',
            url: 'post/more/recent',
            params: {
              last_post_id: lastPostId
            }
          });
        }
      },

      /* Retrieves data for one post (based on given post id) */
      getPostData: function(id) {
        return $http({
          method: 'GET',
          url: '/post/info',
          params: {
            post_id: id
          }
        }).then(function(resp) {
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
      getPostMarkdown: function(url, loggedIn, postData, user) {

        if (!loggedIn) {
          return $http({
            method: 'GET',
            url: url
          }).then(function(resp) {
            return resp.data;
          });
        } else if (!!loggedIn) {

          var username = postData.username;
          var filename = postData.file;
          var token = user.token;

          return $http({
            method: 'GET',
            headers: {
              "Authorization": "token " + token
            },
            url: "https://api.github.com/repos/" + username + "/codesnap.io/contents/" + filename
          }).then(function(resp) {
            return window.atob(resp.data.content);
          });
        }
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
        }).then(function(resp) {
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
        }).then(function(resp) {
          liked = resp.data;
          return resp.data;
        });
      },

      /* Adds 1 view to the post's view count in the database */
      addPostView: function(postId, userId) {
        return $http({
          method: 'POST',
          url: '/view/add',
          data: {
            post_id: postId,
            user_id: userId

          }
        });
      },

      addComment: function(post_id, paragraph, user_id, text) {
        return $http({
          method: 'POST',
          url: '/comment/add',
          data: {
            post_id: post_id,
            paragraph: paragraph,
            user_id: user_id,
            text: text
          }
        });
      },

      deleteComment: function(comment_id) {
        return $http({
          method: 'DELETE',
          url: '/comment/delete',
          params: {
            comment_id: comment_id
          }
        });
      },

      /* Sets current post when in resolve, before user reaches a post page. Allow current posts and likes to be accessible by controllers. */
      getCurrentPost: function() {
        return currentPost;
      },

      /* Used to retrieve post information when set in resolve once user views post page */
      getCurrentLike: function() {
        return liked;
      }

    };
  });
})();
