describe('API integration', function() {
  var server, setupStub, JSONresponse;

  before(function() {
    JSONresponse = {todos: [{ name: 'Test1',  done: true},
                           { name: 'Test2',  done: false},
                           { name: 'Test3',  done: true}]};
  });


  it('should exist', function() {
     expect(3).to.equal(3);
  });
});



//gets information on post
  //creates new post in db
//
