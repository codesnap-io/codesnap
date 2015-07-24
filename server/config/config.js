(function(){
  'use strict';


  // if (process.env.NODE_ENV === 'production') {
  //   module.exports = require('./env/production.js');
  // }

  /* Injects environment logic into express.js and mongoose.js depending on whether you are working in development or production environment */
  if (process.env.NODE_ENV !== 'production') {
    module.exports = require('./env/development.js');
  }

})();
