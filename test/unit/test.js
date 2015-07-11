var assert = chai.assert;
var should = chai.should;
var expect = chai.expect;

/* With Chai, there are three different formats you can use to write tests:

  assert([1, 2, 3].length, 3);
  [1, 2, 3].length.should.equal(3);
  expect([1, 2, 3].length).to.equal(3);

  Documentation: http://chaijs.com/
*/


describe('An Example Suite', function() {

  it('Should allow functional syntax for chai expectations', function() {
    expect([1, 2, 3].length).to.equal(3);
  });
});