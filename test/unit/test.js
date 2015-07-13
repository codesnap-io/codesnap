/*
With Mocha/Chai, there are three different formats you can use to write tests:

assert([1, 2, 3].length, 3);
[1, 2, 3].length.should.equal(3);
expect([1, 2, 3].length).to.equal(3);

Documentation: http://chaijs.com/
*/

var assert = require("assert");

describe('Array', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});