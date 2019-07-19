const t = require('tap').mocha;
const assert = require('chai').assert;
const victorAssert = require('../victor-assert.js');

const pathCalculator = require('../../src/path-calculator/path-calculator.js');
const obstacle = require('../../src/obstacle.js');
const victor = require('victor');

t.describe('the segment object returned by pathCalculator.calculateSegment should contain intermediate calculations and debugging information', () => {
  const o1 = obstacle({ origin: victor(0, 0) });
  const o2 = obstacle({ origin: victor(0, 10) });
  const segment = pathCalculator.calculateSegment(o1, o2);

  t.it('should contain the vector "d12" between the two obstacle origins', () => {
    assert.exists(segment.d12);
    victorAssert.equalVectors(segment.d12, victor(0, 10));
  });
});
