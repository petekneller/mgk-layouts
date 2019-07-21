const t = require('tap').mocha;
const assert = require('chai').assert;
const victorAssert = require('../victor-assert.js');
const fc = require('fast-check');

const pathCalculator = require('../../src/path-calculator/path-calculator.js');
const obstacle = require('../../src/obstacle.js');
const victor = require('victor');

t.describe('a segment of two obstacles, having different size boundary circles and entry/exit on the same side', () => {

  t.context('when obstacle 1 is at (0,0) with radius 2, obstacle 2 is at (0,10) with radius 1, and entry = exit = right', () => {
    const o1 = obstacle({ origin: victor(0, 0), radius: 2.0, exit: obstacle.RIGHT });
    const o2 = obstacle({ origin: victor(0, 10), radius: 1.0, entry: obstacle.RIGHT });
    const segment = pathCalculator.calculateSegment(o1, o2);

    t.it('exit vector should have magnitude equal to 2', () => {
      assert.closeTo(segment.exit.magnitude(), 2.0, 0.001);
    });

    t.it('entry vector should have magnitude equal to 1', () => {
      assert.closeTo(segment.entry.magnitude(), 1.0, 0.001);
    });

    t.it('both entry and exit vectors should have direction equal to 0.100 radians', () => {
      const expected = 0.100;
      assert.closeTo(segment.exit.direction(), expected, 0.01);
      assert.closeTo(segment.entry.direction(), expected, 0.01);
    });
  });

  t.context('when obstacle 1 is at (0,0) with radius 1, obstacle 2 is at (0,10) with radius 2, and entry = exit = left', () => {
    const o1 = obstacle({ origin: victor(0, 0), radius: 1.0, exit: obstacle.LEFT });
    const o2 = obstacle({ origin: victor(0, 10), radius: 2.0, entry: obstacle.LEFT });
    const segment = pathCalculator.calculateSegment(o1, o2);

    t.it('exit vector should have magnitude equal to 1', () => {
      assert.closeTo(segment.exit.magnitude(), 1.0, 0.001);
    });

    t.it('entry vector should have magnitude equal to 2', () => {
      assert.closeTo(segment.entry.magnitude(), 2.0, 0.001);
    });

    t.it('both entry and exit vectors should have direction equal to PI + 0.100 radians', () => {
      const expected = -1 * Math.PI + 0.100;
      assert.closeTo(segment.exit.direction(), expected, 0.01);
      assert.closeTo(segment.entry.direction(), expected, 0.01);
    });
  });

  t.context('when obstacles are at least the boundary circle radius apart', () => {
    const segmentProperty = (cb) => {
      return fc.property(fc.nat(), fc.nat(), fc.nat(), fc.nat(), fc.double(0.001, 100.0), fc.double(0.001, 100.0), fc.boolean(), (o1x, o1y, o2x, o2y, r1, r2, b) => {
        // obstacles can't be less than 2 radii away from each other
        fc.pre(Math.abs(o1x - o2x) >= r1+r2);
        fc.pre(Math.abs(o1y - o2y) >= r1+r2);

        const entryAndExit = b ? obstacle.LEFT : obstacle.RIGHT;
        const o1 = obstacle({ origin: victor(o1x, o1y), radius: r1, exit: entryAndExit });
        const o2 = obstacle({ origin: victor(o2x, o2y), radius: r2, entry: entryAndExit });
        cb(o1, o2);
      });
    };

    t.it('both entry and exit vectors should have equal direction', () => {
      fc.assert(segmentProperty((o1, o2) => {
        const segment = pathCalculator.calculateSegment(o1, o2);
        assert.closeTo(segment.exit.direction(), segment.entry.direction(), 0.01);
      }));
    });

    t.it('exit vector should have magnitude equal to boundary circle radius 1', () => {
      fc.assert(segmentProperty((o1, o2) => {
        const segment = pathCalculator.calculateSegment(o1, o2);
        assert.closeTo(segment.exit.magnitude(), segment.obstacle1.radius, 0.01);
      }));
    });

    t.it('entry vector should have magnitude equal to boundary circle radius 2', () => {
      fc.assert(segmentProperty((o1, o2) => {
        const segment = pathCalculator.calculateSegment(o1, o2);
        assert.closeTo(segment.entry.magnitude(), segment.obstacle2.radius, 0.01);
      }));
    });

  });

});
