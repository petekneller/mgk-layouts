const t = require('tap').mocha;
const assert = require('chai').assert;
const victorAssert = require('../victor-assert.js');
const fc = require('fast-check');

const victor = require('victor');
const obstacle = require('../../src/obstacles');

t.describe('the obstacle constructor', () => {

    t.it('should convert the (x,y) "origin" parameter into a vector', () => {
      fc.assert(fc.property(fc.nat(), fc.nat(), (x, y) => {
        const obstacle1 = obstacle({ origin: { x, y } });
        victorAssert.equalVectors(obstacle1.origin, victor(x, y));
      }));
    });

    t.it('should be idempotent in converting the "origin" parameter', () => {
      fc.assert(fc.property(fc.nat(), fc.nat(), (x, y) => {
        const obstacle1 = obstacle({ origin: victor(x, y) });
        victorAssert.equalVectors(obstacle1.origin, victor(x, y));
      }));
    });

    t.it('should convert the "entry" parameter into one of the recognised enums', () => {
      assert.equal(obstacle({ entry: 'Left' }).entry, obstacle.LEFT);
      assert.equal(obstacle({ entry: 'Right' }).entry, obstacle.RIGHT);
      assert.equal(obstacle({ entry: 'Either' }).entry, obstacle.EITHER);
    });

    t.it('should be idempotent in converting the "entry" parameter', () => {
      assert.equal(obstacle({ entry: obstacle.LEFT }).entry, obstacle.LEFT);
      assert.equal(obstacle({ entry: obstacle.RIGHT }).entry, obstacle.RIGHT);
      assert.equal(obstacle({ entry: obstacle.EITHER }).entry, obstacle.EITHER);
    });

    t.it('should ignore unknown "entry" parameters', () => {
      assert.equal(obstacle({ entry: 'unknown' }).entry, 'unknown');
    });

    t.it('should convert the "exit" parameter into one of the recognised enums', () => {
      assert.equal(obstacle({ exit: 'Left' }).exit, obstacle.LEFT);
      assert.equal(obstacle({ exit: 'Right' }).exit, obstacle.RIGHT);
      assert.equal(obstacle({ exit: 'Either' }).exit, obstacle.EITHER);
    });

    t.it('should be idempotent in converting the "exit" parameter', () => {
      assert.equal(obstacle({ exit: obstacle.LEFT }).exit, obstacle.LEFT);
      assert.equal(obstacle({ exit: obstacle.RIGHT }).exit, obstacle.RIGHT);
      assert.equal(obstacle({ exit: obstacle.EITHER }).exit, obstacle.EITHER);
    });

    t.it('should ignore unknown "exit" parameters', () => {
      assert.equal(obstacle({ exit: 'unknown' }).exit, 'unknown');
    });

    t.context('should convert the "orientation" parameter', () => {
      t.it('if it is a string describing a cardinal point', () => {
        assert.equal(obstacle({ orientation: 'N' }).orientation, 0);
        assert.equal(obstacle({ orientation: 'E' }).orientation, 90);
        assert.equal(obstacle({ orientation: 'S' }).orientation, 180);
        assert.equal(obstacle({ orientation: 'W' }).orientation, 270);
      });

      t.it('if it is a number describing a compass bearing', () => {
        fc.assert(fc.property(fc.double(360.0), bearing => {
          assert.equal(obstacle({ orientation: bearing}).orientation, bearing);
        }));
      });
    });

});
