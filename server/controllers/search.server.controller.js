(function () {
  'use strict';
  // var Fuse = require('../assets/fuse/src/fuse');

  var options = {
    caseSensitive: false,
    includeScore: false,
    shouldSort: true,
    /* This variable determines the search sensitivity */
    threshold: 0,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    keys: ["name"]
  };

  var list = [
    {"name": "Angular"},
    {"name": "angular.js"},
    {"name": "angularjs"},
    {"name": "bngularjs"},
    {"name": "bsgular"},
    {"name": "Angulr"},
    {"name": "Angular.j"},
    {"name": "Angular"}
  ];

  var fuse = new Fuse(list, options); // "list" is the item array
  var result = fuse.search("angular");
  console.log(result);

})();
