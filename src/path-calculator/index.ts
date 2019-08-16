const _ = require('lodash');
import vector from '../vectors';
import obstacle, { localVectorToGlobalOrientation, localVectorToGlobal } from '../obstacles';
import { normalizeAngle } from './util'
import segmentCalculator from './segment-calculator';
import { Segment, Stage1Segment, Stage2Segment } from './types';
import { zipAdjacent } from '../arrays';

type Obstacle = import('../obstacles/types').Obstacle;

const testEntrySides = function(segment: Stage2Segment) {
  const obstacle2 = segment.obstacle2;

  if (obstacle2.entry !== obstacle.EITHER) {
    const boundaryCircle = obstacle2.entry === obstacle.LEFT ?
          obstacle2.leftEntryBoundary:
          obstacle2.rightEntryBoundary;

    return segmentCalculator({
      ...segment,
      boundaryCircle2: {
        entry: boundaryCircle.entry,
        radius: boundaryCircle.radius,
        origin: localVectorToGlobal(obstacle2, boundaryCircle.offset)
      }
    });
  }
  console.info('Entry has side "either" so testing both sides...');

  const leftInputSegment = _.clone(segment);
  leftInputSegment.boundaryCircle2 = {
    origin: localVectorToGlobal(obstacle2, obstacle2.leftEntryBoundary.offset),
    radius: obstacle2.leftEntryBoundary.radius,
    entry: obstacle2.leftEntryBoundary.entry
  };
  const leftOutputSegment = segmentCalculator(leftInputSegment);

  const rightInputSegment = _.clone(segment);
  rightInputSegment.boundaryCircle2 = {
    origin: localVectorToGlobal(obstacle2, obstacle2.rightEntryBoundary.offset),
    radius: obstacle2.rightEntryBoundary.radius,
    entry: obstacle2.rightEntryBoundary.entry
  };
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

  if (obstacle1.exit !== obstacle.EITHER) {
    const boundaryCircle = obstacle1.exit === obstacle.LEFT ?
          obstacle1.leftExitBoundary:
          obstacle1.rightExitBoundary;

    return testEntrySides({
      ...segment,
      boundaryCircle1: {
        radius: boundaryCircle.radius,
        exit: boundaryCircle.exit,
        origin: localVectorToGlobal(obstacle1, boundaryCircle.offset)
      }
    });
  }
  console.info('Exit has side "either" so testing both sides...');

  const leftInputSegment = _.clone(segment);
  leftInputSegment.boundaryCircle1 = {
    origin: localVectorToGlobal(obstacle1, obstacle1.leftExitBoundary.offset),
    radius: obstacle1.leftExitBoundary.radius,
    exit: obstacle1.leftExitBoundary.exit
  };
  const leftOutputSegment = testEntrySides(leftInputSegment);

  const rightInputSegment = _.clone(segment);
  rightInputSegment.boundaryCircle1 = {
    origin: localVectorToGlobal(obstacle1, obstacle1.rightExitBoundary.offset),
    radius: obstacle1.rightExitBoundary.radius,
    exit: obstacle1.rightExitBoundary.exit
  };
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

export {
  Segment,
  calculateSegment,
  calculateSegments,
  normalizeAngle
};
