//profile.js
describe('CodeSnap profile page', function() {
  beforeEach(function() {
    browser.get('/#/profile');
  });

  it('should show all of the user posts', function() {

  });

  it('should delete the user when remove user button is clicked', function() {

  });

  it('should redirect if user is not signed in', function() {
    expect(browser.getTitle()).toEqual('CodeSnap');
    browser.sleep(3000);
    expect(browser.getCurrentUrl()).toMatch("/#/signup");
  });



});
