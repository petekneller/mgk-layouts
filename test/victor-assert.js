const assert = require('chai').assert;

const equalVectors = function(v1, v2, epsilon = 0.01) {
  assert.closeTo(v1.x, v2.x, epsilon, `v1.x [${v1.x}] should equal v2.x [${v2.x}]`);
  assert.closeTo(v1.y, v2.y, epsilon, `v1.y [${v1.y}] should equal v2.y [${v2.y}]`);
};

const isVector = function(v) {
  assert.exists(v.x);
  assert.exists(v.y);
};

module.exports = {
  equalVectors,
  isVector
};
