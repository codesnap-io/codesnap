angular.module('homeController', [])

.controller('homeController', function ($scope) {
  $scope.posts = [{
    id: 1,
    title: "The Best Title Ever!",
    authorPic: "https://d262ilb51hltx0.cloudfront.net/fit/c/80/80/0*xZl_kLRGSfBND02C.jpg",
    author: "Michael Arnold",
    content: "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content. "
  }, {
    id: 2,
    title: "The Best Title Ever!",
    authorPic: "https://d262ilb51hltx0.cloudfront.net/fit/c/80/80/0*xZl_kLRGSfBND02C.jpg",
    author: "Michael Arnold",
    content: "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content. "
  }, {
    id: 3,
    title: "The Best Title Ever!",
    authorPic: "https://d262ilb51hltx0.cloudfront.net/fit/c/80/80/0*xZl_kLRGSfBND02C.jpg",
    author: "Michael Arnold",
    content: "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content " +
      "sample post content sample post content sample post content sample post content. "
  }];

  $scope.chooseTopic = function(topic) {
    $scope.topic = topic;
  };

  $scope.isSelectedTopic = function(topic) {
    return topic === $scope.topic;
  };

  $scope.chooseFilter = function(filter) {
    $scope.topicFiler = filter;
  };

  $scope.topicFilter = 'latest';
  $scope.topic = 'Ruby';
  $scope.topics = ['Ruby', 'Javascript', 'Haskell', 'Rust', 'Python',
  'C++', 'Lisp', "Swift", "C#", "CSS", "TDD", "Git"].sort();
  $scope.topicFilters = ['latest', 'best', 'hottest', 'oldest'];
});
