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
const OUT_OF_BOUNDS = Symbol.for('OutOfBounds');
const GAP_ENTRY = Symbol.for('GapEntry');
const GAP_EXIT = Symbol.for('GapExit');


const addDefaults = function(opts) {
  opts.origin = opts.origin || victor(0, 0);
  opts.orientation = opts.orientation || 0;
  opts.radius = opts.radius || 1.0;

  opts.entry = opts.entry || RIGHT;
  opts.leftEntryBoundary = opts.leftEntryBoundary || {};
  opts.leftEntryBoundary.offset = opts.leftEntryBoundary.offset || victor(0, 0);
  opts.leftEntryBoundary.radius = opts.leftEntryBoundary.radius || opts.radius;
  opts.leftEntryBoundary.entry = opts.leftEntryBoundary.entry || opts.entry;

  opts.rightEntryBoundary = opts.rightEntryBoundary || {};
  opts.rightEntryBoundary.offset = opts.rightEntryBoundary.offset || victor(0, 0);
  opts.rightEntryBoundary.radius = opts.rightEntryBoundary.radius || opts.radius;
  opts.rightEntryBoundary.entry = opts.rightEntryBoundary.entry || opts.entry;

  opts.exit = opts.exit || RIGHT;
  opts.leftExitBoundary = opts.leftExitBoundary || {};
  opts.leftExitBoundary.offset = opts.leftExitBoundary.offset || victor(0, 0);
  opts.leftExitBoundary.radius = opts.leftExitBoundary.radius || opts.radius;
  opts.leftExitBoundary.exit = opts.leftExitBoundary.exit || opts.exit;

  opts.rightExitBoundary = opts.rightExitBoundary || {};
  opts.rightExitBoundary.offset = opts.rightExitBoundary.offset || victor(0, 0);
  opts.rightExitBoundary.radius = opts.rightExitBoundary.radius || opts.radius;
  opts.rightExitBoundary.exit = opts.rightExitBoundary.exit || opts.exit;

  return opts;
};

const eitherOpts = function(opts) {
  // For none of the 'either' obstacles is it desirable at the moment
  // to allow overriding the setup of the left/right/entry/exit
  // boundaries - its too complicated.
  // However it is desirable to be able to override the either-ness
  // of the obtacle. ie. force the entry/exit to a particular side
  opts.entry = opts.entry || EITHER;
  opts.exit = opts.exit || EITHER;

  opts.leftEntryBoundary = {};
  opts.leftEntryBoundary.offset = victor(-1 * opts.radius, 0);
  opts.leftEntryBoundary.entry = obstacle.RIGHT;

  opts.rightEntryBoundary = {};
  opts.rightEntryBoundary.offset = victor(opts.radius, 0);
  opts.rightEntryBoundary.entry = obstacle.LEFT;

  opts.leftExitBoundary = {};
  opts.leftExitBoundary.offset = victor(-1 * opts.radius, 0);
  opts.leftExitBoundary.exit = obstacle.RIGHT;

  opts.rightExitBoundary = {};
  opts.rightExitBoundary.offset = victor(opts.radius, 0);
  opts.rightExitBoundary.exit = obstacle.LEFT;
};

const constructNamed = function(opts) {
  switch (opts.name) {
  case Symbol.keyFor(LEFT_TURN):
  case Symbol.keyFor(LEFT_ROTATION): {
    opts.entry = RIGHT;
    opts.exit = RIGHT;
    opts.radius = opts.radius || 1.5;
    break;
  }
  case Symbol.keyFor(RIGHT_TURN):
  case Symbol.keyFor(RIGHT_ROTATION): {
    opts.entry = LEFT;
    opts.exit = LEFT;
    opts.radius = opts.radius || 1.5;
    break;
  }
  case Symbol.keyFor(GATE): {
    opts.width = opts.width || 1.5;
    opts.radius = opts.radius || 2;
    eitherOpts(opts);
    break;
  }
  case Symbol.keyFor(START_BOX):
  case Symbol.keyFor(FINISH_BOX): {
    opts.width = opts.width || 1.5;
    opts.depth = opts.depth || 3;
    opts.radius = opts.radius || 0.1;
    eitherOpts(opts);
    break;
  }
  case Symbol.keyFor(OUT_OF_BOUNDS): {
    opts.partOfCourse = opts.partOfCourse || false;
    break;
  }
  case Symbol.keyFor(GAP_ENTRY):
  case Symbol.keyFor(GAP_EXIT): {
    opts.radius = opts.radius || 0.01;
    break;
  }
  }
  return opts;
};

const deserializeTypes = function(opts) {
  if (opts.hasOwnProperty('origin'))
    opts.origin = victor.fromObject(opts.origin);

  if (opts.hasOwnProperty('entry'))
    opts.entry = directionFromString(opts.entry);

  if (opts.hasOwnProperty('leftEntryBoundary')) {
    opts.leftEntryBoundary.offset = victor.fromObject(opts.leftEntryBoundary.offset);
    opts.leftEntryBoundary.entry = directionFromString(opts.leftEntryBoundary.entry);
  }

  if (opts.hasOwnProperty('rightEntryBoundary')) {
    opts.rightEntryBoundary.offset = victor.fromObject(opts.rightEntryBoundary.offset);
    opts.rightEntryBoundary.entry = directionFromString(opts.rightEntryBoundary.entry);
  }

  if (opts.hasOwnProperty('exit'))
    opts.exit = directionFromString(opts.exit);

  if (opts.hasOwnProperty('leftExitBoundary')) {
    opts.leftExitBoundary.offset = victor.fromObject(opts.leftExitBoundary.offset);
    opts.leftExitBoundary.exit = directionFromString(opts.leftExitBoundary.exit);
  }

  if (opts.hasOwnProperty('rightExitBoundary')) {
    opts.rightExitBoundary.offset = victor.fromObject(opts.rightExitBoundary.offset);
    opts.rightExitBoundary.exit = directionFromString(opts.rightExitBoundary.exit);
  }

  if (opts.hasOwnProperty('orientation'))
    opts.orientation = orientationFromCardinal(opts.orientation);


  return opts;
};

const obstacle = function(opts = {}) {
  return addDefaults(constructNamed(deserializeTypes(opts)));
};

obstacle.LEFT = LEFT;
obstacle.RIGHT = RIGHT;
obstacle.EITHER = EITHER;

module.exports = obstacle;
