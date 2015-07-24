(function () {
  'use strict';
  var Tag = require('../models/tag.server.model');
  var request = require('request');

  exports.getTags = function(req, res) {
    Tag.getAll()
    .then(function(data) {
      res.json(data[0]);
    });

  };

  exports.getPopularTags = function(req, res) {
    Tag.getPopularTags()
    .then(function(data) {
      res.json(data[0]);
    });
  };
})();
