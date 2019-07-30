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
        assert.equal(obstacleFor({ orientation: 'N' }).orientation, 0);
        assert.equal(obstacleFor({ orientation: 'E' }).orientation, 90);
        assert.equal(obstacleFor({ orientation: 'S' }).orientation, 180);
        assert.equal(obstacleFor({ orientation: 'W' }).orientation, 270);
      });

      t.it('if it is a number describing a compass bearing', () => {
        const sqrtPointFive = Math.sqrt(0.5);
        assert.equal(obstacleFor({ orientation: 0}).orientation, 0);
        assert.equal(obstacleFor({ orientation: 45 }).orientation, 45);
        assert.equal(obstacleFor({ orientation: 90}).orientation, 90);
        assert.equal(obstacleFor({ orientation: 135 }).orientation, 135);
        assert.equal(obstacleFor({ orientation: 180}).orientation, 180);
        assert.equal(obstacleFor({ orientation: 225 }).orientation, 225);
        assert.equal(obstacleFor({ orientation: 270}).orientation, 270);
        assert.equal(obstacleFor({ orientation: 315 }).orientation, 315);
      });
    });

    t.it('should be idempotent in converting the "orientation" parameter', () => {
      assert.equal(obstacleFor({ orientation: 45 }).orientation, 45);
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

      t.context('if the entry is "either"', () => {
        const obstacle1 = obstacle({ entry: obstacle.EITHER });
        t.it('the leftEntryBoundaryOrigin', () => {
          assert.exists(obstacle1.leftEntryBoundaryOrigin);
        });
        t.it('the rightEntryBoundaryOrigin', () => {
          assert.exists(obstacle1.rightEntryBoundaryOrigin);
        });
      });

      t.context('if the exit is "either"', () => {
        const obstacle1 = obstacle({ exit: obstacle.EITHER });
        t.it('the leftExitBoundaryOrigin', () => {
          assert.exists(obstacle1.leftExitBoundaryOrigin);
        });
        t.it('the rightExitBoundaryOrigin', () => {
          assert.exists(obstacle1.rightExitBoundaryOrigin);
        });
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
        assert.isNumber(obstacle1.width);
        assert.isNumber(obstacle1.depth);
      });

      t.it('such as "FinishBox"', () => {
        const input = { obstacles: [{ name: 'FinishBox' }] };
        const obstacle1 = deserializer(input).obstacles[0];
        assert.equal(obstacle1.name, 'FinishBox');
        assert.equal(obstacle1.entry, obstacle.EITHER);
        assert.equal(obstacle1.exit, obstacle.EITHER);
        assert.isNumber(obstacle1.width);
        assert.isNumber(obstacle1.depth);
      });

      t.it('such as "Gate"', () => {
        const input = { obstacles: [{ name: 'Gate' }] };
        const obstacle1 = deserializer(input).obstacles[0];
        assert.equal(obstacle1.name, 'Gate');
        assert.equal(obstacle1.entry, obstacle.EITHER);
        assert.equal(obstacle1.exit, obstacle.EITHER);
        assert.isNumber(obstacle1.width);
      });

    });
  });

});
