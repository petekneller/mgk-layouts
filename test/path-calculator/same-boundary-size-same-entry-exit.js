require('tap').mochaGlobals();
const assert = require('chai').assert;
const victorAssert = require('../victor-assert.js');

const pathCalculator = require('../../src/path-calculator/path-calculator.js');
const obstacle = require('../../src/obstacle.js');
const victor = require('victor');

describe('a segment of two obstacles, both with the same boundary circle radius = 1', function() {

  context('when obstacle 1 is at (0,0) and obstacle 2 is at (0,10) and entry = exit = right', function() {
    const o1 = obstacle({ origin: victor(0, 0) });
    const o2 = obstacle({ origin: victor(0, 10) });
    const segment = pathCalculator.calculateSegment(o1, o2);

    it('both radius vectors should be equal', function(){
      victorAssert.equalVectors(segment.r1, segment.r2);
    });

    it('both radius vectors should be equal to (1,0)', function(){
      const expected = victor(1, 0);
      victorAssert.equalVectors(segment.r1, expected);
      victorAssert.equalVectors(segment.r2, expected);
    });
  });

  context('when obstacle 1 is at (0,0) and obstacle 2 is at (-10,-10) and entry = exit = left', function() {
    const o1 = obstacle({ origin: victor(0, 0), exit: obstacle.LEFT });
    const o2 = obstacle({ origin: victor(-10, -10), entry: obstacle.LEFT });
    const segment = pathCalculator.calculateSegment(o1, o2);

    it('both radius vectors should be equal', function(){
      victorAssert.equalVectors(segment.r1, segment.r2);
    });

    it('both radius vectors should be equal to (√0.5, -√0.5)', function(){
      const expected = victor(Math.sqrt(0.5), -1 * Math.sqrt(0.5));
      victorAssert.equalVectors(segment.r1, expected);
      victorAssert.equalVectors(segment.r2, expected);
    });
  });
});
