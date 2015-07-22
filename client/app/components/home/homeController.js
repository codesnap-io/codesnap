(function() {
  'use strict';

  angular.module('homeController', [])

  .controller('homeController', function($scope, postFactory, tagFactory) {


    /* Load posts to post page */
    $scope.loadData = function() {
      postFactory.getPostsData()
        .then(function(posts, err) {
          if (err) {
            console.log("Error: ", err);
          } else {
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
