const nunjucks = require('nunjucks');
const _ = require('lodash');
const Victor = require('victor');

const obstacles = [{
  type: "StartBox",
  x: 15,
  y: 5,
  orientation: "N"
}, {
  type: "RightTurn",
  x: 10,
  y: 10,
  orientation: "N"
}, {
  type: "LeftTurn",
  x: 12,
  y: 15,
  orientation: "N"
}, {
  type: "RightTurn",
  x: 10,
  y: 20,
  orientation: "N"
}, {
  type: "LeftTurn",
  x: 12,
  y: 25,
  orientation: "N"
}, {
  type: "RightTurn",
  x: 10,
  y: 30,
  orientation: "N"
}, {
  type: "RightRotation",
  x: 20,
  y: 30,
  orientation: "N"
}, {
  type: "Gate",
  x: 25,
  y: 18,
  orientation: "S"
}, {
  type: "FinishBox",
  x: 20,
  y: 5,
  orientation: "N"
}];

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
  switch (obstacle.type) {
  // TODO: simplifying assumption that start/finish boxes and gates are always 'handed' the same way
  case "StartBox":
  case "Gate": {
    const {x, y} = globalToViewbox(obstacle.x - 0.75, obstacle.y);
    return `<circle r="0.75" cx="${x}" cy="${y}" class="boundaryCircle" />`;
  }
  case "FinishBox": {
    const {x, y} = globalToViewbox(obstacle.x + 0.75, obstacle.y);
    return `<circle r="0.75" cx="${x}" cy="${y}" class="boundaryCircle" />`;
  }
  case "LeftTurn":
  case "RightTurn":
  case "LeftRotation":
  case "RightRotation": {
    const {x, y} = globalToViewbox(obstacle.x, obstacle.y);
    return `<circle r="1" cx="${x}" cy="${y}" class="boundaryCircle" />`;
  }
  default: return "";
  }
};

const calculateSegment = function(o1, o2) {
  const v1 = Victor(o1.x, o1.y);
  const v2 = Victor(o2.x, o2.y);
  const v12 = v2.subtract(v1);

  return {
    o1,
    o2,
    alpha12: v12.angle(),
    d12: v12.magnitude(),
  };
};

const renderSegment = function(segment) {
  const {x: x1, y: y1} = globalToViewbox(segment.o1.x, segment.o1.y);
  const {x: x2, y: y2} = globalToViewbox(segment.o2.x, segment.o2.y);
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="black" stroke-width="0.25%" />`;
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

//_.initial is necessary because _.zip will keep the last pair where the end segment is undefined
const courseSegments = _.initial(_.zip(obstacles, _.drop(obstacles))).
      map(([o1, o2]) => calculateSegment(o1, o2));

nunjucks.configure({});
const output = nunjucks.render('example_layout.njk', {
  courseSegments,
  renderedObstacles: obstacles.map(renderObstacle),
  renderedObstacleBoundaries: obstacles.map(renderBoundary),
  renderedCourseSegments: courseSegments.map(renderSegment),
  renderedOrientationVectors: obstacles.map(renderOrientationVector)
});
console.log(output);
