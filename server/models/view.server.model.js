(function() {
  'use strict';
  var db = require('../config/db');
  var View = require('../config/schema').View;

  View.add = function(viewData, callback) {
    /* Find the last view for the given ip address */
    db.knex.raw(' \
      SELECT created_at AS date \
      FROM views \
      WHERE \
        post_id = "' + viewData.post_id + '" AND \
        address = "' + viewData.address + '" \
      ORDER BY date DESC \
      LIMIT 1')
      .then(function(data) {
        /* If no view exists or if the most recent view was at least an hour ago, create a new view */
        if (data[0].length === 0 || ((new Date() - data[0][0].date) / (1000 * 60)) >= 60) {
          new View(viewData)
          .save()
          .then(function(view) {
            callback(true);
          });
        } else {
          /* Otherwise don't create a new view */
          callback(false);
        }        
      });
  };

  module.exports = View;
})();

