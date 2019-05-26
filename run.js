var nunjucks = require('nunjucks');
var _ = require('lodash');


var obstacles = [{
  type: "StartBox",
  x: 15,
  y: 35
}, {
  type: "RightTurn",
  x: 10,
  y: 30
}, {
  type: "LeftTurn",
  x: 12,
  y: 25
}, {
  type: "RightTurn",
  x: 10,
  y: 20
}, {
  type: "LeftTurn",
  x: 12,
  y: 15
}, {
  type: "RightTurn",
  x: 10,
  y: 10
}, {
  type: "RightRotation",
  x: 20,
  y: 10
}, {
  type: "Gate",
  x: 25,
  y: 22
}, {
  type: "FinishBox",
  x: 20,
  y: 35
}];

var renderBoundary = function(obstacle) {
  switch (obstacle.type) {
  case "StartBox":
    return `<circle r="0.75" cx="${obstacle.x - 0.75}" cy="${obstacle.y}" class="boundaryCircle" />`;
  case "FinishBox":
    return `<circle r="0.75" cx="${obstacle.x + 0.75}" cy="${obstacle.y}" class="boundaryCircle" />`;
  case "Gate":
    return `<circle r="0.75" cx="${obstacle.x - 0.75}" cy="${obstacle.y}" class="boundaryCircle" />`;
  case "LeftTurn":
  case "RightTurn":
  case "LeftRotation":
  case "RightRotation":
    return `<circle r="1" cx="${obstacle.x}" cy="${obstacle.y}" class="boundaryCircle" />`;
  default:
    return "";
  }
};

var renderCourseSegment = function(startObstacle, endObstacle) {
  return `<line x1="${startObstacle.x}" y1="${startObstacle.y}" x2="${endObstacle.x}" y2="${endObstacle.y}" stroke="black" stroke-width="0.5%" />`;
};

// _.initial is necessary because _.zip will keep the last pair where the end segment is undefined
var courseSegments = _.initial(_.zip(obstacles, _.drop(obstacles)));

nunjucks.configure({});
var output = nunjucks.render('example_layout.njk', {
  obstacleBoundaries: obstacles.map(function (o) { return renderBoundary(o); }),
  courseSegments: courseSegments.map(function (a) { return renderCourseSegment(a[0], a[1]); })
});
console.log(output);
