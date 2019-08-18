import Victor from 'victor';

export interface ObstacleOpts {
  name?: string,
  origin?: Victor | { x: number, y: number },
  orientation?: string | number,
  radius?: number,
  entry?: string | symbol,
  exit?: string | symbol,
  partOfCourse?: boolean,
  visible?: boolean
};

export interface BoundaryCircle {
  offset: Victor,
  radius: number,
  side: symbol
};

export interface Obstacle {
  name?: string
  origin: Victor,
  orientation: number,
  radius: number,
  entry: symbol,
  exit: symbol,
  partOfCourse?: boolean,
  visible?: boolean,
  entryBoundaries: BoundaryCircle | [BoundaryCircle, BoundaryCircle],
  exitBoundaries: BoundaryCircle | [BoundaryCircle, BoundaryCircle],
};
