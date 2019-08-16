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

export interface Obstacle {
  name?: string
  origin: Victor,
  orientation: number,
  radius: number,
  entry: symbol,
  exit: symbol,
  partOfCourse?: boolean,
  visible?: boolean,
  leftEntryBoundary: { offset: Victor, radius: number, entry: symbol },
  rightEntryBoundary: { offset: Victor, radius: number, entry: symbol },
  leftExitBoundary: { offset: Victor, radius: number, exit: symbol },
  rightExitBoundary: { offset: Victor, radius: number, exit: symbol }
};
