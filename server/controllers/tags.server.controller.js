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
    console.log(req.query.user_id);
    var userId = jwt.decode(req.query.user_id, process.env.jwtSecret);
    Tag.getUserTags(userId)
    .then(function(data) {
      res.json(data[0]);
    });
  };

})();
