//profile.js
describe('Crouton profile page', function() {
  beforeEach(function() {
    browser.get('/#/profile');
  });

  it('should redirect if user is not signed in', function() {
    expect(browser.getTitle()).toEqual('Crouton');
    expect(browser.getCurrentUrl).toBe("/#/signup");
  });



});
