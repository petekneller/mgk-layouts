type Obstacle = import('../obstacles/types').Obstacle
type BoundaryCircle = import('../obstacles/types').BoundaryCircle
import Victor from 'victor';

export interface Segment {
  obstacle1: Obstacle,
  obstacle2: Obstacle,
  boundaryCircle1: BoundaryCircle,
  boundaryCircle2: BoundaryCircle,
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
  boundaryCircle1: BoundaryCircle
};

export type Stage3Segment = Stage2Segment & {
  boundaryCircle2: BoundaryCircle
};
