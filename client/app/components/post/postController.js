angular.module('postController', [])

.controller('postController', function ($scope) {
  $scope.post = {
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
  };
});