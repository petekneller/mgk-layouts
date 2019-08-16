const _ = require('lodash');

const zipAdjacent = function<A>(arr: Array<A>): Array<[A, A]> {
  //_.initial is necessary because _.zip will keep the last pair where the end segment is undefined
  return _.initial(_.zip(arr, _.drop(arr)));
};

export {
  zipAdjacent
};
