export interface ObstacleOpts {
    origin?: object,
    orientation?: string | number,
    radius?: number,
    entry?: string | symbol,
    exit?: string | symbol,
    [x: string]: any
};

export interface Obstacle {
    origin: object,
    orientation: number,
    radius: number,
    entry: symbol,
    exit: symbol,
    [x: string]: any
};
