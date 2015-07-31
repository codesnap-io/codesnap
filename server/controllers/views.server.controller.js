(function () {
  'use strict';
  var View = require('../models/view.server.model');
  var jwt = require('jwt-simple');

  exports.addView = function(req, res) {
    /* Get address infomration from request.  Not all request will provide the same information */
    var address = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;

    /* Create object which will be passed in to attemp new view creation */
    var viewData = {
      post_id: req.body.post_id,
      address: address
    };

    /* If user_id is passed in the request, include it in viewData option.  user_id is optional because we will want to count views if the viewer is not logged in */
    if (req.body.user_id !== undefined) {
      viewData.user_id = jwt.decode(req.body.user_id, process.env.jwtSecret);
    }

    /* Create new view if the ip address does not have a view attributed to the given post in the past hour.  This passes true or false into the response depending on whether a new view was craeted */
    View.add(viewData, function(newView) {
      res.json(newView);
    });
  };
})();
