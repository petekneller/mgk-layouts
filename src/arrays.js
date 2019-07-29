const _ = require('lodash');

const zipAdjacent = function(arr) {
  //_.initial is necessary because _.zip will keep the last pair where the end segment is undefined
  return _.initial(_.zip(arr, _.drop(arr)));
};

module.exports = {
  zipAdjacent
};
