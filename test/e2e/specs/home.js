// home.js
describe('Crouton homepage', function() {

  beforeEach(function() {
    browser.get('/#/home');
  });

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('Crouton');
  });

  it('should select the appropriate topic when clicking the side bar buttons', function() {
    element.all(by.css('.topic-btn'))
      .each(function(item, index) {
            item.click().then(function() {
              item.getText()
              .then(function(topicText) {
                $('.topic-name').getText()
                  .then(function(text) {
                    expect(topicText + ".").toEqual(text);
                  });
              });
            });
        });
  });

  it('should show logged in user information in the navbar', function() {

  });

  it('should direct to post page for when clicking the read more button', function() {

  });
});
