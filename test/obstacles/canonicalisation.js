const t = require('tap').mocha;
const assert = require('chai').assert;
const victorAssert = require('../victor-assert.js');

const victor = require('victor');
const obstacle = require('../../src/obstacle.js');

t.describe('the obstacle constructor', () => {

    t.it('should convert the (x,y) "origin" parameter into a vector', () => {
      const obstacle1 = obstacle({ origin: { x: 1, y: 2 } });
      victorAssert.equalVectors(obstacle1.origin, victor(1, 2));
    });

    t.it('should be idempotent in converting the "origin" parameter', () => {
      const obstacle1 = obstacle({ origin: victor(1, 2) });
      victorAssert.equalVectors(obstacle1.origin, victor(1, 2));
    });

    t.it('should convert the "entry" parameter into one of the recognised enums', () => {
      assert.equal(obstacle({ entry: 'Left' }).entry, obstacle.LEFT);
      assert.equal(obstacle({ entry: 'Right' }).entry, obstacle.RIGHT);
      assert.equal(obstacle({ entry: 'Either' }).entry, obstacle.EITHER);
    });

    t.it('should be idempotent in converting the "entry" parameter', () => {
      assert.equal(obstacle({ entry: obstacle.LEFT }).entry, obstacle.LEFT);
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
        const sqrtPointFive = Math.sqrt(0.5);
        assert.equal(obstacle({ orientation: 0}).orientation, 0);
        assert.equal(obstacle({ orientation: 45 }).orientation, 45);
        assert.equal(obstacle({ orientation: 90}).orientation, 90);
        assert.equal(obstacle({ orientation: 135 }).orientation, 135);
        assert.equal(obstacle({ orientation: 180}).orientation, 180);
        assert.equal(obstacle({ orientation: 225 }).orientation, 225);
        assert.equal(obstacle({ orientation: 270}).orientation, 270);
        assert.equal(obstacle({ orientation: 315 }).orientation, 315);
      });
    });

    t.it('should be idempotent in converting the "orientation" parameter', () => {
      assert.equal(obstacle({ orientation: 45 }).orientation, 45);
    });

});
