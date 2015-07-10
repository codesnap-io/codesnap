(function(){ 
  'use strict'; 

  // Injects environment logic into express.js and mongoose.js depending on whether you are working in development or production environment
  module.exports = require('./env/' + process.env.NODE_ENV + '.js');


})();


