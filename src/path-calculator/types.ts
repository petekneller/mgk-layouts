type Obstacle = import('../obstacles/types').Obstacle
type OpenObject = import('../types').OpenObject;
import Victor from 'victor';

export interface Segment {
  obstacle1: Obstacle,
  obstacle2: Obstacle,
  boundaryCircle1: OpenObject,
  boundaryCircle2: OpenObject,
  o12: Victor,
  beta: number,
  entry: Victor,
  exit: Victor
}

export type Stage1Segment = {
  obstacle1: Obstacle,
  obstacle2: Obstacle
};

export type Stage2Segment = Stage1Segment & {
  boundaryCircle1: OpenObject
};

export type Stage3Segment = Stage2Segment & {
  boundaryCircle2: OpenObject
};
