import vector from '../vectors';
import * as directions from './directions';

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

type OpenObject = import('../types').OpenObject;

const eitherOpts = function(opts: OpenObject): void {
  // For none of the 'either' obstacles is it desirable at the moment
  // to allow overriding the setup of the left/right/entry/exit
  // boundaries - its too complicated.
  // However it is desirable to be able to override the either-ness
  // of the obtacle. ie. force the entry/exit to a particular side
  opts.entry = opts.entry || directions.EITHER;
  opts.exit = opts.exit || directions.EITHER;

  const leftEntryBoundary = {
    radius: opts.radius,
    origin: vector(-1 * opts.radius, 0),
    side: directions.RIGHT
  };

  const rightEntryBoundary = {
    radius: opts.radius,
    origin: vector(opts.radius, 0),
    side: directions.LEFT
  };

  opts.entryBoundaries = (opts.entry === directions.LEFT) ?
    leftEntryBoundary :
    (opts.entry === directions.RIGHT) ?
      rightEntryBoundary :
      [leftEntryBoundary, rightEntryBoundary];

  const leftExitBoundary = {
    radius: opts.radius,
    origin: vector(-1 * opts.radius, 0),
    side: directions.RIGHT
  };

  const rightExitBoundary = {
    radius: opts.radius,
    origin: vector(opts.radius, 0),
    side: directions.LEFT
  };

  opts.exitBoundaries = (opts.exit === directions.LEFT) ?
    leftExitBoundary :
    (opts.exit === directions.RIGHT) ?
      rightExitBoundary :
      [leftExitBoundary, rightExitBoundary];
};

const constructNamed = function(opts: OpenObject): OpenObject {
  switch (opts.name) {
  case Symbol.keyFor(LEFT_TURN):
  case Symbol.keyFor(LEFT_ROTATION): {
    opts.entry = directions.RIGHT;
    opts.exit = directions.RIGHT;
    opts.radius = opts.radius || 1.5;
    break;
  }
  case Symbol.keyFor(RIGHT_TURN):
  case Symbol.keyFor(RIGHT_ROTATION): {
    opts.entry = directions.LEFT;
    opts.exit = directions.LEFT;
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

export default constructNamed;
