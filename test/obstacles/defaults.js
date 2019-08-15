const t = require('tap').mocha;
const assert = require('chai').assert;
const victorAssert = require('../victor-assert.js');
const fc = require('fast-check');

import obstacle from '../../src/obstacles';

t.describe('the obstacle constructor', () => {

  t.context('should add a default value for', () => {
    const obstacle1 = obstacle();

    t.it('origin', () => {
      victorAssert.isVector(obstacle1.origin);
    });
    t.it('boundary circle radius', () => {
      assert.isNumber(obstacle1.radius);
    });
    t.it('entry side', () => {
      assert.typeOf(obstacle1.exit, 'symbol');
    });
    t.it('exit side', () => {
      assert.typeOf(obstacle1.entry, 'symbol');
    });
    t.it('orientation', () => {
      assert.isNumber(obstacle1.orientation);
    });

    const testBoundary = b => {
      t.it('has an offset', () => {
        assert.isObject(b.offset);
      });
      t.it('has a radius', () => {
        assert.isNumber(b.radius);
      });
      // TODO: can't test entry/exit because it won't have both....
      // .... can if I were to unify it to 'side'
    };

    t.context('the leftEntryBoundary', () => {
      testBoundary(obstacle1.leftEntryBoundary);
    });
    t.context('the rightEntryBoundary', () => {
      testBoundary(obstacle1.rightEntryBoundary);
    });
    t.context('the leftExitBoundary', () => {
      testBoundary(obstacle1.leftExitBoundary);
    });
    t.context('the rightExitBoundary', () => {
      testBoundary(obstacle1.rightExitBoundary);
    });

    t.context('if the entry is "either"', () => {
      const obstacle1 = obstacle({ entry: obstacle.EITHER });

      t.context('the leftEntryBoundary', () => {
        testBoundary(obstacle1.leftEntryBoundary);
        t.it('has an entry of RIGHT', () => {
          assert.equal(obstacle1.leftEntryBoundary.entry, obstacle.RIGHT);
        });
      });

      t.context('the rightEntryBoundary', () => {
        testBoundary(obstacle1.rightEntryBoundary);
        t.it('has an entry of LEFT', () => {
          assert.equal(obstacle1.rightEntryBoundary.entry, obstacle.LEFT);
        });
      });

    });

    t.context('if the exit is "either"', () => {
      const obstacle1 = obstacle({ exit: obstacle.EITHER });

      t.context('the leftExitBoundary', () => {
        testBoundary(obstacle1.leftExitBoundary);
        t.it('has an exit of RIGHT', () => {
          assert.equal(obstacle1.leftExitBoundary.exit, obstacle.RIGHT);
        });
      });

      t.context('the rightExitBoundary', () => {
        testBoundary(obstacle1.rightExitBoundary);
        t.it('has an entry of LEFT', () => {
          assert.equal(obstacle1.rightExitBoundary.exit, obstacle.LEFT);
        });
      });

    });
  });

  t.it('should pass through other parameters unmodified', () => {
    const obstacle1 = obstacle({ foo: 'bar' });
    assert.equal(obstacle1.foo, 'bar');
  });

  t.context('should set boundaries on properties', () => {

    t.it('radius should be > 0', () => {
      assert.isAbove(obstacle({ radius: 0 }).radius, 0);
      fc.assert(fc.property(fc.double(Number.MIN_VALUE, Number.MAX_VALUE), r => {
        assert.isAbove(obstacle({ radius: r }).radius, 0);
      }));
    });

  });

});
