(function() {

  var fs = require('fs');
  var req = require('request');

  /* Exports */

  module.exports.parseDiff = function (options, callback) {
    if (options.url) {
      module.exports.parseDiffFromUrl(options.url, callback);
    } else if (options.fileName) {
      module.exports.parseDiffFromFile(options.fileName, callback);
    }
  };

  module.exports.parseDiffFromUrl = function parseDiffFromUrl(url, callback) {
    req(url, function (err, response, body) {
      if (err) {
        throw err;
      } else if (response.statusCode === 200) {
        getParsedDiff(body, callback);
      } else {
        throw Error('Could not get diff from URL');
      }
    });
  };

  module.exports.parseDiffFromFile = function parseDiffFromFile(filename, callback) {
    fs.readFile(filename, 'utf8', function (err, data) {
      if (err) { throw err; }
      getParsedDiff(data, callback);
    });
  };


  /* Internal functions */

  function getParsedDiff(diff, callback) {
    if (!diff) {
      throw Error('No git diff to parse');
    }
    if (diff.trim().search(/^diff/) !== 0) {
      throw Error('Invalid file: Not a complete git diff');
    }
    var rows = splitLines(diff);

    // This is our results object
    var diffs = {};
    // This is the file that's been edited
    var file;
    // For each code section that has been edited, this is the starting line of the diff that Git returns
    var startingLine;
    // Tells me if this line is a line of code or some metadeta from the diff
    var isCodeLine;
    // This keeps track of the number of added lines as we iterate through the lines
    var addedLineIndex;
    // For each code section that has been edited, this keeps track number of lines in the add part
    var numLinesAdd;
    // This keeps track of the number of removed lines as we iterate through the lines
    var removedLineIndex;
    // For each code section that has been edited, this keeps track number of lines in the remove part
    var numLinesRemove;

    for (var i = 0; i < rows.length; i++) {
      // if line is "diff", set isCodeLine to false
      if (rows[i].match(/^diff\s\-\-git/)) {
        isCodeLine = false;
      } else if (rows[i].trim().match(/^\+\+\+\sb\//)) {
        file = rows[i].trim().replace('\+\+\+ b/', '');
        diffs[file] = {old: {}, new: {}};
      } else if (rows[i].match(/@@(.*?)@@/)) {
        startingLine = parseInt(rows[i].match(/@@(.*?)@@/)[1].trim().split(' ')[0].split(',')[0].slice(1));
        numLinesAdd = parseInt(rows[i].match(/@@(.*?)@@/)[1].trim().split(' ')[1].split(',')[1]);
        numLinesRemove = parseInt(rows[i].match(/@@(.*?)@@/)[1].trim().split(' ')[0].split(',')[1]);

        isCodeLine = true;
        addedLineIndex = 0;
        removedLineIndex = 0;
      } else if (isCodeLine) {
        if (rows[i].match(/^\-/)) {
          diffs[file].old[startingLine + removedLineIndex] = [rows[i].trim().replace('-', '').trim(), 'removed'];
          removedLineIndex++;
        } else if (rows[i].match(/^\+/)) {
          diffs[file].new[startingLine + addedLineIndex] = [rows[i].trim().replace('+', '').trim(), 'added'];
          addedLineIndex++;
        } else {
          if (removedLineIndex + 1 <= numLinesRemove) {
            diffs[file].old[startingLine + removedLineIndex] = [rows[i].trim().replace('-', '').trim()];
            removedLineIndex++;
          }
          if (addedLineIndex + 1 <= numLinesAdd) {
            diffs[file].new[startingLine + addedLineIndex] = [rows[i].trim().replace('+', '').trim()];
            addedLineIndex++;
          }
        }
      }
    }

    //must be done; push to parsed.
    if (callback && typeof callback === 'function') {
      callback(diffs);
    }
  }

  function splitLines(text) {
    return text.match(/^.*([\n\r]+|$)/gm);
  }

  // exports.parseDiffFromUrl('https://github.com/m-arnold/codesnap.io/commit/de726fb139345ed2691c47e69a1ef96fe0392742.diff', function(data){
  //   console.log(data['posts/parsetest.md']);
  // });

})();
