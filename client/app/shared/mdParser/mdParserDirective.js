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
        };
      }
    };
  });
