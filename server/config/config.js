(function(){
  'use strict';


  if (process.env.NODE_ENV === 'production') {
    module.exports = require('./env/production.js');
  }

  if (process.env.NODE_ENV === 'staging') {
    module.exports = require('./env/staging.js');
  }

  /* Injects environment logic into express.js and mongoose.js depending on whether you are working in development or production environment */
  if (process.env.NODE_ENV =  == 'development') {
    module.exports = require('./env/development.js');
  }

})();
