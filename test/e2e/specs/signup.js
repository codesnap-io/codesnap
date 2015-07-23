// signup.js
describe('CodeSnap signup page', function() {
  beforeEach(function() {
    browser.get('/#/signup');
  });

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('CodeSnap');
  });

  it('should be the signup page', function() {
    var intro = $('.introduction-box')
    expect(intro.isPresent()).toBe(true);
  });



  it('should direct to github login when signup button clicked', function() {
    var button = $('.btn-auth');
    button.click();
    browser.sleep(3000);
    expect(browser.driver.getCurrentUrl()).toMatch('github.com');
  });


});
