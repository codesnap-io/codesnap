angular.module('homeController', [])

.controller('homeController', function ($scope, postFactory) {

  postFactory.getPostsData()
    .then(function (posts, err) {
      if (err) {
        console.log("err: ", err);
      } else {
        $scope.posts = posts;
        console.log("posts: ", $scope.posts);
      }
    });

  $scope.chooseTopic = function (topic) {
    $scope.topic = topic;
  };

  $scope.isSelectedTopic = function (topic) {
    return topic === $scope.topic;
  };

  $scope.chooseFilter = function (filter) {
    $scope.topicFiler = filter;
  };

  $scope.topicFilter = 'latest';
  $scope.topic = 'Ruby';
  $scope.topics = ['Ruby', 'Javascript', 'Haskell', 'Rust', 'Python',
    'C++', 'Lisp', "Swift", "C#", "CSS", "TDD", "Git"
  ].sort();
  $scope.topicFilters = ['latest', 'best', 'hottest', 'oldest'];
});
