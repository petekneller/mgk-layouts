const t = require('tap').mocha;
const assert = require('chai').assert;
const victorAssert = require('../victor-assert.js');

const deserializer = require('../../src/serialization/deserializer.js');

t.describe('the deserialiser', () => {

  t.it('should convert each element of the "obstacles" array into an obstacle', () => {
    const input = {
      obstacles: [{
        origin: { x: 1, y: 2 }
      }, {
        origin: { x: 2, y: 3 }
      }]
    };
    const output = deserializer(input);

    assert.exists(output.obstacles);
    assert.equal(output.obstacles.length, 2);

    const obstacle1 = output.obstacles[0];
    assert.exists(obstacle1.origin);
  });

});
