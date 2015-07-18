(function(){
  'use strict';
  var posts = require('../controllers/posts.server.controller.js');

  module.exports = function(app) {
    /* Paramenters: post_id
       Data returned: post_id, post_title, post_url, post_author */
    app.get('/post/info', posts.postInfo);

    /* Paramenters: none
       Data returned: post_id, post_title, post_url, post_author */
    app.get('/post/info/all', posts.allPostsInfo);

    /* Query string: search string and type
       Data returned: post_id, post_title, post_url, post_author */
    app.get('/post/search', posts.postSearch);

    //app.post('/post/add', posts.addPost);
    //app.post('/post/edit', posts.editPost);
  };

})();
