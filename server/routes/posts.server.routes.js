(function(){
  'use strict';
  var posts = require('../controllers/posts.server.controller.js');

  module.exports = function(app) {
    /* Paramenters: post_id
       Data returned: post_id, post_title, post_url, post_author */
    app.get('/post/info', posts.postInfo);

    app.get('/post/top', posts.topPosts);

    app.get('/post/recent', posts.recentPosts);

    app.get('/post/addview', posts.addView);

    app.get('/post/add', posts.addPost);

    //parameters: a specific post
    //data returned: 20 posts after
    app.get('/post/more/recent', posts.getMoreRecentPosts);
    /* Parameters: username
       Returns 20 most recent posts */
    app.get('/post/user/recent', posts.recentUserPosts);

    /* Parameters: username
       Returns 20 most popular posts */
    app.get('/post/user/top', posts.topUserPosts);
  };

})();
