const obstacle = require('../obstacles');

const deserializer = function(course) {
  if (!course.hasOwnProperty('obstacles')) {
    console.warn('property "obstacles" not found in course; skipping rest of deserialization');
    return course;
  }

  course.obstacles = course.obstacles.map(o => obstacle(o));

  return course;
};

module.exports = deserializer;
