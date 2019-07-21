const nunjucks = require('nunjucks');
const _ = require('lodash');
const Victor = require('victor');
const process = require('process');
const fs = require('fs');
const pathCalculator = require('./src/path-calculator/path-calculator.js');
const deserializer = require('./src/serialization/deserializer.js');

const courseFile = process.argv.slice(2)[0]; // drop the js file path
const course = deserializer(JSON.parse(fs.readFileSync(courseFile))).obstacles;

const svgViewSize = { x: 40, y: 40};

const globalToViewbox = function(x, y) {
  return { x: x, y: (svgViewSize.y - y) };
};

const renderObstacle = function(obstacle) {
  const {x, y} = globalToViewbox(obstacle.origin.x, obstacle.origin.y);
  switch (obstacle.name) {
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
  return obstacle.radius;
};

const boundaryCircleOrigin = function(obstacle) {
  // TODO: simplifying assumption that start/finish boxes and gates are always 'handed' the same way
  switch (obstacle.name) {
  case "StartBox": return Victor(obstacle.origin.x - 0.75, obstacle.origin.y);
  case "Gate": return Victor(obstacle.origin.x - 0.75, obstacle.origin.y);
  case "FinishBox": return Victor(obstacle.origin.x + 0.75, obstacle.origin.y);
  default: return Victor(obstacle.origin.x, obstacle.origin.y);
  }
};

const calculateExit = function(obstacle) {
  switch(obstacle.name) {
  case "StartBox": return "Right";
  case "LeftTurn": return "Right";
  case "RightTurn": return "Left";
  case "RightRotation": return "Left";
  case "Gate": return "Left";
  default: return "Left";
  }
};

const calculateEntry = function(obstacle) {
  switch(obstacle.name) {
  case "FinishBox": return "Right";
  case "LeftTurn": return "Right";
  case "RightTurn": return "Left";
  case "RightRotation": return "Left";
  case "Gate": return "Left";
  default: return "Left";
  }
};

const renderSegment = function(segment) {
  const {x: x1, y: y1} = globalToViewbox(segment.o1.origin.x, segment.o1.origin.y);
  const {x: x2, y: y2} = globalToViewbox(segment.o2.origin.x, segment.o2.origin.y);
  const origin1 = boundaryCircleOrigin(segment.o1);
  const globalNormal1 = origin1.clone().add(segment.exit);
  const {x: xn1, y: yn1} = globalToViewbox(globalNormal1.x, globalNormal1.y);
  const origin2 = boundaryCircleOrigin(segment.o2);
  const globalNormal2 = origin2.clone().add(segment.entry);
  const {x: xn2, y: yn2} = globalToViewbox(globalNormal2.x, globalNormal2.y);
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="lightgray" stroke-width="0.25%" />` +
    `<line x1="${xn1}" y1="${yn1}" x2="${xn2}" y2="${yn2}" stroke="black" stroke-width="0.25%" />`;
};

const renderOrientationVector = function(obstacle) {
  const x2 = obstacle.origin.x + (
    obstacle.orientation === "E" ? 3 :
      obstacle.orientation === "W" ? -3 : 0
  );
  const y2 = obstacle.origin.y + (
    obstacle.orientation === "N" ? 3 :
      obstacle.orientation === "S" ? -3 : 0
  );
  const {x: x1b, y: y1b} = globalToViewbox(obstacle.origin.x, obstacle.origin.y);
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
      map(([o1, o2]) => pathCalculator.calculateSegment(o1, o2));

nunjucks.configure({});
const output = nunjucks.render('example_layout.njk', {
  courseSegments,
  renderedObstacles: course.map(renderObstacle),
  renderedObstacleBoundaries: course.map(renderBoundary),
  renderedCourseSegments: courseSegments.map(renderSegment),
  renderedOrientationVectors: course.map(renderOrientationVector),
  renderedExitVectors: courseSegments.map(segment => renderNormalVector(segment.o1, segment.exit)),
  renderedEntryVectors: courseSegments.map(segment => renderNormalVector(segment.o2, segment.entry))
});
console.log(output);
