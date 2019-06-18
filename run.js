const nunjucks = require('nunjucks');
const _ = require('lodash');
const Victor = require('victor');
const process = require('process');
const fs = require('fs');

const courseFile = process.argv.slice(2)[0]; // drop the js file path
const course = JSON.parse(fs.readFileSync(courseFile)).obstacles;

const svgViewSize = { x: 40, y: 40};

const globalToViewbox = function(x, y) {
  return { x: x, y: (svgViewSize.y - y) };
};

const renderObstacle = function(obstacle) {
  const {x, y} = globalToViewbox(obstacle.x, obstacle.y);
  switch (obstacle.type) {
  case "StartBox": return `<use xlink:href="#start-finish-box" x="${x}" y="${y}" />`;
  case "FinishBox": return `<use xlink:href="#start-finish-box" x="${x}" y="${y}" />`;
  case "LeftTurn": return `<use xlink:href="#blue-cone" x="${x}" y="${y}" />`;
  case "RightTurn": return `<use xlink:href="#red-cone" x="${x}" y="${y}" />`;
  case "RightRotation": return `<use xlink:href="#red-stripe-cone" x="${x}" y="${y}" />`;
  case "Gate": return `<use xlink:href="#gate" x="${x}" y="${y}" />`;
  default: return "";
  }
};

const renderBoundary = function(obstacle) {
  const boundary = boundaryCircleOrigin(obstacle);
  const {x, y} = globalToViewbox(boundary.x, boundary.y);
  return `<circle r="${boundaryRadius(obstacle)}" cx="${x}" cy="${y}" class="boundaryCircle" />`;
};

const boundaryRadius = function(obstacle) {
  switch(obstacle.type) {
  case "StartBox":
  case "FinishBox":
  case "Gate": return 0.75;
  case "LeftTurn":
  case "RightTurn":
  case "RightRotation": return 1.0;
  default: return 1.0;
  }
};

const boundaryCircleOrigin = function(obstacle) {
  // TODO: simplifying assumption that start/finish boxes and gates are always 'handed' the same way
  switch (obstacle.type) {
  case "StartBox": return Victor(obstacle.x - 0.75, obstacle.y);
  case "Gate": return Victor(obstacle.x - 0.75, obstacle.y);
  case "FinishBox": return Victor(obstacle.x + 0.75, obstacle.y);
  default: return Victor(obstacle.x, obstacle.y);
  }
};

const calculateExit = function(obstacle) {
  switch(obstacle.type) {
  case "StartBox": return "Right";
  case "LeftTurn": return "Right";
  case "RightTurn": return "Left";
  case "RightRotation": return "Left";
  case "Gate": return "Left";
  default: return "Left";
  }
};

const calculateEntry = function(obstacle) {
  switch(obstacle.type) {
  case "FinishBox": return "Right";
  case "LeftTurn": return "Right";
  case "RightTurn": return "Left";
  case "RightRotation": return "Left";
  case "Gate": return "Left";
  default: return "Left";
  }
};

const calculateSegment = function(o1, o2) {
  const v1 = boundaryCircleOrigin(o1);
  const v2 = boundaryCircleOrigin(o2);
  const v12 = v2.clone().subtract(v1);
  const alpha12 = v12.angle();
  const d12 = v12.magnitude();
  const exit = calculateExit(o1);
  const entry = calculateEntry(o2);
  const r1 = boundaryRadius(o1);
  const r2 = boundaryRadius(o2);
  const r12 = exit === entry ? Math.abs(r1 - r2) : (r1 + r2);
  const t12 = Math.sqrt(Math.pow(d12, 2) - Math.pow(r12, 2));
  const beta = Math.atan2(t12, r12);

  let rotateBy;
  if (exit === entry && r1 >= r2 && exit === "Right")
    rotateBy = -1 * beta;
  else if (exit === entry && r1 >= r2 && exit === "Left")
    rotateBy = beta;
  else if (exit === entry && r1 <= r2 && exit === "Right")
    rotateBy = -1 * (Math.PI - beta);
  else if (exit === entry && r1 <= r2 && exit === "Left")
    rotateBy = Math.PI - beta;
  else if (exit !== entry && r1 >= r2 && exit === "Right")
    rotateBy = -1 * beta;
  else if (exit !== entry && r1 >= r2 && exit === "Left")
    rotateBy = beta;
  else if (exit !== entry && r1 <= r2 && exit === "Right")
    rotateBy = (Math.PI - beta) + Math.PI;
  else if (exit !== entry && r1 <= r2 && exit === "Left")
    rotateBy = (-1 * (Math.PI - beta)) + Math.PI;

  const exitNormal = v12.
                       clone().
                       normalize().
                       multiplyScalar(r1).
                       rotate(rotateBy);

  if (exit === entry && r1 >= r2 && exit === "Right")
    rotateBy = -1 * beta;
  else if (exit === entry && r1 >= r2 && exit === "Left")
    rotateBy = beta;
  else if (exit === entry && r1 <= r2 && exit === "Right")
    rotateBy = -1 * (Math.PI - beta);
  else if (exit === entry && r1 <= r2 && exit === "Left")
    rotateBy = Math.PI - beta;
  else if (exit !== entry && r1 >= r2 && exit === "Right")
    rotateBy = (-1 * beta) + Math.PI;
  else if (exit !== entry && r1 >= r2 && exit === "Left")
    rotateBy = beta + Math.PI;
  else if (exit !== entry && r1 <= r2 && exit === "Right")
    rotateBy = (Math.PI - beta);
  else if (exit !== entry && r1 <= r2 && exit === "Left")
    rotateBy = (-1 * (Math.PI - beta));

  const entryNormal = v12.
                        clone().
                        normalize().
                        multiplyScalar(r2).
                        rotate(rotateBy);

  return {
    o1,
    o2,
    v1,
    v2,
    alpha12,
    d12,
    exit,
    entry,
    r12,
    t12,
    beta,
    exitNormal,
    entryNormal
  };
};

const renderSegment = function(segment) {
  const {x: x1, y: y1} = globalToViewbox(segment.v1.x, segment.v1.y);
  const {x: x2, y: y2} = globalToViewbox(segment.v2.x, segment.v2.y);
  const origin1 = boundaryCircleOrigin(segment.o1);
  const globalNormal1 = origin1.clone().add(segment.exitNormal);
  const {x: xn1, y: yn1} = globalToViewbox(globalNormal1.x, globalNormal1.y);
  const origin2 = boundaryCircleOrigin(segment.o2);
  const globalNormal2 = origin2.clone().add(segment.entryNormal);
  const {x: xn2, y: yn2} = globalToViewbox(globalNormal2.x, globalNormal2.y);
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="lightgray" stroke-width="0.25%" />` +
    `<line x1="${xn1}" y1="${yn1}" x2="${xn2}" y2="${yn2}" stroke="black" stroke-width="0.25%" />`;
};

const renderOrientationVector = function(obstacle) {
  const x2 = obstacle.x + (
    obstacle.orientation === "E" ? 3 :
      obstacle.orientation === "W" ? -3 : 0
  );
  const y2 = obstacle.y + (
    obstacle.orientation === "N" ? 3 :
      obstacle.orientation === "S" ? -3 : 0
  );
  const {x: x1b, y: y1b} = globalToViewbox(obstacle.x, obstacle.y);
  const {x: x2b, y: y2b} = globalToViewbox(x2, y2);
  return `<line x1="${x1b}" y1="${y1b}" x2="${x2b}" y2="${y2b}" stroke="red" stroke-width="0.25%" />`;
};

const renderNormalVector = function(obstacle, localNormal) {
  const origin = boundaryCircleOrigin(obstacle);
  const {x: x1, y: y1} = globalToViewbox(origin.x, origin.y);
  const globalNormal = origin.clone().add(localNormal);
  const {x: x2, y: y2} = globalToViewbox(globalNormal.x, globalNormal.y);
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="green" stroke-width="0.25%" />`;
};

//_.initial is necessary because _.zip will keep the last pair where the end segment is undefined
const courseSegments = _.initial(_.zip(course, _.drop(course))).
      map(([o1, o2]) => calculateSegment(o1, o2));

nunjucks.configure({});
const output = nunjucks.render('example_layout.njk', {
  courseSegments,
  renderedObstacles: course.map(renderObstacle),
  renderedObstacleBoundaries: course.map(renderBoundary),
  renderedCourseSegments: courseSegments.map(renderSegment),
  renderedOrientationVectors: course.map(renderOrientationVector),
  renderedExitVectors: courseSegments.map(segment => renderNormalVector(segment.o1, segment.exitNormal)),
  renderedEntryVectors: courseSegments.map(segment => renderNormalVector(segment.o2, segment.entryNormal))
});
console.log(output);
