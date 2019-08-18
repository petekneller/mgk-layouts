const _ = require('lodash');
import vector from '../vectors';
import { localVectorToGlobalOrientation, localVectorToGlobal } from '../obstacles';
import { normalizeAngle } from './util'
import segmentCalculator from './segment-calculator';
import { Segment, Stage1Segment, Stage2Segment } from './types';
import { zipAdjacent } from '../arrays';

type OpenObject = import('../types').OpenObject;
type Obstacle = import('../obstacles/types').Obstacle;
type BoundaryCircle = import('../obstacles/types').BoundaryCircle;

const testEntrySides = function(segment: Stage2Segment) {
  const obstacle2 = segment.obstacle2;

  if (!Array.isArray(obstacle2.entryBoundaries)) {
    return segmentCalculator({
      ...segment,
      boundaryCircle2: localToGlobalBoundary(obstacle2, obstacle2.entryBoundaries)
    });
  }
  console.info('Entry has side "either" so testing both sides...');

  const leftInputSegment = _.clone(segment);
  leftInputSegment.boundaryCircle2 = localToGlobalBoundary(obstacle2, obstacle2.entryBoundaries[0]);
  const leftOutputSegment = segmentCalculator(leftInputSegment);

  const rightInputSegment = _.clone(segment);
  rightInputSegment.boundaryCircle2 = localToGlobalBoundary(obstacle2, obstacle2.entryBoundaries[1]);
  const rightOutputSegment = segmentCalculator(rightInputSegment);

  const leftExitPoint = leftOutputSegment.boundaryCircle1.origin.clone().add(leftOutputSegment.exit);
  const obstacleOriginToLeftExitPoint = leftExitPoint.clone().subtract(obstacle2.origin);
  const obstacleOrientationVector = localVectorToGlobalOrientation(obstacle2, vector(0, 1));
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

const testExitSides = function(segment: Stage1Segment): Segment {
  const obstacle1 = segment.obstacle1;

  if (!Array.isArray(obstacle1.exitBoundaries)) {
    return testEntrySides({
      ...segment,
      boundaryCircle1: localToGlobalBoundary(obstacle1, obstacle1.exitBoundaries)
    });
  }
  console.info('Exit has side "either" so testing both sides...');

  const leftInputSegment = _.clone(segment);
  leftInputSegment.boundaryCircle1 = localToGlobalBoundary(obstacle1, obstacle1.exitBoundaries[0]);
  const leftOutputSegment = testEntrySides(leftInputSegment);

  const rightInputSegment = _.clone(segment);
  rightInputSegment.boundaryCircle1 = localToGlobalBoundary(obstacle1, obstacle1.exitBoundaries[1]);
  const rightOutputSegment = testEntrySides(rightInputSegment);

  const leftEntryPoint = leftOutputSegment.boundaryCircle2.origin.clone().add(leftOutputSegment.entry);
  const obstacleOriginToLeftEntryPoint = leftEntryPoint.clone().subtract(obstacle1.origin);
  const obstacleOrientationVector = localVectorToGlobalOrientation(obstacle1, vector(0, 1));
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

const calculateSegment = function(obstacle1: Obstacle, obstacle2: Obstacle): Segment {
  const segment = { obstacle1, obstacle2 };
  return testExitSides(segment);
};

const calculateSegments = function(course: Array<Obstacle>): Array<Segment> {
  const participatingObstacles = course.filter(obstacle => obstacle.partOfCourse != false);
  return zipAdjacent(participatingObstacles).
    map(([o1, o2]) => calculateSegment(o1, o2));
};

const localToGlobalBoundary = function(o: Obstacle, b: BoundaryCircle): OpenObject {
  return {
    side: b.side,
    radius: b.radius,
    origin: localVectorToGlobal(o, b.offset)
  };
};

export {
  Segment,
  calculateSegment,
  calculateSegments,
  normalizeAngle
};
