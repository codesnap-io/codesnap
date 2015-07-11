angular.module('homeController', [])

.controller('homeController', function ($scope) {
  $scope.posts = [{
    title: "The Best Title Ever!",
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
    title: "The Best Title Ever!",
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
    title: "The Best Title Ever!",
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
  $scope.topicFilter = 'latest';
  $scope.selectTopic = 'Ruby';
  $scope.topics = ['Ruby', 'Javascript'];
});
