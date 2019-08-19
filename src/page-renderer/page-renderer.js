const nunjucks = require('nunjucks');
const _ = require('lodash');
import vector from '../vectors';

const arrays = require('../arrays.js');
import obstacleCtr, { localVectorToGlobal} from '../obstacles';
const pathCalculator = require('../path-calculator');

const renderObstacle = function(obstacle, globalToViewbox) {
  const {x, y} = globalToViewbox(obstacle.origin.x, obstacle.origin.y);
  switch (obstacle.name) {
  case 'LeftTurn': return `<use href="#blue-cone" x="${x}" y="${y}" />`;
  case 'LeftRotation': return `<use href="#blue-stripe-cone" x="${x}" y="${y}" />`;
  case 'RightTurn': return `<use href="#red-cone" x="${x}" y="${y}" />`;
  case 'RightRotation': return `<use href="#red-stripe-cone" x="${x}" y="${y}" />`;
  case 'OutOfBounds': return `<use href="#yellow-stripe-cone" x="${x}" y="${y}" />`;
  case 'Gate': {
    const leftCone = localVectorToGlobal(obstacle, vector(-0.5 * obstacle.width, 0));
    const {x: x1, y: y1} = globalToViewbox(leftCone.x, leftCone.y);
    const rightCone = localVectorToGlobal(obstacle, vector(0.5 * obstacle.width, 0));
    const {x: x2, y: y2} = globalToViewbox(rightCone.x, rightCone.y);
    return `<use href="#yellow-cone" x="${x1}" y="${y1}" /><use href="#yellow-cone" x="${x2}" y="${y2}" />`;
  }
  case 'StartBox': {
    // NB. 'front'/'rear' and 'left'/'right' are on the bike, leaving the box
    const leftFrontCone = localVectorToGlobal(obstacle, vector(-0.5 * obstacle.width, 0));
    const {x: x1, y: y1} = globalToViewbox(leftFrontCone.x, leftFrontCone.y);
    const rightFrontCone = localVectorToGlobal(obstacle, vector(0.5 * obstacle.width, 0));
    const {x: x2, y: y2} = globalToViewbox(rightFrontCone.x, rightFrontCone.y);
    const leftRearCone = localVectorToGlobal(obstacle,
                                                                    vector(-0.5 * obstacle.width, -1 * obstacle.depth));
    const {x: x3, y: y3} = globalToViewbox(leftRearCone.x, leftRearCone.y);
    const rightRearCone = localVectorToGlobal(obstacle, vector(0.5 * obstacle.width, -1 * obstacle.depth));
    const {x: x4, y: y4} = globalToViewbox(rightRearCone.x, rightRearCone.y);
    return `<use href="#yellow-cone" x="${x1}" y="${y1}" />
            <use href="#yellow-cone" x="${x2}" y="${y2}" />
            <use href="#yellow-cone" x="${x3}" y="${y3}" />
            <use href="#yellow-cone" x="${x4}" y="${y4}" />`;
  }
  case 'FinishBox': {
    // NB. 'front'/'rear' and 'left'/'right' are on the bike, entering the box
    const leftFrontCone = localVectorToGlobal(obstacle, vector(-0.5 * obstacle.width, 0));
    const {x: x1, y: y1} = globalToViewbox(leftFrontCone.x, leftFrontCone.y);
    const rightFrontCone = localVectorToGlobal(obstacle, vector(0.5 * obstacle.width, 0));
    const {x: x2, y: y2} = globalToViewbox(rightFrontCone.x, rightFrontCone.y);
    const leftRearCone = localVectorToGlobal(obstacle,
                                                                    vector(-0.5 * obstacle.width, obstacle.depth));
    const {x: x3, y: y3} = globalToViewbox(leftRearCone.x, leftRearCone.y);
    const rightRearCone = localVectorToGlobal(obstacle, vector(0.5 * obstacle.width, obstacle.depth));
    const {x: x4, y: y4} = globalToViewbox(rightRearCone.x, rightRearCone.y);
    return `<use href="#yellow-cone" x="${x1}" y="${y1}" />
            <use href="#yellow-cone" x="${x2}" y="${y2}" />
            <use href="#yellow-cone" x="${x3}" y="${y3}" />
            <use href="#yellow-cone" x="${x4}" y="${y4}" />`;
  }
  case 'GapEntry': {
    return `<polygon points="-0.75,0.75 0.75,0.75 0,-0.75" transform="translate(${x},${y}) rotate(${obstacle.orientation})" />`;
  }
  case 'GapExit': {
    return `<circle cx="${x}" cy="${y}" r="0.5" />`;
  }
  default: return '';
  }
};

const renderBoundaryArc = function(boundaryCircle, segmentEntry, segmentExit, globalToViewbox) {
  const entryNormal = boundaryCircle.origin.clone().add(segmentEntry);
  const {x: x1, y: y1} = globalToViewbox(entryNormal.x, entryNormal.y);
  const exitNormal = boundaryCircle.origin.clone().add(segmentExit);
  const {x: x2, y: y2} = globalToViewbox(exitNormal.x, exitNormal.y);

  const entryAngle = pathCalculator.normalizeAngle(segmentEntry.direction());
  const exitAngle = pathCalculator.normalizeAngle(segmentExit.direction());
  const angleTurnedThrough = pathCalculator.normalizeAngle(
    boundaryCircle.side === obstacleCtr.RIGHT ? (exitAngle - entryAngle) : (entryAngle - exitAngle)
  );
  const largeArcSweepFlag = (angleTurnedThrough > Math.PI) ? '1' : '0';

  const sweepFlag = boundaryCircle.side === obstacleCtr.RIGHT ? '0' : '1';
  return `<path d="M ${x1} ${y1} A ${boundaryCircle.radius} ${boundaryCircle.radius} 0 ${largeArcSweepFlag} ${sweepFlag} ${x2} ${y2}" fill="none" stroke="black" stroke-width="0.5%" />`;
};

const renderObstaclePath = function(segment1, segment2, globalToViewbox) {
  const obstacle = segment1.obstacle2;
  switch(obstacle.name) {
  case 'LeftTurn':
  case 'RightTurn': {
    return renderBoundaryArc(segment1.boundaryCircle2, segment1.entry, segment2.exit, globalToViewbox);
  }
  case 'LeftRotation':
  case 'RightRotation': {
    const boundaryCircle = segment1.boundaryCircle2;
    const entryAngle = pathCalculator.normalizeAngle(segment1.entry.direction());
    const exitAngle = pathCalculator.normalizeAngle(segment2.exit.direction());
    const angleTurnedThrough = pathCalculator.normalizeAngle(
      boundaryCircle.side === obstacleCtr.RIGHT ? (exitAngle - entryAngle) : (entryAngle - exitAngle)
    );
    const lessThanFullRotation = angleTurnedThrough >= (Math.PI * 2/2);

    if (lessThanFullRotation) {
      return renderBoundaryArc(boundaryCircle, segment1.entry, segment2.exit, globalToViewbox);
    } else {
      const { x: cx, y: cy } = globalToViewbox(boundaryCircle.origin.x, boundaryCircle.origin.y);
      return `<circle cx="${cx}" cy="${cy}" r="${boundaryCircle.radius}" fill="none" stroke="black" stroke-width="0.5%" />`;
    }
  }
  case 'Gate': {
    // Gates can be considered 2 arcs - one from the entry to the point central between the boundary circles (which should be the origin) and from that point to the exit
    const originFromBoundary = segment1.obstacle2.origin.clone().subtract(segment1.boundaryCircle2.origin);

    const arc1 = renderBoundaryArc(segment1.boundaryCircle2, segment1.entry, originFromBoundary, globalToViewbox);
    const arc2 = renderBoundaryArc(segment1.boundaryCircle2, originFromBoundary, segment2.exit, globalToViewbox);
    return `${arc1}\n${arc2}`;
  }
  default: return '';
  }
};

const renderBoundaryCircle = function(circle, globalToViewbox) {
  const {x, y} = globalToViewbox(circle.origin.x, circle.origin.y);
  return `<circle r="${circle.radius}" cx="${x}" cy="${y}" class="boundaryCircle" />`;
};

const renderBoundary = function(obstacle, globalToViewbox) {
  let boundaries = '';

  if (Array.isArray(obstacle.entryBoundaries)) {
    boundaries = boundaries.concat(renderBoundaryCircle({
      origin: localVectorToGlobal(obstacle, obstacle.entryBoundaries[0].origin),
      radius: obstacle.entryBoundaries[0].radius
    }, globalToViewbox));
    boundaries = boundaries.concat(renderBoundaryCircle({
      origin: localVectorToGlobal(obstacle, obstacle.entryBoundaries[1].origin),
      radius: obstacle.entryBoundaries[1].radius
    }, globalToViewbox));
  } else {
    boundaries = boundaries.concat(renderBoundaryCircle({
      origin: localVectorToGlobal(obstacle, obstacle.entryBoundaries.origin),
      radius: obstacle.entryBoundaries.radius
    }, globalToViewbox));
  }

  if (Array.isArray(obstacle.exitBoundaries)) {
    boundaries = boundaries.concat(renderBoundaryCircle({
      origin: localVectorToGlobal(obstacle, obstacle.exitBoundaries[0].origin),
      radius: obstacle.exitBoundaries[0].radius
    }, globalToViewbox));
    boundaries = boundaries.concat(renderBoundaryCircle({
      origin: localVectorToGlobal(obstacle, obstacle.exitBoundaries[1].origin),
      radius: obstacle.exitBoundaries[1].radius
    }, globalToViewbox));
  } else {
    boundaries = boundaries.concat(renderBoundaryCircle({
      origin: localVectorToGlobal(obstacle, obstacle.exitBoundaries.origin),
      radius: obstacle.exitBoundaries.radius
    }, globalToViewbox));
  }

  return boundaries;
};

const renderSegmentPath = function(segment, globalToViewbox) {
  const globalNormal1 = segment.boundaryCircle1.origin.clone().add(segment.exit);
  const {x: x1, y: y1} = globalToViewbox(globalNormal1.x, globalNormal1.y);
  const globalNormal2 = segment.boundaryCircle2.origin.clone().add(segment.entry);
  const {x: x2, y: y2} = globalToViewbox(globalNormal2.x, globalNormal2.y);
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="black" stroke-width="0.5%" />`;
};

const renderDebugSegment = function(segment, globalToViewbox) {
  const {x: x1, y: y1} = globalToViewbox(segment.obstacle1.origin.x, segment.obstacle1.origin.y);
  const {x: x2, y: y2} = globalToViewbox(segment.obstacle2.origin.x, segment.obstacle2.origin.y);
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="lightgray" stroke-width="0.25%" />`;
};

const renderOrientationVector = function(obstacle, globalToViewbox) {
  const orientation = localVectorToGlobal(obstacle, vector(0, 2));
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
    const b = (Array.isArray(obstacle.entryBoundaries) ?
                               obstacle.entryBoundaries[0] : obstacle.entryBoundaries);
    const maxBoundaryOffset = Math.max(b.origin.x, b.origin.y);

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

const renderGridlines = function(viewboxExtents, spacing, strokeColour, globalToViewbox) {
  const numLinesHorz = Math.floor(viewboxExtents.x / spacing);
  const vertLines = [...Array(numLinesHorz).keys()].map(idx => {
    const { x } = globalToViewbox((idx+1) * spacing, 0);
    return `<line x1="${x}" y1="0" x2="${x}" y2="${viewboxExtents.y}" style="stroke: ${strokeColour}; stroke-width: 0.2%;" />`;
  });

  const numLinesVert = Math.floor(viewboxExtents.y / spacing);
  const horzLines = [...Array(numLinesVert).keys()].map(idx => {
    const { y } = globalToViewbox(0, (idx+1) * spacing);
    return `<line x1="0" y1="${y}" x2="${viewboxExtents.x}" y2="${y}" style="stroke: ${strokeColour}; stroke-width: 0.2%;" />`;
  });

  return vertLines.concat(horzLines).join('\n');
};

nunjucks.configure({});

const pageRenderer = function(course, debug) {
  const { x: maxX, y: maxY } = courseMaxExtents(course);
  const maxViewbox = Math.floor(Math.max(maxX, maxY) * 1.1);
  const viewboxExtents = { x: maxViewbox, y: maxViewbox};

  const globalToViewbox = function(x, y) {
    return { x: x, y: (viewboxExtents.y - y) };
  };

  const courseSegments = pathCalculator.calculateSegments(course);

  const renderedCourseDebugSegments = !!debug ? courseSegments.map(segment => renderDebugSegment(segment, globalToViewbox)): [];
  const renderedObstacleBoundaries = !!debug ? course.map(obstacle => renderBoundary(obstacle, globalToViewbox)) : [];
  const renderedOrientationVectors = !!debug ? course.map(obstacle => renderOrientationVector(obstacle, globalToViewbox)): [];
  const renderedExitVectors = !!debug ? courseSegments.map(segment => renderNormalVector(segment.boundaryCircle1, segment.exit, globalToViewbox)): [];
  const renderedEntryVectors = !!debug ? courseSegments.map(segment => renderNormalVector(segment.boundaryCircle2, segment.entry, globalToViewbox)): [];

  return nunjucks.render(`${__dirname}/page.njk`, {
    viewboxExtents,
    minorGridlines: renderGridlines(viewboxExtents, 1, 'lightgrey', globalToViewbox),
    majorGridlines: renderGridlines(viewboxExtents, 10, 'darkgray', globalToViewbox),
    courseSegments,
    renderedObstacles: course.filter(o => o.visible != false).map(o => renderObstacle(o, globalToViewbox)),
    renderedObstacleBoundaries,
    renderedSegmentPaths: courseSegments.filter(s => !(s.obstacle1.name === 'GapEntry' && s.obstacle2.name === 'GapExit')).map(s => renderSegmentPath(s, globalToViewbox)),
    renderedObstaclePaths: arrays.zipAdjacent(courseSegments).map(([segment1, segment2]) => renderObstaclePath(segment1, segment2, globalToViewbox)),
    renderedCourseDebugSegments,
    renderedOrientationVectors,
    renderedExitVectors,
    renderedEntryVectors
  });
};

export default pageRenderer;
