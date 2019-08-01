const t = require('tap').mocha;
const assert = require('chai').assert;
const victorAssert = require('../victor-assert.js');

const _ = require('lodash');
const victor = require('victor');
const obstacle = require('../../src/obstacle.js');
const pathCalculator = require('../../src/path-calculator/path-calculator.js');

t.describe('a path segment composed of an "either"-exit obstacle followed by a simple obstacle', () => {

  t.context('when the either-obstacle has a northern orientation vector', () => {
    const eitherObstacle = obstacle({ origin: { x: 0, y: 0 }, exit: obstacle.EITHER, leftExitBoundary: { offset: { x: -1, y: 0 }, exit: obstacle.RIGHT }, rightExitBoundary: { offset: { x: 1, y: 0 }, exit: obstacle.LEFT } });

    t.context('when the simple obstacle is to the left of the orientation vector', () => {
      const simpleObstacle = obstacle({ origin: { x: -10, y: 10 } });
      const segment = pathCalculator.calculateSegment(eitherObstacle, simpleObstacle);

      t.it('the path should be using the "left-hand" boundary circle of the either-obstacle', () => {
        victorAssert.equalVectors(segment.boundaryCircle1.origin, victor(-1, 0));
      });

      t.it('the path should have a right exit', () => {
        assert.equal(segment.boundaryCircle1.exit, obstacle.RIGHT);
      });
    });

    t.context('when the simple obstacle is to the right of the orientation vector', () => {
      const simpleObstacle = obstacle({ origin: {x: 10, y: 10 } });
      const segment = pathCalculator.calculateSegment(eitherObstacle, simpleObstacle);

      t.it('the path should be using the "right-hand" boundary circle of the either-obstacle', () => {
        victorAssert.equalVectors(segment.boundaryCircle1.origin, victor(1, 0));
      });

      t.it('the path should have a left exit', () => {
        assert.equal(segment.boundaryCircle1.exit, obstacle.LEFT);
      });
    });

  });

  t.context('when the simple obstacle is directly north of the either-obstacle', () => {
    const eitherObstacle = obstacle({ origin: { x: 0, y: 0 }, exit: obstacle.EITHER, leftExitBoundary: { offset: { x: -1, y: 0 }, exit: obstacle.RIGHT }, rightExitBoundary: { offset: { x: 1, y: 0 }, exit: obstacle.LEFT } });
    const simpleObstacle = obstacle({ origin: { x: 0, y: 10 } });
    const sqrtPointFive = Math.sqrt(0.5);

    t.context('when the either obstacle has a north-east orientation vector', () => {
      const eo = _.assign(_.clone(eitherObstacle), { orientation: 45 });
      const segment = pathCalculator.calculateSegment(obstacle(eo), simpleObstacle);

      t.it('the path should be using the "left-hand" boundary circle of the either-obstacle', () => {
        victorAssert.equalVectors(segment.boundaryCircle1.origin, victor(-1 * sqrtPointFive, sqrtPointFive));
      });

      t.it('the path should have a right exit', () => {
        assert.equal(segment.boundaryCircle1.exit, obstacle.RIGHT);
      });
    });

    t.context('when the either obstacle has a north-west orientation vector', () => {
      const eo = _.assign(_.clone(eitherObstacle), { orientation: 315 });
      const segment = pathCalculator.calculateSegment(obstacle(eo), simpleObstacle);

      t.it('the path should be using the "right-hand" boundary circle of the either-obstacle', () => {
        victorAssert.equalVectors(segment.boundaryCircle1.origin, victor(sqrtPointFive, sqrtPointFive));
      });

      t.it('the path should have a left exit', () => {
        assert.equal(segment.boundaryCircle1.exit, obstacle.LEFT);
      });
    });

  });

});
