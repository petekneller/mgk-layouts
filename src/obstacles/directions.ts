// 'Directions' for entry and exit
const LEFT = Symbol.for('Left');
const RIGHT = Symbol.for('Right');
const EITHER = Symbol.for('Either');

const directions = [LEFT, RIGHT, EITHER];
const directionFromString = function(s) {
  if (typeof s === 'string')
    for (const dir of directions)
      if (Symbol.keyFor(dir) === s)
        return dir;

  return s;
};

export {
  LEFT,
  RIGHT,
  EITHER,
  directionFromString
};
