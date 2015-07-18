(function () {
  'use strict';  
  var Tag = require('../models/tag.server.model');

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
