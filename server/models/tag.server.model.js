(function(){
  'use strict';
  var db = require('../config/db');
  var Tag = require('../config/schema').Tag;

  Tag.getAll = function(callback) {
    db.knex.raw(' SELECT title AS tag_title FROM tags')
    .then(function(data, error) {
      console.log(data[0]);
      callback(error, data[0]);
    });

  };

  module.exports = Tag;
})();



