angular.module('homeController', [])

.controller('homeController', function ($scope) {
  $scope.posts = [{
    title: "The Best Title Ever!",
    author: "Michael Arnold",
    content: "sample post content yadda yadda yadday lkajsdglag adslkgjasdlkgjdlkagj"
  }]
  $scope.selectTopic = 'Ruby'
  $scope.topics = ['Ruby', 'Javascript']
});
