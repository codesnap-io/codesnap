(function() {
  'use strict';
  var SideComments = require('side-comments');

  angular.module('postController', ['postFactory'])

  .controller('postController', function ($scope, $rootScope, $stateParams, postFactory, userFactory) {
    /* Set scope id equal to the id passed in as parameter */
    $scope.post_id = $stateParams.id;
    $scope.postData = postFactory.getCurrentPost();
    console.log($scope.postData);
    $scope.postData.editUrl = "https://github.com/" + $scope.postData.username + "/codesnap.io/edit/master/" + $scope.postData.file;

    /* Equals true if the user has already liked the post.  This is used to color in the heart icon */
    $scope.like = postFactory.getCurrentLike();

    /* Adds one view count to the databsae for this post */
    postFactory.addPostView($scope.post_id);

     /* This contains the user information needed to add comments */
    $scope.user = userFactory.getUserInfo();

    /* If post data is successfully retrieved, get the markdown file at it's specified url */
    postFactory.getPostMarkdown($scope.postData.post_url)
    .then(function (post, err) {
      if (err) {
        console.log(err);
      } else {
        /* Set scope post equal to the markdown content retrieved from Github */
        $scope.post = post;

        /* Assign paragraph attributes. Use set timeout to give page time load post data to page */
        setTimeout(function() {
          addSideComments();
        });
      }
    });


    var getSelectionText = function() {
      var text = "";
      if (window.getSelection) {
        text = window.getSelection().toString();
      } else if (document.selection && document.selection.type !== "Control") {
        text = document.selection.createRange().text;
      }
      return text;
    };

    /* Add incremental paragraph attribute to all p (and pre tags) in a post.  Add side comment functionality once these tags have been added. */
    var addSideComments = function() {
      /* Wrap pre divs with paragraph tags so there aren't formatting conflicts and we can treat them like other paragraphs */
      $('pre').each(function() {
        $(this).wrap("<p></p>");
      });

      var counter = 0;
      $('md').find('p').each(function() {
        /* Add paragraph number */
        $(this).attr('data-section-id', counter.toString());
        $(this).addClass('commentable-section');

        counter++;
      });

      /* Initialize side comment functionality.  We specify the user information and previous posts */
      debugger;
      var sideComments = new SideComments('#commentable-area', $scope.user, $scope.postData.comments);

      /* When a commentPosted event is triggered, add the comment to the database */
      sideComments.on('commentPosted', function(comment) {
        /* Pass in post id, paragraph, user id and comment's text */
        postFactory.addComment($scope.post_id, comment.sectionId, comment.authorId, comment.comment);

        /* Add the new comment to the DOM */
        sideComments.insertComment(comment);

        $rootScope.$emit('updateComments', 1);
      });

      /* Delete post.  This option is only available if the current user's username matches the username associated with the post */
      sideComments.on('commentDeleted', function(comment){
        /* Delete comment from database */
        postFactory.deleteComment(comment.id);

        /* Remove comment from DOM */
        sideComments.removeComment(comment.sectionId, comment.id);

        $rootScope.$emit('updateComments', -1);

      });
    };



    $(document).ready(function() {
      /* Shift post body back to the right when user clicks out of comments-wrapper */
      $('body').on('click', function() {
        /* Don't shift post body when user clicks on the alert created when post is deleted */
        if ($(event.target).hasClass('action-link')) {
          event.stopPropagation();
        }
        /* If user clicks on the comments button belonging to an open comment section, shift the post body */
        else if (!$(event.target).parent().parent().find('.comments-wrapper').is(':visible')) {
          $('.post-container').animate({'margin-left': '0px'}, 100);
        }
        /* If user clicks outside of comments div, shift post body back, unless another comments div is being opened */
        else if((!$(event.target).closest('.comments-wrapper').length)) {
          if ($('.post-container').css('margin-left') === '-420px' && !$(event.target).parent().parent().hasClass('side-comment')) {
            $('.post-container').animate({'margin-left': '0px'}, 100);
          }
        }
      });

      /* Shift post body to the left when comment button is clicked */
      $('body').on('click', '.side-comment', function() {
        /* First prevent default event of setting post-container margin to 0 */
        event.stopPropagation();
        $('.post-container').animate({'margin-left': '-420px'}, 100);

      });

      /* Adjust the height of the comment boxes as people type */
      $('body').on( 'keyup', '.comment-box', function (){
          $(this).height( 0 );
          $(this).height( this.scrollHeight );
      });
      $('#container').find( 'textarea' ).keyup();

      /* Show log in pop up if user tries to add a comment without being logged in */
      $('body').on('click', '.add-comment', function() {
        if (!$rootScope.loggedIn) {
          /* If user tries to comment on post without being logged in, show a pop up telling them that they need to log in */
          $("body").scrollTop(0);
          $('#post-error-container').slideDown(300);
        }
      });
    });

  });
})();
