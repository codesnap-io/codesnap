(function(){
  'use strict';
  var db = require('../config/db');
  var PostTagJoin = require('../config/schema').PostTagJoin;

  // PostTagJoin.add(post);
  module.exports = PostTagJoin;
})();



