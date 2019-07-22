const _ = require('lodash');
const victor = require('victor');
const obstacle = require('../obstacle.js');

const _calculateSegment = function(segment) {

  const boundary1 = segment.boundaryCircle1;
  const boundary2 = segment.boundaryCircle2;

  const o12 = boundary2.origin.clone().subtract(boundary1.origin);
  const r12 = boundary1.exit === boundary2.entry ?
        Math.abs(boundary1.radius - boundary2.radius) :
       (boundary1.radius + boundary2.radius);
  const t12 = Math.sqrt(Math.pow(o12.magnitude(), 2) - Math.pow(r12, 2));
  const beta = Math.atan2(t12, r12);

  let exitTheta, entryTheta;
  if (boundary1.exit !== boundary2.entry) {
    exitTheta = (boundary1.exit === obstacle.LEFT) ?
      beta :
      -1 * beta;

    entryTheta = (boundary2.entry === obstacle.LEFT) ?
      (Math.PI - beta) :
      (Math.PI + beta);
  } else if (boundary1.radius >= boundary2.radius) {
    entryTheta = exitTheta = (boundary1.exit === obstacle.LEFT) ?
      beta :
      -1 * beta;
  } else {
    entryTheta = exitTheta = Math.PI +
      ((boundary1.exit === obstacle.RIGHT) ?
        beta :
        -1 * beta);
  }

  const exit = o12.
        clone().
        normalize().
        multiplyScalar(boundary1.radius).
        rotate(exitTheta);

  const entry = o12.
        clone().
        normalize().
        multiplyScalar(boundary2.radius).
        rotate(entryTheta);

  segment.o12 = o12;
  segment.beta = beta;
  segment.exit = exit;
  segment.entry = entry;
  return segment;
};

const toBoundaryCircle = function(obstacle) {
  return {
    origin: obstacle.origin,
    radius: obstacle.radius,
    entry: obstacle.entry,
    exit: obstacle.exit
  };
};

const trialBothExitSides = function(segment) {
  const obstacle1 = segment.obstacle1;
  const obstacle2 = segment.obstacle2;

  segment.boundaryCircle2 = toBoundaryCircle(obstacle2);

  const leftInputSegment = _.clone(segment);
  leftInputSegment.boundaryCircle1 = {
    origin: obstacle1.origin.clone().add(obstacle1.leftExitBoundaryOrigin),
    radius: obstacle1.radius,
    exit: obstacle.RIGHT
  };
  const leftOutputSegment = _calculateSegment(leftInputSegment);

  const rightInputSegment = _.clone(segment);
  rightInputSegment.boundaryCircle1 = {
    origin: obstacle1.origin.clone().add(obstacle1.rightExitBoundaryOrigin),
    radius: obstacle1.radius,
    exit: obstacle.LEFT
  };
  const rightOutputSegment = _calculateSegment(rightInputSegment);

  const obstacleOriginToLeftEntryPoint =
        leftOutputSegment.boundaryCircle2.origin.
        add(leftOutputSegment.entry).
        subtract(leftOutputSegment.obstacle1.origin);
  const obstacleOrientation = leftOutputSegment.obstacle1.orientation;
  const exitAngle = obstacleOriginToLeftEntryPoint.direction() - obstacleOrientation.direction();

  if (exitAngle >= 0 && exitAngle < Math.PI)
    return leftOutputSegment;
  else
    return rightOutputSegment;
};

const calculateSegment = function(obstacle1, obstacle2) {
  const segment = { obstacle1, obstacle2 };

  if (obstacle1.exit !== obstacle.EITHER) {
    segment.boundaryCircle1 = toBoundaryCircle(obstacle1);
    segment.boundaryCircle2 = toBoundaryCircle(obstacle2);
    return _calculateSegment(segment);
  } else {
    return trialBothExitSides(segment);
  }
};

module.exports = {
  calculateSegment
};
