const t = require('tap').mocha;
const assert = require('chai').assert;
const victorAssert = require('../victor-assert.js');

const victor = require('victor');
const obstacle = require('../../src/obstacle.js');

t.describe('the obstacle constructor', () => {

    t.context('should add a default value for', () => {
      const obstacle1 = obstacle();

      t.it('origin', () => {
        assert.exists(obstacle1.origin);
      });
      t.it('boundary circle radius', () => {
        assert.exists(obstacle1.radius);
      });
      t.it('entry side', () => {
        assert.exists(obstacle1.exit);
      });
      t.it('exit side', () => {
        assert.exists(obstacle1.entry);
      });
      t.it('orientation', () => {
        assert.exists(obstacle1.orientation);
      });

      t.context('if the entry is "either"', () => {
        const obstacle1 = obstacle({ entry: obstacle.EITHER });
        t.it('the leftEntryBoundary', () => {
          assert.exists(obstacle1.leftEntryBoundary);
        });
        t.it('the rightEntryBoundary', () => {
          assert.exists(obstacle1.rightEntryBoundary);
        });
      });

      t.context('if the exit is "either"', () => {
        const obstacle1 = obstacle({ exit: obstacle.EITHER });
        t.it('the leftExitBoundary', () => {
          assert.exists(obstacle1.leftExitBoundary);
        });
        t.it('the rightExitBoundary', () => {
          assert.exists(obstacle1.rightExitBoundary);
        });
      });

    });

    t.it('should pass through other parameters unmodified', () => {
      const obstacle1 = obstacle({ foo: 'bar' });
      assert.equal(obstacle1.foo, 'bar');
    });

});
