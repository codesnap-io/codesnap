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
  $scope.topicFilter = 'latest';
  $scope.topic = 'Ruby';
  $scope.topics = ['Ruby', 'Javascript'];
  $scope.topicFilters = ['latest', 'best', 'hot', 'oldest'];
});
