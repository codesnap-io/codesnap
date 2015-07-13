// home.js
describe('Crouton homepage', function() {

  beforeEach(function() {
    browser.get('/#/home');
  });

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('Crouton');
  });

  it('should select the appropriate topic when clicking the side bar buttons', function() {
    var topics = element.all(by.repeater('topic in topics'));
    topics.each(function(item, index) {
      item.getText().then(function(text) {
        var button = element(by.cssContainingText('.topic', text));
        button.click();
        var title = $('#topic-title').getAttribute('title');
        expect(title).toEqual(text);
      })
    })
    element(by.id('topics-bar'))
  });

  it('should show logged in user information in the navbar', function() {

  });

  it('should direct to post page for when clicking the read more button', function() {

  });
});
