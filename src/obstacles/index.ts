import * as directions from './directions';
import canonicalise from './canonicalisation';
import addDefaults from './defaults';
import constructNamed from './named';
import Victor from 'victor';

type OpenObject = import('../types').OpenObject;
type ObstacleOpts = import('./types').ObstacleOpts;
type Obstacle = import('./types').Obstacle;

const constructor = function(opts: ObstacleOpts & OpenObject = {}): Obstacle & OpenObject {
  return addDefaults(constructNamed(canonicalise(opts)));
};

constructor.LEFT = directions.LEFT;
constructor.RIGHT = directions.RIGHT;
constructor.EITHER = directions.EITHER;

const localVectorToGlobalOrientation = function(obstacle: Obstacle, vector: Victor) {
  return vector.clone().rotateDeg(-1 * obstacle.orientation);
};

const localVectorToGlobal = function(obstacle: Obstacle, vector: Victor) {
  return obstacle.origin.clone().add(localVectorToGlobalOrientation(obstacle, vector));
};

export default constructor;
export {
  localVectorToGlobalOrientation,
  localVectorToGlobal
}
