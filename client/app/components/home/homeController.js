angular.module('homeController', [])

.controller('homeController', function ($scope) {
  $scope.posts = [{
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
  $scope.topic = 'Ruby';
  $scope.topics = ['Ruby', 'Javascript'];
  $scope.topicFilters = ['latest', 'best', 'hot', 'oldest'];
});
