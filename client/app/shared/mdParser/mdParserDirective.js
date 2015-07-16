angular.module('mdParserDirective', [])
  .directive('md', function () {
    if (typeof hljs !== 'undefined') {
      marked.setOptions({
        gfm: true,
        highlight: function (code, lang) {
          if (lang) {
            return hljs.highlight(lang, code).value;
          } else {
            return hljs.highlightAuto(code).value;
          }
        }
      });
    }
    return {
      restrict: 'E',
      require: '?ngModel',
      link: function ($scope, $elem, $attrs, ngModel) {
        if (!ngModel) {
          var html = marked($elem.text());
          $elem.html(html);
          return;
        }
        ngModel.$render = function () {
          var textWithMetadata = ngModel.$viewValue || '';
          var html = marked(extractor(textWithMetadata).body);
          $elem.html(html);
          //parses relative paths in html and makes them absolute
          $('md').find('img').each(function() {
            var src = $(this).attr('src');
            if (src.substring(0, 7) === 'images/') {
              $(this).attr('src', 'https://raw.githubusercontent.com/' + $scope.postData.username + '/crouton.io/master/' + src);
            }
          });
        };
      }
    };
  });
