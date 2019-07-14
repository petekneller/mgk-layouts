const victor = require('victor');

const LEFT = Symbol('Left');
const RIGHT = Symbol('Right');

const obstacle = function({
                   origin = victor(0, 0),
                   radius = 1.0,
                   entry = RIGHT,
                   exit = RIGHT
                 } = {}) {
  return {
    origin,
    radius,
    entry,
    exit
  };
};

obstacle.LEFT = LEFT;
obstacle.RIGHT = RIGHT;

module.exports = obstacle;
