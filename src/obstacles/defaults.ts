import vector from '../vectors';
import * as directions from './directions';

type Obstacle = import('./types').Obstacle;

const addDefaults = function(opts: { [x: string]: any }): Obstacle {
  const origin = opts.origin || vector(0, 0);
  const orientation = opts.orientation || 0;
  const radius = opts.radius || 1.0;
  const entry = opts.entry || directions.RIGHT;
  const exit = opts.exit || directions.RIGHT;

  opts.leftEntryBoundary = opts.leftEntryBoundary || {};
  opts.leftEntryBoundary.radius = opts.leftEntryBoundary.radius || radius;
  opts.leftEntryBoundary.offset = opts.leftEntryBoundary.offset ||
    (entry === directions.EITHER ? vector(-1 * radius, 0) : vector(0, 0));
  opts.leftEntryBoundary.entry = opts.leftEntryBoundary.entry ||
    (entry === directions.EITHER ? directions.RIGHT : entry);

  opts.rightEntryBoundary = opts.rightEntryBoundary || {};
  opts.rightEntryBoundary.radius = opts.rightEntryBoundary.radius || radius;
  opts.rightEntryBoundary.offset = opts.rightEntryBoundary.offset ||
    (entry === directions.EITHER ? vector(radius, 0) : vector(0, 0));
  opts.rightEntryBoundary.entry = opts.rightEntryBoundary.entry ||
    (entry === directions.EITHER ? directions.LEFT : entry);

  opts.leftExitBoundary = opts.leftExitBoundary || {};
  opts.leftExitBoundary.radius = opts.leftExitBoundary.radius || radius;
  opts.leftExitBoundary.offset = opts.leftExitBoundary.offset ||
    (exit === directions.EITHER ? vector(-1 * radius, 0) : vector(0, 0));
  opts.leftExitBoundary.exit = opts.leftExitBoundary.exit ||
    (exit === directions.EITHER ? directions.RIGHT : exit);

  opts.rightExitBoundary = opts.rightExitBoundary || {};
  opts.rightExitBoundary.radius = opts.rightExitBoundary.radius || radius;
  opts.rightExitBoundary.offset = opts.rightExitBoundary.offset ||
    (exit === directions.EITHER ? vector(radius, 0) : vector(0, 0));
  opts.rightExitBoundary.exit = opts.rightExitBoundary.exit ||
    (exit === directions.EITHER ? directions.LEFT : exit);

  return {
    ...opts,
    origin,
    orientation,
    radius,
    entry,
    exit,
  };
};

export default addDefaults;
