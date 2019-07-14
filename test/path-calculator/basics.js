require('tap').mochaGlobals();
const assert = require('chai').assert;

const victor = require('victor');
const obstacle = require('../../src/obstacle.js');
const pathCalculator = require('../../src/path-calculator/path-calculator.js');

describe('pathCalculator.calculateSegment', () => {
  it('should return an object containing both input obstacles', () => {
    const o1 = obstacle();
    const o2 = obstacle();
    const segment = pathCalculator.calculateSegment(o1, o2);
    assert.equal(o1, segment.o1);
    assert.equal(o2, segment.o2);
  });
});