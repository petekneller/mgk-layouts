const gridToViewport = function(maxGridExtent: number): [(x: number) => number, (y: number) => number, (o: { x: number, y: number }) => {x: number, y: number}] {
  return [
    function(x: number): number {
      return x;
    },
    function(y: number): number {
      return maxGridExtent - y;
    },
    function({x, y}: {x: number, y: number}): {x: number, y: number} {
      return {x, y: maxGridExtent - y};
    }
  ];
};

export {
  gridToViewport
}
