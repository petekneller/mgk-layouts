const t = require('tap').mocha;
const assert = require('chai').assert;
const victorAssert = require('../victor-assert.js');

const pathCalculator = require('../../src/path-calculator');
import obstacle from '../../src/obstacles';
import vector from '../../src/vectors';

t.describe('the segment object returned by pathCalculator.calculateSegment should contain intermediate calculations and debugging information', () => {
  const o1 = obstacle({ origin: vector(0, 0) });
  const o2 = obstacle({ origin: vector(0, 10) });
  const segment = pathCalculator.calculateSegment(o1, o2);

  t.it('should contain both the original obstacles', () => {
    assert.equal(segment.obstacle1, o1);
    assert.equal(segment.obstacle2, o2);
  });

  t.it('should contain the vector "o12" between the two obstacle origins', () => {
    assert.exists(segment.o12);
    victorAssert.equalVectors(segment.o12, vector(0, 10));
  });

  t.it('should contain the data on the boundary circles used for each obstacle', () => {
    assert.exists(segment.boundaryCircle1);
    victorAssert.equalVectors(segment.boundaryCircle1.origin, o1.origin);
    assert.equal(segment.boundaryCircle1.radius, o1.radius);
    assert.equal(segment.boundaryCircle1.exit, o1.exit);

    assert.exists(segment.boundaryCircle2);
    victorAssert.equalVectors(segment.boundaryCircle2.origin, o2.origin);
    assert.equal(segment.boundaryCircle2.radius, o2.radius);
    assert.equal(segment.boundaryCircle2.entry, o2.entry);
  });
});
