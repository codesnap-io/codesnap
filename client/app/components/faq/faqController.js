angular.module('faqController', ['postFactory'])

.controller('faqController', function ($scope, postFactory) {
  /* Set the url that directs to the raw markdown of our FAQ */
  var url = 'https://raw.githubusercontent.com/BlaseBallerina/crouton/master/FAQ.md';

  /* Pull FAQ markdown and render onto page */
  postFactory.getPostMarkdown(url)
    .then(function (content, err) {
      if (err) {
        console.log(err);
      } else {
        /* Set scope post equal to the markdown content retrieved from Github */
        $scope.faqContent = content;
      }
    });

});