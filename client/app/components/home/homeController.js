(function() {
  'use strict';

  angular.module('homeController', [])

  .controller('homeController', function($scope, postFactory, tagFactory) {

    /* Load posts to post page */
    /* show all posts */
    $scope.loadData = function() {
      console.log("loaddata called")
      postFactory.getPostsData()
        .then(function(posts, err) {
          if (err) {
            console.log("Error: ", err);
          } else {
            console.log("scope.posts updated");
            $scope.posts = posts;
          }
        });
    };

    $scope.loadData();


    tagFactory.getPopularTags()
      .then(function(data){
        $scope.tags = data;
      });

  });

})();
