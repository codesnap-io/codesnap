// home.js
describe('Crouton homepage', function() {

  beforeEach(function() {
    browser.get('/#/home');
  });

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('Crouton');
  });

  // it('should select the appropriate topic when clicking the side bar buttons', function() {
  //   element.all(by.css('.topic-btn'))
  //     .each(function(item, index) {
  //           item.click().then(function() {
  //             item.getText()
  //             .then(function(topicText) {
  //               $('.topic-name').getText()
  //                 .then(function(text) {
  //                   expect(topicText + ".").toEqual(text);
  //                 });
  //             });
  //           });
  //       });
  // });
  it('should show a signup link in the navbar if not logged in', function() {
    expect($('#signup-btn').isPresent()).toBe(true);
  });


  it('should show logged in user information in the navbar', function() {

  });

  it('should show all post information', function() {
    element.all(by.repeater('post in posts'))
      .each(function(item) {
        expect(item.element(by.binding('post.post_title')).isPresent()).toBe(true);
        expect(item.element(by.binding('post.author')).isPresent()).toBe(true);
        expect(item.element(by.binding('post.created_date')).isPresent()).toBe(true);
        expect(item.element(by.binding('post.summary')).isPresent()).toBe(true);
      });
  });


  it('should direct to post page for when clicking the post', function() {
    var post = element.all(by.repeater('post in posts')).first();
    post.element(by.binding('post.post_title')).getText().then(function(title) {
      post.click().then(function() {
        expect($('.post-title').getText()).toEqual(title);
        expect(browser.driver.getCurrentUrl()).toMatch('/#/post/');
      });
    })
  });

  it('should properly sort by "most recent"and by "most popular"', function() {
      //TODO: compare first in lists with second in lists to make assertions on sorting
      $('.recent-posts-btn').click().then(function() {
        var newestPost = element.all(by.repeater('post in posts')).first();
        newestPost.element(by.binding('post.post_title')).getText().then(function(title) {
            $('.top-posts-btn').click().then(function() {
              var topPost = element.all(by.repeater('post in posts')).first();
              expect(topPost.element(by.binding('post.post_title')).getText()).not.toEqual(title);
            });
        });
      })
  });

  it('should direct to search results page after conducting a search', function() {
    $('.ui-select-container input').sendKeys('e').then(function() {
      var choice = element(by.css('.ui-select-choices-row.active a'));
      choice.click().then(function() {
        browser.sleep(1000);
        expect(browser.driver.getCurrentUrl()).toMatch('/#/searchresults');
        // browser.getCurrentUrl().then(function (url) {
        //         expect(url).toMatch();
        //         return;
        //       });
        //
        // TODO: add more attributes to look for
      });
    });
  });
});
