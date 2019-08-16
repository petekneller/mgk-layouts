const t = require('tap').mocha;
const assert = require('chai').assert;

const pathCalculator = require('../../src/path-calculator');
import obstacle from '../../src/obstacles';

t.describe('pathCalculator.calculateSegments', () => {
  t.context('when the input contains obstacle marked as not participating in the course', () => {

    t.it('the output should not contain those obstacles', () => {
      const course = [
        obstacle({ id: 1 }),
        obstacle({ id: 2, partOfCourse: false }),
        obstacle({ id: 3 })
      ];

      const segments = pathCalculator.calculateSegments(course);
      assert.lengthOf(segments, 1);
      assert.equal(segments[0].obstacle1.id, 1);
      assert.equal(segments[0].obstacle2.id, 3);
    });

  });
});
