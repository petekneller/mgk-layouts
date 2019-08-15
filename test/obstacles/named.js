const t = require('tap').mocha;
const assert = require('chai').assert;
const fc = require('fast-check');

import obstacle from '../../src/obstacles';

t.describe('the obstacle constructor', () => {

    t.context('should recognise named obstacles', () => {

      t.it('such as "LeftTurn"', () => {
        const obstacle1 = obstacle({ name: 'LeftTurn' });
        assert.equal(obstacle1.name, 'LeftTurn');
      });

      t.it('such as "RightTurn"', () => {
        const obstacle1 = obstacle({ name: 'RightTurn' });
        assert.equal(obstacle1.name, 'RightTurn');
      });

      t.it('such as "LeftRotation"', () => {
        const obstacle1 = obstacle({ name: 'LeftRotation' });
        assert.equal(obstacle1.name, 'LeftRotation');
      });

      t.it('such as "RightRotation"', () => {
        const obstacle1 = obstacle({ name: 'RightRotation' });
        assert.equal(obstacle1.name, 'RightRotation');
      });

      t.it('such as "StartBox"', () => {
        const obstacle1 = obstacle({ name: 'StartBox' });
        assert.equal(obstacle1.name, 'StartBox');
        assert.isNumber(obstacle1.width);
        assert.isNumber(obstacle1.depth);
      });

      t.it('such as "FinishBox"', () => {
        const obstacle1 = obstacle({ name: 'FinishBox' });
        assert.equal(obstacle1.name, 'FinishBox');
        assert.isNumber(obstacle1.width);
        assert.isNumber(obstacle1.depth);
      });

      t.it('such as "Gate"', () => {
        const obstacle1 = obstacle({ name: 'Gate' });
        assert.equal(obstacle1.name, 'Gate');
        assert.isNumber(obstacle1.width);
      });

      t.it('such as "OutOfBounds"', () => {
        const obstacle1 = obstacle({ name: 'OutOfBounds' });
        assert.equal(obstacle1.name, 'OutOfBounds');
        assert.equal(obstacle1.partOfCourse, false);
      });

      t.context('if the obstacle is broadly a left-hand turn', () => {
        const names = ['LeftTurn', 'LeftRotation'];

        t.it('should have entry and exit of RIGHT', () => {
          names.map(n => {
            const o = obstacle({ name: n });
            assert.equal(o.name, n);
            assert.equal(o.entry, obstacle.RIGHT);
            assert.equal(o.exit, obstacle.RIGHT);
          });
        });
      });

      t.context('if the obstacle is broadly a right-hand turn', () => {
        const names = ['RightTurn', 'RightRotation'];

        t.it('should have entry and exit of LEFT', () => {
          names.map(n => {
            const o = obstacle({ name: n });
            assert.equal(o.name, n);
            assert.equal(o.entry, obstacle.LEFT);
            assert.equal(o.exit, obstacle.LEFT);
          });
        });
      });

      t.context('if the obstacle is an "either"', () => {
        const names = ['Gate', 'StartBox', 'FinishBox'];

        t.it('should have entry and exit of EITHER', () => {
          names.map(n => {
            const o = obstacle({ name: n });
            assert.equal(o.name, n);
            assert.equal(o.entry, obstacle.EITHER);
            assert.equal(o.exit, obstacle.EITHER);
          });
        });
      });

      t.context('should allow overriding of', () => {
        const names = ['LeftTurn', 'LeftRotation', 'RightTurn', 'RightRotation', 'Gate', 'StartBox', 'FinishBox'];

        t.it('the "radius" parameter', () => {
          fc.assert(fc.property(fc.double(1000), (r) => {
            names.map(n => {
              const o = obstacle({ name: n, radius: r });
              assert.equal(o.name, n);
              assert.equal(o.radius, r);
            });
          }));
        });
      });

    });

});
