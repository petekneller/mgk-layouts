const nunjucks = require('nunjucks');
const _ = require('lodash');

const obstacles = [{
  type: "StartBox",
  x: 15,
  y: 5
}, {
  type: "RightTurn",
  x: 10,
  y: 10
}, {
  type: "LeftTurn",
  x: 12,
  y: 15
}, {
  type: "RightTurn",
  x: 10,
  y: 20
}, {
  type: "LeftTurn",
  x: 12,
  y: 25
}, {
  type: "RightTurn",
  x: 10,
  y: 30
}, {
  type: "RightRotation",
  x: 20,
  y: 30
}, {
  type: "Gate",
  x: 25,
  y: 18
}, {
  type: "FinishBox",
  x: 20,
  y: 5
}];

// const renderBoundary = function(obstacle) {
//   switch (obstacle.type) {
//   case "StartBox":
//     return `<circle r="0.75" cx="${obstacle.x - 0.75}" cy="${obstacle.y}" class="boundaryCircle" />`;
//   case "FinishBox":
//     return `<circle r="0.75" cx="${obstacle.x + 0.75}" cy="${obstacle.y}" class="boundaryCircle" />`;
//   case "Gate":
//     return `<circle r="0.75" cx="${obstacle.x - 0.75}" cy="${obstacle.y}" class="boundaryCircle" />`;
//   case "LeftTurn":
//   case "RightTurn":
//   case "LeftRotation":
//   case "RightRotation":
//     return `<circle r="1" cx="${obstacle.x}" cy="${obstacle.y}" class="boundaryCircle" />`;
//   default:
//     return "";
//   }
// };

// const renderCourseSegment = function(startObstacle, endObstacle) {
//   return `<line x1="${startObstacle.x}" y1="${startObstacle.y}" x2="${endObstacle.x}" y2="${endObstacle.y}" stroke="black" stroke-width="0.5%" />`;
// };

// _.initial is necessary because _.zip will keep the last pair where the end segment is undefined
//const courseSegments = _.initial(_.zip(obstacles, _.drop(obstacles)));

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

nunjucks.configure({});
const output = nunjucks.render('example_layout.njk', {
  obstacles: obstacles.map(renderObstacle)
  // obstacleBoundaries: obstacles.map(function (o) { return renderBoundary(o); }),
  // courseSegments: courseSegments.map(function (a) { return renderCourseSegment(a[0], a[1]); })
});
console.log(output);
