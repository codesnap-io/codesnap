(function () {
  'use strict';
  var Tag = require('../models/tag.server.model');
  var request = require('request');

  exports.getTags = function(req, res) {
    Tag.getAll(function(error, tags) {
      if (error) {
        console.log("ERROR: CAN'T FETCH TAGS FROM DATABASE");
        res.send("Error fetching tags from database");
      } else {
        res.json(tags);
      }
    });
  };

  exports.getPopularTags = function(req, res) {
    Tag.getPopularTags()
    .then(function(data) {
      res.json(data[0]);
    });
  };
})();
