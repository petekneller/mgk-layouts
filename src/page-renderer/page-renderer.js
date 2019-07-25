const nunjucks = require('nunjucks');
const _ = require('lodash');
const Victor = require('victor');

const obstacleCtr = require('../obstacle.js');
const pathCalculator = require('../path-calculator/path-calculator.js');

const renderObstacle = function(obstacle, globalToViewbox) {
  const {x, y} = globalToViewbox(obstacle.origin.x, obstacle.origin.y);
  switch (obstacle.name) {
  case "StartBox": return `<use href="#start-finish-box" x="${x}" y="${y}" />`;
  case "FinishBox": return `<use href="#start-finish-box" x="${x}" y="${y}" />`;
  case "LeftTurn": return `<use href="#blue-cone" x="${x}" y="${y}" />`;
  case "RightTurn": return `<use href="#red-cone" x="${x}" y="${y}" />`;
  case "RightRotation": return `<use href="#red-stripe-cone" x="${x}" y="${y}" />`;
  case "Gate": {
    const leftCone = pathCalculator.obstacleLocalVectorToGlobal(obstacle, obstacle.leftExitBoundaryOrigin);
    const {x: x1, y: y1} = globalToViewbox(leftCone.x, leftCone.y);
    const rightCone = pathCalculator.obstacleLocalVectorToGlobal(obstacle, obstacle.rightExitBoundaryOrigin);
    const {x: x2, y: y2} = globalToViewbox(rightCone.x, rightCone.y);
    return `<use href="#yellow-cone" x="${x1}" y="${y1}" /><use href="#yellow-cone" x="${x2}" y="${y2}" />`;
  }
  default: return "";
  }
};

const renderBoundaryCircle = function(obstacle, globalToViewbox) {
  const {x, y} = globalToViewbox(obstacle.origin.x, obstacle.origin.y);
  return `<circle r="${obstacle.radius}" cx="${x}" cy="${y}" class="boundaryCircle" />`;
};

const renderBoundary = function(obstacle, globalToViewbox) {
  let boundaries = '';

  if (obstacle.entry === obstacleCtr.EITHER) {
    boundaries = boundaries.concat(renderBoundaryCircle({
      origin: pathCalculator.obstacleLocalVectorToGlobal(obstacle, obstacle.leftEntryBoundaryOrigin),
      radius: obstacle.radius
    }, globalToViewbox));
    boundaries = boundaries.concat(renderBoundaryCircle({
      origin: pathCalculator.obstacleLocalVectorToGlobal(obstacle, obstacle.rightEntryBoundaryOrigin),
      radius: obstacle.radius
    }, globalToViewbox));
  } else {
    boundaries = boundaries.concat(renderBoundaryCircle(obstacle, globalToViewbox));
  }

  if (obstacle.exit === obstacleCtr.EITHER) {
    boundaries = boundaries.concat(renderBoundaryCircle({
      origin: pathCalculator.obstacleLocalVectorToGlobal(obstacle, obstacle.leftExitBoundaryOrigin),
      radius: obstacle.radius
    }, globalToViewbox));
    boundaries = boundaries.concat(renderBoundaryCircle({
      origin: pathCalculator.obstacleLocalVectorToGlobal(obstacle, obstacle.rightExitBoundaryOrigin),
      radius: obstacle.radius
    }, globalToViewbox));
  } else {
    boundaries = boundaries.concat(renderBoundaryCircle(obstacle, globalToViewbox));
  }

  return boundaries;

  //return renderBoundaryCircle(segment.boundaryCircle1).concat(renderBoundaryCircle(segment.boundaryCircle2));
};

const renderSegment = function(segment, globalToViewbox) {
  const {x: x1, y: y1} = globalToViewbox(segment.obstacle1.origin.x, segment.obstacle1.origin.y);
  const {x: x2, y: y2} = globalToViewbox(segment.obstacle2.origin.x, segment.obstacle2.origin.y);
  const globalNormal1 = segment.boundaryCircle1.origin.clone().add(segment.exit);
  const {x: xn1, y: yn1} = globalToViewbox(globalNormal1.x, globalNormal1.y);
  const globalNormal2 = segment.boundaryCircle2.origin.clone().add(segment.entry);
  const {x: xn2, y: yn2} = globalToViewbox(globalNormal2.x, globalNormal2.y);
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="lightgray" stroke-width="0.25%" />` +
    `<line x1="${xn1}" y1="${yn1}" x2="${xn2}" y2="${yn2}" stroke="black" stroke-width="0.25%" />`;
};

const renderOrientationVector = function(obstacle, globalToViewbox) {
  const orientation = pathCalculator.obstacleLocalVectorToGlobal(obstacle, Victor(0, 1));
  const {x: x1b, y: y1b} = globalToViewbox(obstacle.origin.x, obstacle.origin.y);
  const {x: x2b, y: y2b} = globalToViewbox(orientation.x, orientation.y);
  return `<line x1="${x1b}" y1="${y1b}" x2="${x2b}" y2="${y2b}" stroke="red" stroke-width="0.25%" />`;
};

const renderNormalVector = function(boundaryCircle, localNormal, globalToViewbox) {
  const {x: x1, y: y1} = globalToViewbox(boundaryCircle.origin.x, boundaryCircle.origin.y);
  const globalNormal = boundaryCircle.origin.clone().add(localNormal);
  const {x: x2, y: y2} = globalToViewbox(globalNormal.x, globalNormal.y);
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="green" stroke-width="0.25%" />`;
};

const courseMaxExtents = function(course) {
  const obstacleExtents = course.map(obstacle => {
    // a basic heuristic: the boundary can't be offset by more than the largest of the
    // x or y of the offset. Assumes symmetrical offsets.
    const maxBoundaryOffset = obstacle.leftBoundaryCircleOffset ?
          Math.max(obstacle.leftBoundaryCircleOffset.x, obstacle.leftBoundaryCircleOffset.y) : 0;

    return {
      x: obstacle.origin.x + obstacle.radius + maxBoundaryOffset,
      y: obstacle.origin.y + obstacle.radius + maxBoundaryOffset
    };
  });

  return {
    x: _.max(obstacleExtents.map(o => o.x)),
    y: _.max(obstacleExtents.map(o => o.y))
  };
};

nunjucks.configure({});

const pageRenderer = function(course) {
  const { x: maxX, y: maxY } = courseMaxExtents(course);
  const maxViewbox = Math.floor(Math.max(maxX, maxY) * 1.1);
  const viewboxExtents = { x: maxViewbox, y: maxViewbox};

  const globalToViewbox = function(x, y) {
    return { x: x, y: (viewboxExtents.y - y) };
  };

  //_.initial is necessary because _.zip will keep the last pair where the end segment is undefined
  const courseSegments = _.initial(_.zip(course, _.drop(course))).
        map(([o1, o2]) => pathCalculator.calculateSegment(o1, o2));

  return nunjucks.render(`${__dirname}/page.njk`, {
    viewboxExtents,
    courseSegments,
    renderedObstacles: course.map(obstacle => renderObstacle(obstacle, globalToViewbox)),
    renderedObstacleBoundaries: course.map(obstacle => renderBoundary(obstacle, globalToViewbox)),
    renderedCourseSegments: courseSegments.map(segment => renderSegment(segment, globalToViewbox)),
    renderedOrientationVectors: course.map(obstacle => renderOrientationVector(obstacle, globalToViewbox)),
    renderedExitVectors: courseSegments.map(segment => renderNormalVector(segment.boundaryCircle1, segment.exit, globalToViewbox)),
    renderedEntryVectors: courseSegments.map(segment => renderNormalVector(segment.boundaryCircle2, segment.entry, globalToViewbox))
  });
};

module.exports = pageRenderer;
