const t = require('tap').mocha;
const assert = require('chai').assert;

const arrays = require('../src/arrays.js');

t.describe('arrays.zipAdjacent', () => {

  t.it('should return an empty array when the input is an empty array', () => {
    const res = arrays.zipAdjacent([]);
    assert.isArray(res);
    assert.isEmpty(res);
  });

  const input = [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
    { id: "5" }
  ];

  const output = arrays.zipAdjacent(input);

  t.it('should return an array having 1 less element than the input', () => {
    assert.lengthOf(input, 5);
    assert.lengthOf(output, 4);
  });

  t.it('should return an array having pairs of adjacent inputs elements', () => {
    const expected = [
      [{ id: "1" }, {id: "2"}],
      [{ id: "2" }, {id: "3"}],
      [{ id: "3" }, {id: "4"}],
      [{ id: "4" }, {id: "5"}],
    ];
    assert.deepEqual(output, expected);
  });

});
