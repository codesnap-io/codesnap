(function () {
  'use strict';
  var Tag = require('../models/tag.server.model');
  var jwt = require('jwt-simple');

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

  exports.getUserTags = function(req, res) {
    var username = req.query.username;
    Tag.getUserTags(username)
    .then(function(data) {
      res.json(data[0]);
    });
  };

  exports.getTagPattern = function(req, res) {
    var tagName = req.query.tagName;
    Tag.getPattern(tagName)
    .then(function(data) {
      res.json(data[0]);
    });
  };
})();
