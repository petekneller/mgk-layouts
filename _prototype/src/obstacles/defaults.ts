import vector from '../vectors';
import * as directions from './directions';

type OpenObject = import('../types').OpenObject;
type Obstacle = import('./types').Obstacle;

const addDefaults = function(opts: OpenObject): Obstacle {
  const origin = opts.origin || vector(0, 0);
  const orientation = opts.orientation || 0;
  const radius = opts.radius || 1.0;
  const entry = opts.entry || directions.RIGHT;
  const exit = opts.exit || directions.RIGHT;

  opts.entryBoundaries = opts.entryBoundaries || (opts.entry === directions.EITHER ? new Array() : {});
  if (Array.isArray(opts.entryBoundaries)) {
    opts.entryBoundaries[0] = opts.entryBoundaries[0] || {};
    opts.entryBoundaries[0].radius = opts.entryBoundaries[0].radius || radius;
    opts.entryBoundaries[0].origin = opts.entryBoundaries[0].origin || vector(-1 * radius, 0);
    opts.entryBoundaries[0].side = opts.entryBoundaries[0].side || directions.RIGHT;

    opts.entryBoundaries[1] = opts.entryBoundaries[1] || {};
    opts.entryBoundaries[1].radius = opts.entryBoundaries[1].radius || radius;
    opts.entryBoundaries[1].origin = opts.entryBoundaries[1].origin || vector(radius, 0);
    opts.entryBoundaries[1].side = opts.entryBoundaries[1].side || directions.LEFT;
  } else {
    opts.entryBoundaries.radius = opts.entryBoundaries.radius || radius;
    opts.entryBoundaries.origin = opts.entryBoundaries.origin || vector(0, 0);
    opts.entryBoundaries.side = opts.entryBoundaries.side || entry;
  }

  opts.exitBoundaries = opts.exitBoundaries || (opts.exit === directions.EITHER ? new Array() : {});
  if (Array.isArray(opts.exitBoundaries)) {
    opts.exitBoundaries[0] = opts.exitBoundaries[0] || {};
    opts.exitBoundaries[0].radius = opts.exitBoundaries[0].radius || radius;
    opts.exitBoundaries[0].origin = opts.exitBoundaries[0].origin || vector(-1 * radius, 0);
    opts.exitBoundaries[0].side = opts.exitBoundaries[0].side || directions.RIGHT;

    opts.exitBoundaries[1] = opts.exitBoundaries[1] || {};
    opts.exitBoundaries[1].radius = opts.exitBoundaries[1].radius || radius;
    opts.exitBoundaries[1].origin = opts.exitBoundaries[1].origin || vector(radius, 0);
    opts.exitBoundaries[1].side = opts.exitBoundaries[1].side || directions.LEFT;
  } else {
    opts.exitBoundaries.radius = opts.exitBoundaries.radius || radius;
    opts.exitBoundaries.origin = opts.exitBoundaries.origin || vector(0, 0);
    opts.exitBoundaries.side = opts.exitBoundaries.side || exit;
  }

  return {
    ...opts,
    origin,
    orientation,
    radius,
    entry,
    exit,
    entryBoundaries: opts.entryBoundaries,
    exitBoundaries: opts.exitBoundaries
  };
};

export default addDefaults;
