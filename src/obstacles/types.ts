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

export interface EntryBoundary {
  offset: Victor,
  radius: number,
  entry: symbol
};

export interface ExitBoundary {
  offset: Victor,
  radius: number,
  exit: symbol
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
  entryBoundaries: EntryBoundary | [EntryBoundary, EntryBoundary],
  exitBoundaries: ExitBoundary | [ExitBoundary, ExitBoundary];
};
