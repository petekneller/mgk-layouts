import Victor from 'victor';

export interface ObstacleOpts {
  origin?: Victor | { x: number, y: number },
  orientation?: string | number,
  radius?: number,
  entry?: string | symbol,
  exit?: string | symbol,
};

export interface Obstacle {
  origin: Victor,
  orientation: number,
  radius: number,
  entry: symbol,
  exit: symbol,
};
