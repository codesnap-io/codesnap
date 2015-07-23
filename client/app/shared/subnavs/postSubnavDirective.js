(function() {
  'use strict';
  angular.module('postSubnavDirective', ['postFactory', 'userFactory'])
  .directive('postSubnav', function(postFactory, userFactory) {
      return {
        restrict: 'A',
        controller: function ($scope, postFactory, userFactory, $timeout) {
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


          // Toggle likes
          $scope.toggleLike = function() {
            postFactory.toggleLike(window.localStorage.jwtToken, $scope.postData.post_id)
              .then(function(resp) {
                console.log(resp);
              });

            //client side updates
            if ($scope.isLiked) {
              $scope.postData.likes--;
            } else {
              $scope.postData.likes++;
            }

            $scope.isLiked = !$scope.isLiked;
          };


          $scope.isLiked = function() {
            return $scope.isLiked;
          };


        }
      };
    });
})();
