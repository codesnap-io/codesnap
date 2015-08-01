(function() {

  var request = require('request');
  var rp = require('request-promise');
  var fs = require('fs');
  var Promise = require('bluebird');
  var Paragraph = require('../models/paragraph.server.model');
  Promise.promisifyAll(fs);

  //Promise versions:

  /*
  put file in repo -- takes username, token, and a path obj:
  {
    uri: "REPO PATH",
    serverPath: "SERVER PATH",
    message: "COMMIT MESSAGE"
  }
  */
  exports.addFileToGHRepo = function(token, username, path) {
    var file = fs.readFileSync(path.serverPath);
    var content = file.toString('base64');
    var options = {
      uri: path.repoPath,
      method: 'PUT',
      body: '{"message": ' + '"' + path.message + '", "content": ' + '"' + content + '"}',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': 'token ' + token,
        'User-Agent': 'CodeSnap'
      }
    };
    return rp(options);
  };


  // get raw file from github for non-auth needs
  exports.getRawGHFile = function(uri) {
    var options = {
      uri: uri,
      method: 'GET'
    };
    return rp(options);
  };

  //get file CONTENTS from GH's API
  exports.getGHFileContentsFromApi = function(postPath, username) {
    var options = {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'CodeSnap'
      },
      params: {
        "client_id": "7d292489ff2489c0dc96",
        "client_secret": "d3ca1aa8a19339272e0425026b581e2e6294e2f9"
      },
      uri: "https://api.github.com/repos/" + username + "/codesnap.io/contents/" + postPath
    };

    return rp(options)
      .then(function(resp) {
        var b64Content = JSON.parse(resp).content;
        var content = new Buffer(b64Content, 'base64');
        return content.toString();
      });
  };

  //get file through GH's API
  exports.getFileFromGHAPI = function(token, uri) {
    var options = {
      uri: uri,
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': 'token ' + token,
        'User-Agent': 'CodeSnap'
      }
    };
    return rp(options);
  };

  /* This function takes a github username and returns a callback whose first argument is the user's github ID */
  exports.getGHUser = function(username) {
    var options = {
      url: "https://api.github.com/users/" + username,
      method: 'GET',
      headers: {
        'Authorization': 'token ' + process.env.MICHAELTOKEN,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'CodeSnap'
      }
    };
    return rp(options);
  };

  exports.addGHRepo = function(token, username) {
    /* These are the details for the repo that's created */
    var repoName = 'codesnap.io';
    var homepage = 'http://www.codesnap.io';
    var description = 'A technical blogging platform';

    var addRepoOptions = {
      url: 'https://api.github.com/user/repos',
      method: 'POST',
      body: '{ "name": "' + repoName + '", "homepage": "' + homepage + '", "description": "' + description + '" }',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': 'token ' + token,
        'User-Agent': 'CodeSnap'
      }
    };

    var addWebhookOptions = {
      url: 'https://api.github.com/repos/' + username + '/' + repoName + '/hooks',
      method: 'POST',
      body: '{ "name": "web", "events": "push", "config": {"url": "http://www.codesnap.io/postreceive/github", "content_type": "json"} }',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': 'token ' + token,
        'User-Agent': 'CodeSnap'
      }
    };

    /* For each file we add, specify a repo location, an initial message and the location of the file to be copied on our server */
    var firstPostPath = {
      repoPath: 'https://api.github.com/repos/' + username + '/' + repoName + '/contents/posts/myFirstPost.md',
      message: "(init) setup repo and add first post",
      serverPath: "./server/assets/firstPost.md"
    };

    var firstImagePath = {
      repoPath: 'https://api.github.com/repos/' + username + '/' + repoName + '/contents/images/snapper.svg',
      message: "(init) add first image",
      serverPath: "./server/assets/snapper.svg"
    };

    var readmePath = {
      repoPath: 'https://api.github.com/repos/' + username + '/' + repoName + '/contents/README.md',
      message: "(init) add README.md",
      serverPath: "./server/assets/README.md"
    };

    var bioPath = {
      repoPath: 'https://api.github.com/repos/' + username + '/' + repoName + '/contents/bio.md',
      message: "(init) add bio.md",
      serverPath: "./server/assets/bio.md"
    };

    /* Create repo if user signs up and repo doesn't already exist */
    rp(addRepoOptions)
      /* Add various files to the repo */
      .then(function(body) {
        /* Set up webhook so we receive notification when changes are made to repo */
        console.log("WEB HOOK ADDED");
        return rp(addWebhookOptions);
      }).then(function(body) {
        /* Add first image in images folder */
        console.log("FIRST IMAGE ADDED");
        return module.exports.addFileToGHRepo(token, username, firstImagePath);
      }).then(function(body) {
        /* Add readme to main repo */
        console.log("README ADDED");
        return module.exports.addFileToGHRepo(token, username, readmePath);
      }).then(function(body) {
        console.log("BIO ADDED");
        return module.exports.addFileToGHRepo(token, username, bioPath);
      }).then(function(body) {
        /* Add first post in posts folder */
        console.log("FIRST POST ADDED");
        return module.exports.addFileToGHRepo(token, username, firstPostPath);
      })
      .catch(function(e) {
        if (e.statusCode !== 422) {
          console.error("Error in addGHRepo: ", e);
        }
      });
  };

  exports.parseParagraphs = function(file, postId) {
    var array = file.match(/^.*([\n\r]+|$)/gm);
    array = removeExtraLineSpace(array);

    /* Each index represents the paragraph numer, the value of each index represents the line at which a paragraph starts */
    var paragraphArray = [];

    /* Remove extra white space from the end of each lines */
    var index = endYAMLIndex(array);

    while (index < array.length) {
      /* If index is not moved forward to account for YAML data, there must not be YAML data.  In this case, the first line is the start of our first paragraph */
      if (index === 0 && !blankCheck(array[index])) {
        paragraphArray.push(index);
      }

      /* If the previous line ended with a new line character, this must be the start of a new paragraph */
      else if ((startNewParagraph(array[index - 1]) || yamlCheck(array[index - 1])) && !headerCheck(array[index]) && !blankCheck(array[index])) {
        paragraphArray.push(index);
      }

      /* Account for code block as one paragraph */
      if (codeBlockCheck(array[index])) {
        index++;

        /* Keep moving forward in the string until we get to the end of the code block.  We do this so that each code block is treating as its own paragraph. */
        while (!codeBlockCheck(array[index]) && index < array.length - 1) {
          index++;
        }
      }
      index++;
    }

    addParagraphsToDb(paragraphArray, postId);

    return paragraphArray;
  };


  /* INTERNAL FILE FUNCTIONS */

  /* Splits markdown file lines into an array */
  var splitLines = function(text) {
    return text.match(/^.*([\n\r]+|$)/gm);
  };

  /* All lines have a \n at the end, even those that shouldn't.  Lines that have new paragraphs after have multiple \n's.  By removing the last \n, only remaining \n's should denote new paragraphs. Don't remove line breaks at the end of paragraphs */
  var removeExtraLineSpace = function(array) {
    for (var i = 0; i < array.length; i++) {
      if (!headerCheck(array[i])) {
        array[i] = array[i].replace(/\n$/, "");
      }
    }
    return array;
  };

  var yamlCheck = function(string) {
    if (/^---/.test(string)) {
      return true;
    }
  };

  /* Return the first index after the YAML or 0 */
  var endYAMLIndex = function(array) {
    var yamlCount = 0;
    var index = 0;
    while (yamlCount < 2 && index < array.length) {
      if (/^---/.test(array[index])) {
        yamlCount++;
      }
      index++;
    }

    if (yamlCount === 2) {
      return index;
    }

    return 0;
  };

  /* Returns true if string ends with a line break.  When this is true, it means that the next line is the start of a new paragraph */
  var startNewParagraph = function(string) {
    return /\n$/.test(string);
  };

  /* Checks to see if a string is the beginning or end of a code block (```) */
  var codeBlockCheck = function(string) {
    return /^```/.test(string);
  };

  /* Checks to see if a string is a header.  We don't want to count headers as paragraphs */
  var headerCheck = function(string) {
    return /^#/.test(string);
  };

  /* Returns true if string is blank */
  var blankCheck = function(string) {
    return string.length === 0;
  };

  /* Add paragraphs to database */
  var addParagraphsToDb = function(array, postId) {
    for (var i = 0; i < array.length; i++) {
      Paragraph.addOrEdit(i, array[i], postId, function(paragraph) {});
    }
  };

})();
