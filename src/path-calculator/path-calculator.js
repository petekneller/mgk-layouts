const obstacle = require('../obstacle.js');

const calculateSegment = function(obstacle1, obstacle2) {

  const d12 = obstacle2.origin.clone().subtract(obstacle1.origin);

  // TODO:
  // * obstacle entry and exit on opposite sides
  // * boundary circle radii
  // * r12 and t12
  // * correct value of beta

  const beta = (obstacle1.exit === obstacle.LEFT) ?
        Math.PI / 2:
        -1 * Math.PI / 2;

  const r1 = d12.
        clone().
        normalize().
        rotate(beta);

  const r2 = d12.
        clone().
        normalize().
        rotate(beta);

  return {
    o1: obstacle1,
    o2: obstacle2,
    d12,
    r1,
    r2
  };
};

module.exports = {
  calculateSegment
};
