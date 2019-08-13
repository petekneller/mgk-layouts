const vector = require('victor');
const directions = require('./directions.js');

const addDefaults = function(opts) {
  opts.origin = opts.origin || vector(0, 0);
  opts.orientation = opts.orientation || 0;
  opts.radius = opts.radius || 1.0;
  opts.entry = opts.entry || directions.RIGHT;
  opts.exit = opts.exit || directions.RIGHT;

  opts.leftEntryBoundary = opts.leftEntryBoundary || {};
  opts.leftEntryBoundary.radius = opts.leftEntryBoundary.radius || opts.radius;
  opts.leftEntryBoundary.offset = opts.leftEntryBoundary.offset ||
    (opts.entry === directions.EITHER ? vector(-1 * opts.radius, 0) : vector(0, 0));
  opts.leftEntryBoundary.entry = opts.leftEntryBoundary.entry ||
    (opts.entry === directions.EITHER ? directions.RIGHT : opts.entry);

  opts.rightEntryBoundary = opts.rightEntryBoundary || {};
  opts.rightEntryBoundary.radius = opts.rightEntryBoundary.radius || opts.radius;
  opts.rightEntryBoundary.offset = opts.rightEntryBoundary.offset ||
    (opts.entry === directions.EITHER ? vector(opts.radius, 0) : vector(0, 0));
  opts.rightEntryBoundary.entry = opts.rightEntryBoundary.entry ||
    (opts.entry === directions.EITHER ? directions.LEFT : opts.entry);

  opts.leftExitBoundary = opts.leftExitBoundary || {};
  opts.leftExitBoundary.radius = opts.leftExitBoundary.radius || opts.radius;
  opts.leftExitBoundary.offset = opts.leftExitBoundary.offset ||
    (opts.exit === directions.EITHER ? vector(-1 * opts.radius, 0) : vector(0, 0));
  opts.leftExitBoundary.exit = opts.leftExitBoundary.exit ||
    (opts.exit === directions.EITHER ? directions.RIGHT : opts.exit);

  opts.rightExitBoundary = opts.rightExitBoundary || {};
  opts.rightExitBoundary.radius = opts.rightExitBoundary.radius || opts.radius;
  opts.rightExitBoundary.offset = opts.rightExitBoundary.offset ||
    (opts.exit === directions.EITHER ? vector(opts.radius, 0) : vector(0, 0));
  opts.rightExitBoundary.exit = opts.rightExitBoundary.exit ||
    (opts.exit === directions.EITHER ? directions.LEFT : opts.exit);

  return opts;
};

module.exports = addDefaults;
