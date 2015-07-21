(function() {
  'use strict';

  angular.module('homeController', [])

  .controller('homeController', function($scope, postFactory) {


    /* show all posts */
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

    /* determines current topic, active tabs, and active filter in home view */
    $scope.chooseTopic = function(topic) {
      $scope.topic = topic;
    };
    $scope.isSelectedTopic = function(topic) {
      return topic === $scope.topic;
    };
    $scope.chooseFilter = function(filter) {
      $scope.topicFiler = filter;
    };

    /* dummy shit */
    $scope.topicFilter = 'latest';
    $scope.topic = 'Ruby';
    $scope.topics = ['Ruby', 'Javascript', 'Haskell', 'Rust', 'Python',
      'C++', 'Lisp', "Swift", "C#", "CSS", "TDD", "Git"
    ].sort();
    $scope.topicFilters = ['latest', 'best', 'hottest', 'oldest'];
  });

})();
