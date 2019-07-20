const obstacle = require('../obstacle.js');

const calculateSegment = function(obstacle1, obstacle2) {

  const o12 = obstacle2.origin.clone().subtract(obstacle1.origin);
  const r12 = obstacle1.exit === obstacle2.entry ?
        Math.abs(obstacle1.radius - obstacle2.radius) :
       (obstacle1.radius + obstacle2.radius);
  const t12 = Math.sqrt(Math.pow(o12.magnitude(), 2) - Math.pow(r12, 2));
  const beta = Math.atan2(t12, r12);

  let exitTheta, entryTheta;
  if (obstacle1.exit !== obstacle2.entry) {
    exitTheta = (obstacle1.exit === obstacle.LEFT) ?
      beta :
      -1 * beta;

    entryTheta = (obstacle2.entry === obstacle.LEFT) ?
      (Math.PI - beta) :
      (Math.PI + beta);
  } else if (obstacle1.radius >= obstacle2.radius) {
    entryTheta = exitTheta = (obstacle1.exit === obstacle.LEFT) ?
      beta :
      -1 * beta;
  } else {
    entryTheta = exitTheta = Math.PI +
      ((obstacle1.exit === obstacle.RIGHT) ?
        beta :
        -1 * beta);
  }

  const exit = o12.
        clone().
        normalize().
        multiplyScalar(obstacle1.radius).
        rotate(exitTheta);

  const entry = o12.
        clone().
        normalize().
        multiplyScalar(obstacle2.radius).
        rotate(entryTheta);

  return {
    o1: obstacle1,
    o2: obstacle2,
    o12,
    beta,
    exit,
    entry
  };
};

module.exports = {
  calculateSegment
};
