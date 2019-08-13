const directions = require('./directions.js');
const canonicalise = require('./canonicalisation.js');
const addDefaults = require('./defaults.js');
const constructNamed = require('./named.js');

const constructor = function(opts = {}) {
  return addDefaults(constructNamed(canonicalise(opts)));
};

constructor.LEFT = directions.LEFT;
constructor.RIGHT = directions.RIGHT;
constructor.EITHER = directions.EITHER;

module.exports = constructor;
