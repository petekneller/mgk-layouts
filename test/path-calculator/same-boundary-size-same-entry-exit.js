require('tap').mochaGlobals();
const assert = require('chai').assert;
const victorAssert = require('../victor-assert.js');
const fc = require('fast-check');

const pathCalculator = require('../../src/path-calculator/path-calculator.js');
const obstacle = require('../../src/obstacle.js');
const victor = require('victor');

describe('a segment of two obstacles, both with the same boundary circle radius', function() {

  context('when obstacle 1 is at (0,0), obstacle 2 is at (0,10), boundary circle radius = 1 and entry = exit = right', function() {
    const o1 = obstacle({ origin: victor(0, 0) });
    const o2 = obstacle({ origin: victor(0, 10) });
    const segment = pathCalculator.calculateSegment(o1, o2);

    it('both radius vectors should be equal to (1,0)', function(){
      const expected = victor(1, 0);
      victorAssert.equalVectors(segment.r1, expected);
      victorAssert.equalVectors(segment.r2, expected);
    });
  });

  context('when obstacle 1 is at (0,0), obstacle 2 is at (-10,-10), boundary circle radius = 1 and entry = exit = left', function() {
    const o1 = obstacle({ origin: victor(0, 0), exit: obstacle.LEFT });
    const o2 = obstacle({ origin: victor(-10, -10), entry: obstacle.LEFT });
    const segment = pathCalculator.calculateSegment(o1, o2);

    it('both radius vectors should be equal to (√0.5, -√0.5)', function(){
      const expected = victor(Math.sqrt(0.5), -1 * Math.sqrt(0.5));
      victorAssert.equalVectors(segment.r1, expected);
      victorAssert.equalVectors(segment.r2, expected);
    });
  });

  context('when obstacles are at least the boundary circle radius apart', () => {
    const segmentProperty = (cb) => {
      return fc.property(fc.nat(), fc.nat(), fc.nat(), fc.nat(), (o1x, o1y, o2x, o2y) => {
        // obstacles can't be less than 2 radii away from each other
        fc.pre(Math.abs(o1x - o2x) >= 2);
        fc.pre(Math.abs(o1y - o2y) >= 2);

        const o1 = obstacle({ origin: victor(o1x, o1y) });
        const o2 = obstacle({ origin: victor(o2x, o2y) });
        const segment = pathCalculator.calculateSegment(o1, o2);
        cb(segment);
      });
    };

    it('both radius vectors should be equal', () => {
      fc.assert(segmentProperty((segment) => {
        victorAssert.equalVectors(segment.r1, segment.r2);
      }));
    });

    it('both radius vectors should have magnitude = 1', () => {
      fc.assert(segmentProperty((segment) => {
        assert.closeTo(segment.r1.magnitude(), 1, 0.01);
      }));
    });
  });

  // TODO:
  // * add tests/properties for opposites exit/entry sides
});
