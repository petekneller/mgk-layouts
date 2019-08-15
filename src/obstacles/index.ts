import * as directions from './directions';
import canonicalise from './canonicalisation';
import addDefaults from './defaults';
import constructNamed from './named';

type ObstacleOpts = import('./types').ObstacleOpts;
type Obstacle = import('./types').Obstacle;

const constructor = function(opts: ObstacleOpts = {}): Obstacle {
  return addDefaults(constructNamed(canonicalise(opts)));
};

constructor.LEFT = directions.LEFT;
constructor.RIGHT = directions.RIGHT;
constructor.EITHER = directions.EITHER;

export default constructor;
