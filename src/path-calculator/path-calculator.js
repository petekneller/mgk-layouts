const obstacle = require('../obstacle.js');

const calculateSegment = function(obstacle1, obstacle2) {

  const d12 = obstacle2.origin.clone().subtract(obstacle1.origin);

  // TODO:
  // * obstacle entry and exit on opposite sides
  // * r12 and t12
  // * correct value of beta

  const beta = (obstacle1.exit === obstacle.LEFT) ?
        Math.PI / 2:
        -1 * Math.PI / 2;

  const exit = d12.
        clone().
        normalize().
        multiplyScalar(obstacle1.radius).
        rotate(beta);

  const entry = d12.
        clone().
        normalize().
        multiplyScalar(obstacle2.radius).
        rotate(beta);

  return {
    o1: obstacle1,
    o2: obstacle2,
    d12,
    exit,
    entry
  };
};

module.exports = {
  calculateSegment
};
