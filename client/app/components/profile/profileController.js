(function() {
  'use strict';
  angular.module('profileController', ['userFactory', 'tagFactory', 'postFactory'])
  .controller('profileController', function ($scope, userFactory, tagFactory, postFactory, $stateParams) {
    $scope.username = $stateParams.username;
    $scope.posts = userFactory.getPostResult();



    /* Retrieves user information and tag information by passing in username.  username must be unique because it is tied to Github */
    userFactory.getUserByUsername($scope.username)
      .then(function(user) {
        $scope.user = user;

        /* Set url to fetch raw bio content and edit bio */
        var bioUrl = "https://raw.githubusercontent.com/" + $scope.user.username + "/codesnap.io/master/bio.md";
        $scope.editUrl = "https://github.com/" + $scope.user.username + "/codesnap.io/edit/master/bio.md";

        postFactory.getPostMarkdown(bioUrl)
          .then(function (bio, err) {
            if (err) {
              /* If there is no bio file, set $scope.bio to false so that the bio and edit bio elements don't show */
              $scope.bio = false;
            } else {
              /* Set scope post equal to the markdown content retrieved from Github */
              $scope.bio = bio;
              
            }
          });
      });

    tagFactory.getUserTags($scope.username)
      .then(function(tags) {
        $scope.tags = tags;
      });







  });

 
})();
