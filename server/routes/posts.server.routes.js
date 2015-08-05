(function(){
  'use strict';
  var posts = require('../controllers/posts.server.controller.js');

  module.exports = function(app) {
    /* Paramenters: post_id
       Data returned: post_id, post_title, post_url, post_author */
    app.get('/api/post/info', posts.postInfo);

    app.get('/api/post/top', posts.topPosts);

    app.get('/api/post/recent', posts.recentPosts);

    app.get('/api/post/addview', posts.addView);

    app.get('/api/post/add', posts.addPost);

    //parameters: a specific post
    //data returned: 20 posts after
    app.get('/api/post/more/recent', posts.getMoreRecentPosts);
    app.get('/api/post/more/top', posts.getMoreTopPosts);
    /* Parameters: username
       Returns 20 most recent posts */
    app.get('/api/post/user/recent', posts.recentUserPosts);

    /* Parameters: username
       Returns 20 most popular posts */
    app.get('/api/post/user/top', posts.topUserPosts);
  };

})();
