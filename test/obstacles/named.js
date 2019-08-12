const t = require('tap').mocha;
const assert = require('chai').assert;
const victorAssert = require('../victor-assert.js');

const victor = require('victor');
const obstacle = require('../../src/obstacle.js');

t.describe('the obstacle constructor', () => {

    t.context('should recognise named obstacles', () => {

      t.it('such as "LeftTurn"', () => {
        const obstacle1 = obstacle({ name: 'LeftTurn', radius: 99.9 });
        assert.equal(obstacle1.name, 'LeftTurn');
        assert.equal(obstacle1.entry, obstacle.RIGHT);
        assert.equal(obstacle1.exit, obstacle.RIGHT);

        t.it('should allow overriding of the "radius" parameter', () => {
          assert.equal(obstacle1.radius, 99.9);
        });
      });

      t.it('such as "RightTurn"', () => {
        const obstacle1 = obstacle({ name: 'RightTurn' });
        assert.equal(obstacle1.name, 'RightTurn');
        assert.equal(obstacle1.entry, obstacle.LEFT);
        assert.equal(obstacle1.exit, obstacle.LEFT);
      });

      t.it('such as "LeftRotation"', () => {
        const obstacle1 = obstacle({ name: 'LeftRotation' });
        assert.equal(obstacle1.name, 'LeftRotation');
        assert.equal(obstacle1.entry, obstacle.RIGHT);
        assert.equal(obstacle1.exit, obstacle.RIGHT);
      });

      t.it('such as "RightRotation"', () => {
        const obstacle1 = obstacle({ name: 'RightRotation' });
        assert.equal(obstacle1.name, 'RightRotation');
        assert.equal(obstacle1.entry, obstacle.LEFT);
        assert.equal(obstacle1.exit, obstacle.LEFT);
      });

      t.it('such as "StartBox"', () => {
        const obstacle1 = obstacle({ name: 'StartBox' });
        assert.equal(obstacle1.name, 'StartBox');
        assert.equal(obstacle1.entry, obstacle.EITHER);
        assert.equal(obstacle1.exit, obstacle.EITHER);
        assert.isNumber(obstacle1.width);
        assert.isNumber(obstacle1.depth);
      });

      t.it('such as "FinishBox"', () => {
        const obstacle1 = obstacle({ name: 'FinishBox' });
        assert.equal(obstacle1.name, 'FinishBox');
        assert.equal(obstacle1.entry, obstacle.EITHER);
        assert.equal(obstacle1.exit, obstacle.EITHER);
        assert.isNumber(obstacle1.width);
        assert.isNumber(obstacle1.depth);
      });

      t.it('such as "Gate"', () => {
        const obstacle1 = obstacle({ name: 'Gate' });
        assert.equal(obstacle1.name, 'Gate');
        assert.equal(obstacle1.entry, obstacle.EITHER);
        assert.equal(obstacle1.exit, obstacle.EITHER);
        assert.isNumber(obstacle1.width);
      });

      t.it('such as "OutOfBounds"', () => {
        const obstacle1 = obstacle({ name: 'OutOfBounds' });
        assert.equal(obstacle1.name, 'OutOfBounds');
        assert.equal(obstacle1.partOfCourse, false);
      });

    });

});
