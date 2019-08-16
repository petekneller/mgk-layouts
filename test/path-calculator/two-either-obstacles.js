const t = require('tap').mocha;
const assert = require('chai').assert;
const victorAssert = require('../victor-assert.js');

const victor = require('victor');
import obstacle from '../../src/obstacles';
const pathCalculator = require('../../src/path-calculator');

t.describe('a path segment composed of two "either" obstacles', () => {

  const obstacle1 = obstacle({ origin: { x: 0, y: 0 }, entry: obstacle.EITHER, exit: obstacle.EITHER, radius: 1 });

    t.context('when obstacle 2 is to the left of obstacle 1', () => {
      const obstacle2 = obstacle({ origin: { x: -10, y: 10 }, entry: obstacle.EITHER, exit: obstacle.EITHER, radius: 1 });
      const segment = pathCalculator.calculateSegment(obstacle1, obstacle2);

      t.it('the path should be using the "left-hand" boundary circle of obstacle 1', () => {
        victorAssert.equalVectors(segment.boundaryCircle1.origin, victor(-1, 0));
      });

      t.it('the path should have a right exit', () => {
        assert.equal(segment.boundaryCircle1.exit, obstacle.RIGHT);
      });

      t.it('the path should be using the "right-hand" boundary circle of obstacle 2', () => {
        victorAssert.equalVectors(segment.boundaryCircle2.origin, victor(-9, 10));
      });

      t.it('the path should have a left entry', () => {
        assert.equal(segment.boundaryCircle2.entry, obstacle.LEFT);
      });
    });

    t.context('when obstacle 2 is to the right of obstacle 1', () => {
      const obstacle2 = obstacle({ origin: { x: 10, y: 10 }, entry: obstacle.EITHER, exit: obstacle.EITHER, radius: 1 });
      const segment = pathCalculator.calculateSegment(obstacle1, obstacle2);

      t.it('the path should be using the "right-hand" boundary circle of obstacle 1', () => {
        victorAssert.equalVectors(segment.boundaryCircle1.origin, victor(1, 0));
      });

      t.it('the path should have a left exit', () => {
        assert.equal(segment.boundaryCircle1.exit, obstacle.LEFT);
      });

      t.it('the path should be using the "left-hand" boundary circle of obstacle 2', () => {
        victorAssert.equalVectors(segment.boundaryCircle2.origin, victor(9, 10));
      });

      t.it('the path should have a right entry', () => {
        assert.equal(segment.boundaryCircle2.entry, obstacle.RIGHT);
      });
    });

});
