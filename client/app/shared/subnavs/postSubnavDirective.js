(function() {
  'use strict';
  angular.module('postSubnavDirective', ['postFactory', 'userFactory'])
  .directive('postSubnav', function(postFactory, userFactory) {
      return {
        restrict: 'A',
        controller: function ($scope, $rootScope, postFactory, userFactory, $timeout) {
          // $scope.user = userFactory.getCurrentUser();

          // loads post data retrieved by post controller. timeout provides time for async
          // request to load.
          $timeout(function() {
              $scope.postData = postFactory.getCurrentPost();
              postFactory.getLikeStatus(window.localStorage.jwtToken, $scope.postData.post_id)
                .then(function(isLiked) {
                  $scope.isLiked = isLiked;
                });
          }, 200);

          $scope.loggedIn = $rootScope.loggedIn;

          // Toggle likes
          $scope.toggleLike = function() {
            if ($scope.loggedIn) {
              postFactory.toggleLike(localStorage.jwtToken, $scope.postData.post_id)
                .then(function(resp) {

                  /* Update like count in client */
                  if ($scope.isLiked) {
                    $scope.postData.likes--;
                  } else {
                    $scope.postData.likes++;
                  }

                  $scope.isLiked = !$scope.isLiked;
                });
            } else {
              /* If user tries to like post without being logged in, show a pop up telling them that they need to log in */
              $('#post-error-container').slideDown(300);
            }
          };

          if($scope.loggedIn) {
            console.log("A");
            $scope.isLiked = function() {
              return $scope.isLiked;
            };
          }

          /* Hide post error container when user clicks it */

        },
        link: function(scope, elem, attr) {
          $('#post-error-container').click(function() {
            $(this).hide();
          });
        }
      };
    });
})();
