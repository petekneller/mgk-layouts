const t = require('tap').mocha;
const assert = require('chai').assert;
const victorAssert = require('../victor-assert.js');
const fc = require('fast-check');

const pathCalculator = require('../../src/path-calculator');
import obstacle from '../../src/obstacles';
import vector from '../../src/vectors';

t.describe('a segment of two obstacles, both with the same boundary circle radius and having entry/exit on opposite sides', () => {

  t.context('when obstacle 1 is at (0,0), obstacle 2 is at (0,10), boundary circle radius = 1 and entry = left, exit = right', () => {
    const o1 = obstacle({ origin: vector(0, 0), exit: obstacle.RIGHT });
    const o2 = obstacle({ origin: vector(0, 10), entry: obstacle.LEFT });
    const segment = pathCalculator.calculateSegment(o1, o2);

    t.it('exit vector should be have magnitude of 1 and angle of 0.201 radians', () => {
      const expected = vector(1, 0).rotate(0.201);
      victorAssert.equalVectors(segment.exit, expected);
    });

    t.it('entry vector should be have magnitude of 1 and angle of 0.201 radians from -x axis', () => {
      const expected = vector(-1, 0).rotate(0.201);
      victorAssert.equalVectors(segment.entry, expected);
    });
  });

  t.context('when obstacle 1 is at (0,0), obstacle 2 is at (-10,-10), boundary circle radius = 1 and entry = right, exit = left', () => {
    const o1 = obstacle({ origin: vector(0, 0), exit: obstacle.LEFT });
    const o2 = obstacle({ origin: vector(-10, -10), entry: obstacle.RIGHT });
    const segment = pathCalculator.calculateSegment(o1, o2);

    t.it('exit vector should be have magnitude of 1 and angle of -0.142 radians from -PI/4', () => {
      const expected = vector(1, 0).rotate(-1/4 * Math.PI).rotate(-0.142);
      victorAssert.equalVectors(segment.exit, expected);
    });

    t.it('entry vector should be have magnitude of 1 and angle of -0.142 radians from 3/4 PI', () => {
      const expected = vector(1, 0).rotate(3/4 * Math.PI).rotate(-0.142);
      victorAssert.equalVectors(segment.entry, expected);
    });
  });

  t.context('when obstacles are at least the boundary circle radius apart', () => {
    const segmentProperty = (cb) => {
      return fc.property(fc.nat(), fc.nat(), fc.nat(), fc.nat(), fc.double(0.001, 100.0), fc.boolean(), (o1x, o1y, o2x, o2y, r, b) => {
        // obstacles can't be less than 2 radii away from each other
        fc.pre(Math.abs(o1x - o2x) >= 2*r);
        fc.pre(Math.abs(o1y - o2y) >= 2*r);

        const entry = b ? obstacle.LEFT : obstacle.RIGHT;
        const exit = entry === obstacle.LEFT ? obstacle.RIGHT : obstacle.LEFT;
        const o1 = obstacle({ origin: vector(o1x, o1y), radius: r, exit });
        const o2 = obstacle({ origin: vector(o2x, o2y), radius: r, entry });
        const segment = pathCalculator.calculateSegment(o1, o2);
        cb(segment);
      });
    };

    t.it('entry and exit vectors should be opposite one another', () => {
      fc.assert(segmentProperty((segment) => {
        victorAssert.equalVectors(segment.exit, segment.entry.rotate(Math.PI));
      }));
    });

    t.it('both entry and exit vectors should have magnitude = boundary circle radius', () => {
      fc.assert(segmentProperty((segment) => {
        assert.closeTo(segment.exit.magnitude(), segment.obstacle1.radius, 0.01);
        assert.closeTo(segment.entry.magnitude(), segment.obstacle1.radius, 0.01);
      }));
    });
  });

});
