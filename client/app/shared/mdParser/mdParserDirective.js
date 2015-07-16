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
          var lexedText = marked.lexer(textWithMetadata);
          var stripMeta = function (lex) {
            lex.shift();
            lex.shift();
            lex.shift();
            return lex;
          };
          var textContent = stripMeta(lexedText);
          var html = marked(marked.parser(textContent));
          $elem.html(html);
        };
      }
    };
  });
