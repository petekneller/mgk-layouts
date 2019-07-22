const t = require('tap').mocha;
const assert = require('chai').assert;
const victorAssert = require('../victor-assert.js');

const victor = require('victor');
const deserializer = require('../../src/serialization/deserializer.js');
const obstacle = require('../../src/obstacle.js');

t.describe('the deserialiser', () => {

  t.it('should convert each element of the "obstacles" array into an obstacle', () => {
    const input = {
      obstacles: [{
        origin: { x: 1, y: 2 }
      }, {
        origin: { x: 2, y: 3 }
      }]
    };
    const output = deserializer(input);

    assert.exists(output.obstacles);
    assert.equal(output.obstacles.length, 2);

    const obstacle1 = output.obstacles[0];
    assert.exists(obstacle1.origin);
  });

  t.context('for each obstacle in the course', () => {
    const obstacleFor = function(obs) {
      return deserializer({ obstacles: [obs] }).obstacles[0];
    };

    t.it('should convert the (x,y) "origin" parameter into a vector', () => {
      const obstacle1 = obstacleFor({ origin: { x: 1, y: 2 } });
      victorAssert.equalVectors(obstacle1.origin, victor(1, 2));
    });

    t.it('should be idempotent in converting the "origin" parameter', () => {
      const obstacle1 = obstacleFor({ origin: victor(1, 2) });
      victorAssert.equalVectors(obstacle1.origin, victor(1, 2));
    });

    t.it('should convert the "entry" parameter into one of the recognised enums', () => {
      assert.equal(obstacleFor({ entry: 'Left' }).entry, obstacle.LEFT);
      assert.equal(obstacleFor({ entry: 'Right' }).entry, obstacle.RIGHT);
      assert.equal(obstacleFor({ entry: 'Either' }).entry, obstacle.EITHER);
    });

    t.it('should be idempotent in converting the "entry" parameter', () => {
      assert.equal(obstacleFor({ entry: obstacle.LEFT }).entry, obstacle.LEFT);
    });

    t.it('should ignore unknown "entry" parameters', () => {
      assert.equal(obstacleFor({ entry: 'unknown' }).entry, 'unknown');
    });

    t.it('should convert the "exit" parameter into one of the recognised enums', () => {
      assert.equal(obstacleFor({ exit: 'Left' }).exit, obstacle.LEFT);
      assert.equal(obstacleFor({ exit: 'Right' }).exit, obstacle.RIGHT);
      assert.equal(obstacleFor({ exit: 'Either' }).exit, obstacle.EITHER);
    });

    t.it('should be idempotent in converting the "exit" parameter', () => {
      assert.equal(obstacleFor({ exit: obstacle.LEFT }).exit, obstacle.LEFT);
    });

    t.it('should ignore unknown "exit" parameters', () => {
      assert.equal(obstacleFor({ exit: 'unknown' }).exit, 'unknown');
    });

    t.context('should convert the "orientation" parameter', () => {
      t.it('if it is a string describing a cardinal point', () => {
        victorAssert.equalVectors(obstacleFor({ orientation: 'N' }).orientation, victor(0, 1));
        victorAssert.equalVectors(obstacleFor({ orientation: 'E' }).orientation, victor(1, 0));
        victorAssert.equalVectors(obstacleFor({ orientation: 'S' }).orientation, victor(0, -1));
        victorAssert.equalVectors(obstacleFor({ orientation: 'W' }).orientation, victor(-1, 0));
      });

      t.it('if it is a number describing a compass bearing', () => {
        const sqrtPointFive = Math.sqrt(0.5);
        victorAssert.equalVectors(obstacleFor({ orientation: 0}).orientation, victor(0, 1));
        victorAssert.equalVectors(obstacleFor({ orientation: 45 }).orientation, victor(sqrtPointFive, sqrtPointFive));
        victorAssert.equalVectors(obstacleFor({ orientation: 90}).orientation, victor(1, 0));
        victorAssert.equalVectors(obstacleFor({ orientation: 135 }).orientation, victor(sqrtPointFive, -1 * sqrtPointFive));
        victorAssert.equalVectors(obstacleFor({ orientation: 180}).orientation, victor(0, -1));
        victorAssert.equalVectors(obstacleFor({ orientation: 225 }).orientation, victor(-1 * sqrtPointFive, -1 * sqrtPointFive));
        victorAssert.equalVectors(obstacleFor({ orientation: 270}).orientation, victor(-1, 0));
        victorAssert.equalVectors(obstacleFor({ orientation: 315 }).orientation, victor(-1 * sqrtPointFive, sqrtPointFive));
      });
    });

    t.it('should be idempotent in converting the "orientation" parameter', () => {
      victorAssert.equalVectors(obstacleFor({ orientation: victor(0, 1) }).orientation, victor(0, 1));
    });

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

    });

    t.it('should pass through other parameters unmodified', () => {
      const obstacle1 = obstacleFor({ foo: 'bar' });
      assert.equal(obstacle1.foo, 'bar');
    });

    t.context('should recognise named obstacles', () => {

      t.it('such as "LeftTurn"', () => {
        const input = { obstacles: [{ name: 'LeftTurn', radius: 99.9 }] };
        const obstacle1 = deserializer(input).obstacles[0];
        assert.equal(obstacle1.name, 'LeftTurn');
        assert.equal(obstacle1.entry, obstacle.RIGHT);
        assert.equal(obstacle1.exit, obstacle.RIGHT);

        t.it('should allow overriding of the "radius" parameter', () => {
          assert.equal(obstacle1.radius, 99.9);
        });
      });

      t.it('such as "RightTurn"', () => {
        const input = { obstacles: [{ name: 'RightTurn' }] };
        const obstacle1 = deserializer(input).obstacles[0];
        assert.equal(obstacle1.name, 'RightTurn');
        assert.equal(obstacle1.entry, obstacle.LEFT);
        assert.equal(obstacle1.exit, obstacle.LEFT);
      });

      t.it('such as "LeftRotation"', () => {
        const input = { obstacles: [{ name: 'LeftRotation' }] };
        const obstacle1 = deserializer(input).obstacles[0];
        assert.equal(obstacle1.name, 'LeftRotation');
        assert.equal(obstacle1.entry, obstacle.RIGHT);
        assert.equal(obstacle1.exit, obstacle.RIGHT);
      });

      t.it('such as "RightRotation"', () => {
        const input = { obstacles: [{ name: 'RightRotation' }] };
        const obstacle1 = deserializer(input).obstacles[0];
        assert.equal(obstacle1.name, 'RightRotation');
        assert.equal(obstacle1.entry, obstacle.LEFT);
        assert.equal(obstacle1.exit, obstacle.LEFT);
      });

      t.it('such as "StartBox"', () => {
        const input = { obstacles: [{ name: 'StartBox' }] };
        const obstacle1 = deserializer(input).obstacles[0];
        assert.equal(obstacle1.name, 'StartBox');
        assert.equal(obstacle1.entry, obstacle.EITHER);
        assert.equal(obstacle1.exit, obstacle.EITHER);
      });

      t.it('such as "FinishBox"', () => {
        const input = { obstacles: [{ name: 'FinishBox' }] };
        const obstacle1 = deserializer(input).obstacles[0];
        assert.equal(obstacle1.name, 'FinishBox');
        assert.equal(obstacle1.entry, obstacle.EITHER);
        assert.equal(obstacle1.exit, obstacle.EITHER);
      });

      t.it('such as "Gate"', () => {
        const input = { obstacles: [{ name: 'Gate' }] };
        const obstacle1 = deserializer(input).obstacles[0];
        assert.equal(obstacle1.name, 'Gate');
        assert.equal(obstacle1.entry, obstacle.EITHER);
        assert.equal(obstacle1.exit, obstacle.EITHER);
      });

    });
  });

});
