//post.js
describe('CodeSnap post page', function() {
  beforeEach(function() {
    browser.get('/#/post/1');
  });

  it('should show post information in the sub-navbar', function() {
    expect(element(by.exactBinding('postData.author')).isPresent()).toBe(true);
    expect(element(by.exactBinding('postData.created_date')).isPresent()).toBe(true);
    expect(element(by.exactBinding('postData.likes')).isPresent()).toBe(true);
    expect($('md').isPresent()).toBe(true);
  });

  it('should update likes appropriately', function() {
    var likes = element(by.binding('postData.likes'));
    likes.getText().then(function(numLikes) {
      $('.like-button').click().then(function() {
        expect(likes.getText()).not.toEqual(numLikes);
      });
    });
  });

  // it('should redirect if user is not signed in', function() {
  //   expect(browser.getTitle()).toEqual('codesnap');
  //   expect(browser.getCurrentUrl).toBe("/#/signup");
  // });



});
