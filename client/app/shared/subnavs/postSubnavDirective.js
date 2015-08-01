(function() {
  'use strict';
  angular.module('postSubnavDirective', ['postFactory', 'userFactory'])
    .directive('postSubnav', function(postFactory, userFactory) {
      return {
        restrict: 'A',
        controller: function ($scope, $rootScope, postFactory) {
          // loads post data retrieved by post factory.
          $scope.postData = postFactory.getCurrentPost();
          $scope.loggedIn = $rootScope.loggedIn;
          $scope.isLiked = postFactory.getCurrentLike();

          // Toggle likes
          $scope.toggleLike = function() {
            if ($scope.loggedIn) {
              postFactory.toggleLike(localStorage.codeSnapJwtToken, $scope.postData.post_id)
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
              $("body").scrollTop(0);
              $('#post-error-container').slideDown(300);
            }
          };

          $rootScope.$on('updateComments', function(event, change) {
            console.log(change);
            $scope.postData.commentCount += change;
          });
        },
        link: function(scope, elem, attr) {
          /* Hide post error container when user clicks it */
          $('#post-error-container').click(function() {
            $(this).hide();
          });

          $('.propose-change-btn')
          .popup({
            hoverable: true,
            inline: true,
            position: 'bottom left'
          });
        }
      };
    });
})();
