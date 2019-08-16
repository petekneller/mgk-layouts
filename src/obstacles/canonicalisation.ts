import vector from 'victor';
import * as directions from './directions';

const orientationFromCardinal = function(orientation: string | any): number | any {
  return orientation === 'N' ? 0 :
    orientation === 'E' ? 90 :
    orientation === 'S' ? 180 :
    orientation === 'W' ? 270 :
    orientation;
};

const canonicalise = function(opts: { [x: string]: any }): { [x: string]: any } {
  if (opts.hasOwnProperty('origin'))
    opts.origin = vector.fromObject(opts.origin);

  if (opts.hasOwnProperty('entry'))
    opts.entry = directions.directionFromString(opts.entry);

  if (opts.hasOwnProperty('exit'))
    opts.exit = directions.directionFromString(opts.exit);

  if (opts.hasOwnProperty('orientation'))
    opts.orientation = orientationFromCardinal(opts.orientation);

  return opts;
};

export default canonicalise;
