const t = require('tap').mocha;
const assert = require('chai').assert;
const victorAssert = require('../victor-assert.js');

const _ = require('lodash');
const victor = require('victor');
const obstacle = require('../../src/obstacle.js');
const pathCalculator = require('../../src/path-calculator/path-calculator.js');

t.describe('a path segment composed of a simple obstacle followed by an "either"-entry obstacle', () => {

  t.context('when the either-obstacle has a northern orientation vector', () => {
    const eitherObstacle = obstacle({ origin: { x: 0, y: 10 }, entry: obstacle.EITHER, leftEntryBoundary: { offset: { x: -1, y: 0 } }, rightEntryBoundary: { offset: { x: 1, y: 0 } } });

    t.context('when the simple obstacle is to the left of the orientation vector', () => {
      const simpleObstacle = obstacle({ origin: { x: -10, y: 0 } });
      const segment = pathCalculator.calculateSegment(simpleObstacle, eitherObstacle);

      t.it('the path should be using the "left-hand" boundary circle of the either-obstacle', () => {
        victorAssert.equalVectors(segment.boundaryCircle2.origin, victor(-1, 10));
      });

      t.it('the path should have a right entry', () => {
        assert.equal(segment.boundaryCircle2.entry, obstacle.RIGHT);
      });
    });

    t.context('when the simple obstacle is to the right of the orientation vector', () => {
      const simpleObstacle = obstacle({ origin: {x: 10, y: 0 } });
      const segment = pathCalculator.calculateSegment(simpleObstacle, eitherObstacle);

      t.it('the path should be using the "right-hand" boundary circle of the either-obstacle', () => {
        victorAssert.equalVectors(segment.boundaryCircle2.origin, victor(1, 10));
      });

      t.it('the path should have a left entry', () => {
        assert.equal(segment.boundaryCircle2.entry, obstacle.LEFT);
      });
    });

  });

  t.context('when the simple obstacle is directly south of the either-obstacle', () => {
    const eitherObstacle = obstacle({ origin: { x: 0, y: 10 }, entry: obstacle.EITHER, leftEntryBoundary: { offset: { x: -1, y: 0 } }, rightEntryBoundary: { offset: { x: 1, y: 0 } } });
    const simpleObstacle = obstacle({ origin: { x: 0, y: 0 } });
    const sqrtPointFive = Math.sqrt(0.5);

    t.context('when the either obstacle has a north-west orientation vector', () => {
      const eo = _.assign(_.clone(eitherObstacle), { orientation: 315 });
      const segment = pathCalculator.calculateSegment(simpleObstacle, obstacle(eo));

      t.it('the path should be using the "left-hand" boundary circle of the either-obstacle', () => {
        victorAssert.equalVectors(segment.boundaryCircle2.origin, victor(-1 * sqrtPointFive, 10 - sqrtPointFive));
      });

      t.it('the path should have a right entry', () => {
        assert.equal(segment.boundaryCircle2.entry, obstacle.RIGHT);
      });
    });

    t.context('when the either obstacle has a north-east orientation vector', () => {
      const eo = _.assign(_.clone(eitherObstacle), { orientation: 45 });
      const segment = pathCalculator.calculateSegment(simpleObstacle, obstacle(eo));

      t.it('the path should be using the "right-hand" boundary circle of the either-obstacle', () => {
        victorAssert.equalVectors(segment.boundaryCircle2.origin, victor(sqrtPointFive, 10 - sqrtPointFive));
      });

      t.it('the path should have a left entry', () => {
        assert.equal(segment.boundaryCircle2.entry, obstacle.LEFT);
      });
    });

  });

});
