const panTransform = function(viewboxCentre: {x: number, y: number}) {
  const { x: viewboxX, y: viewboxY } = viewboxCentre;
  return function(panCentre: {x: number, y: number}, zoomFactor: number): {x: number, y: number} {
    const { x, y } = panCentre;
    const [ scaledX, scaledY ] = [ x * zoomFactor, y * zoomFactor ];
    const [ translateX, translateY ] = [ scaledX - viewboxX, scaledY - viewboxY ];
    return { x: -1 * translateX, y: -1 * translateY };
  };
};

export default panTransform;
