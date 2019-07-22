const victor = require('victor');

// 'Directions' for entry and exit
const LEFT = Symbol.for('Left');
const RIGHT = Symbol.for('Right');
const EITHER = Symbol.for('Either');

const directions = [LEFT, RIGHT, EITHER];
const directionFromString = function(s) {
  if (typeof s === 'string')
    for (const dir of directions)
      if (Symbol.keyFor(dir) === s)
        return dir;

  return s;
};

// Orientation
const orientationFromCardinal = function(orientation) {
  return orientation === 'N' ? 0 :
    orientation === 'E' ? 90 :
    orientation === 'S' ? 180 :
    orientation === 'W' ? 270 :
    orientation;
};

const orientationFromBearing = function(orientation) {
  return (typeof orientation === 'number') ?
    victor(0, 1).rotate(-1 * orientation * Math.PI / 180):
    orientation;
};

// Named (known) obstacles
// TODO: this feels a bit sloppy having basially a
// registry of known obstacles direction in the obstacle
// constructor - maybe extract it and move elsewhere?
// [[id:a5a32318-a1f8-4e8c-9ac3-c2defead89b4][separate deserialisation concerns from the =obstacle= constructor]]
const LEFT_TURN = Symbol.for('LeftTurn');
const LEFT_ROTATION = Symbol.for('LeftRotation');
const RIGHT_TURN = Symbol.for('RightTurn');
const RIGHT_ROTATION = Symbol.for('RightRotation');
const START_BOX = Symbol.for('StartBox');
const FINISH_BOX = Symbol.for('FinishBox');
const GATE = Symbol.for('Gate');


const addDefaults = function(opts) {
  const origin = opts.origin || { x: 0, y: 0 };
  opts.origin = victor.fromObject(origin);

  opts.entry = directionFromString(opts.entry) || RIGHT;
  opts.exit = directionFromString(opts.exit) || RIGHT;
  opts.orientation = orientationFromBearing(orientationFromCardinal(opts.orientation)) || victor(0, 1);

  opts.radius = opts.radius || 1.0;

  return opts;
};

const constructNamed = function(opts) {
  switch (opts.name) {
  case Symbol.keyFor(LEFT_TURN):
  case Symbol.keyFor(LEFT_ROTATION): {
    opts.entry = RIGHT;
    opts.exit = RIGHT;
    opts.radius = opts.radius || 1.0;
    break;
  }
  case Symbol.keyFor(RIGHT_TURN):
  case Symbol.keyFor(RIGHT_ROTATION): {
    opts.entry = LEFT;
    opts.exit = LEFT;
    opts.radius = opts.radius || 1.0;
    break;
  }
  case Symbol.keyFor(START_BOX):
  case Symbol.keyFor(FINISH_BOX):
  case Symbol.keyFor(GATE): {
    opts.entry = EITHER;
    opts.exit = EITHER;
    opts.radius = opts.radius || 0.75;
    break;
  }
  }
  return opts;
};

const obstacle = function(opts = {}) {
  return addDefaults(constructNamed(opts));
};

obstacle.LEFT = LEFT;
obstacle.RIGHT = RIGHT;
obstacle.EITHER = EITHER;

module.exports = obstacle;
