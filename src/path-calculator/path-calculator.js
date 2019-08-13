const _ = require('lodash');
const victor = require('victor');
const obstacle = require('../obstacles');
const arrays = require('../arrays.js');

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

const normalizeAngle = function(angle) {
  if (angle < (2 * Math.PI) && angle >= 0)
    return angle;

  if (angle >= (2 * Math.PI))
    angle = angle - (2 * Math.PI);
  if (angle < 0)
    angle = angle + (2 * Math.PI);
  return normalizeAngle(angle);
};

const obstacleLocalVectorToGlobalOrientation = function(obstacle, vector) {
  return vector.clone().rotateDeg(-1 * obstacle.orientation);
};

const obstacleLocalVectorToGlobal = function(obstacle, vector) {
  return obstacle.origin.clone().add(obstacleLocalVectorToGlobalOrientation(obstacle, vector));
};

const testEntrySides = function(segment) {
  const obstacle1 = segment.obstacle1;
  const obstacle2 = segment.obstacle2;

  if (obstacle2.entry !== obstacle.EITHER) {
    segment.boundaryCircle2 = {};
    const boundaryCircle = obstacle2.entry === obstacle.LEFT ?
          obstacle2.leftEntryBoundary:
          obstacle2.rightEntryBoundary;
    segment.boundaryCircle2.entry = boundaryCircle.entry;
    segment.boundaryCircle2.radius = boundaryCircle.radius;
    segment.boundaryCircle2.origin = obstacleLocalVectorToGlobal(obstacle2, boundaryCircle.offset);

    return _calculateSegment(segment);
  }
  console.info('Entry has side "either" so testing both sides...');

  const leftInputSegment = _.clone(segment);
  leftInputSegment.boundaryCircle2 = {
    origin: obstacleLocalVectorToGlobal(obstacle2, obstacle2.leftEntryBoundary.offset),
    radius: obstacle2.leftEntryBoundary.radius,
    entry: obstacle2.leftEntryBoundary.entry
  };
  const leftOutputSegment = _calculateSegment(leftInputSegment);

  const rightInputSegment = _.clone(segment);
  rightInputSegment.boundaryCircle2 = {
    origin: obstacleLocalVectorToGlobal(obstacle2, obstacle2.rightEntryBoundary.offset),
    radius: obstacle2.rightEntryBoundary.radius,
    entry: obstacle2.rightEntryBoundary.entry
  };
  const rightOutputSegment = _calculateSegment(rightInputSegment);

  const leftExitPoint = leftOutputSegment.boundaryCircle1.origin.clone().add(leftOutputSegment.exit);
  const obstacleOriginToLeftExitPoint = leftExitPoint.clone().subtract(obstacle2.origin);
  const obstacleOrientationVector = obstacleLocalVectorToGlobalOrientation(obstacle2, victor(0, 1));
  let entryAngle = normalizeAngle(obstacleOriginToLeftExitPoint.direction() - obstacleOrientationVector.direction());

  console.info(`Using left-hand entry results in entry vector (${obstacle2.origin}) -> (${leftExitPoint}) with orientation (along x-axis) ${obstacleOrientationVector.direction()} and so entry angle ${entryAngle}`);

  if (entryAngle >= 0 && entryAngle < Math.PI) {
    console.info('Taking left-hand side entry boundary');
    return leftOutputSegment;
  }
  else {
    console.info('Taking right-hand side entry boundary');
    return rightOutputSegment;
  }
};

const testExitSides = function(segment) {
  const obstacle1 = segment.obstacle1;
  const obstacle2 = segment.obstacle2;

  if (obstacle1.exit !== obstacle.EITHER) {
    segment.boundaryCircle1 = {};
    const boundaryCircle = obstacle1.exit === obstacle.LEFT ?
          obstacle1.leftExitBoundary:
          obstacle1.rightExitBoundary;
    segment.boundaryCircle1.radius = boundaryCircle.radius;
    segment.boundaryCircle1.exit = boundaryCircle.exit;
    segment.boundaryCircle1.origin = obstacleLocalVectorToGlobal(obstacle1, boundaryCircle.offset);

    return testEntrySides(segment);
  }
  console.info('Exit has side "either" so testing both sides...');

  const leftInputSegment = _.clone(segment);
  leftInputSegment.boundaryCircle1 = {
    origin: obstacleLocalVectorToGlobal(obstacle1, obstacle1.leftExitBoundary.offset),
    radius: obstacle1.leftExitBoundary.radius,
    exit: obstacle1.leftExitBoundary.exit
  };
  const leftOutputSegment = testEntrySides(leftInputSegment);

  const rightInputSegment = _.clone(segment);
  rightInputSegment.boundaryCircle1 = {
    origin: obstacleLocalVectorToGlobal(obstacle1, obstacle1.rightExitBoundary.offset),
    radius: obstacle1.rightExitBoundary.radius,
    exit: obstacle1.rightExitBoundary.exit
  };
  const rightOutputSegment = testEntrySides(rightInputSegment);

  const leftEntryPoint = leftOutputSegment.boundaryCircle2.origin.clone().add(leftOutputSegment.entry);
  const obstacleOriginToLeftEntryPoint = leftEntryPoint.clone().subtract(obstacle1.origin);
  const obstacleOrientationVector = obstacleLocalVectorToGlobalOrientation(obstacle1, victor(0, 1));
  const exitAngle = normalizeAngle(obstacleOriginToLeftEntryPoint.direction() -
                                  obstacleOrientationVector.direction());

  console.info(`Using left-hand exit results in exit vector (${obstacle1.origin}) -> (${leftEntryPoint}) with orientation (along x-axis) ${obstacleOrientationVector.direction()} and so exit angle ${exitAngle}`);

  if (exitAngle >= 0 && exitAngle < Math.PI) {
    console.info('Taking left-hand side exit boundary');
    return leftOutputSegment;
  }
  else {
    console.info('Taking right-hand side exit boundary');
    return rightOutputSegment;
  }
};

const calculateSegment = function(obstacle1, obstacle2) {
  const segment = { obstacle1, obstacle2 };
  return testExitSides(segment);
};

const calculateSegments = function(course) {
  const participatingObstacles = course.filter(obstacle => obstacle.partOfCourse != false);
  return arrays.zipAdjacent(participatingObstacles).
    map(([o1, o2]) => calculateSegment(o1, o2));
};

module.exports = {
  calculateSegment,
  calculateSegments,
  obstacleLocalVectorToGlobal,
  obstacleLocalVectorToGlobalOrientation,
  normalizeAngle
};
