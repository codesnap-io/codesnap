(function () {
  'use strict';  
  var Tag = require('../models/tag.server.model');
  var request = require('request');
  var cheerio = require('cheerio');

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
})();
