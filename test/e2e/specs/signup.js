// signup.js
describe('Crouton signup page', function() {
  beforeEach(function() {
    browser.get('/#/signup');
  });

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('Crouton');
  });

  it('should be the signup page', function() {
    var intro = $('.introduction-box')
    expect(intro.isPresent()).toBe(true);
  })



  it('should direct to github login when signup button clicked', function() {
    var button = $('.btn-auth');
    button.click();
    //Do something here

  })


});
