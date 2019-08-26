import React from 'react';
import styles from './MainGrid.module.css';
import { gridToViewport } from './transformation';

interface Props {
  maxViewboxExtent: number,
  maxGridExtent: number,
  panCentre: {x: number, y: number},
  zoomFactor: number,
  children?: React.ReactNode
}

const MainGrid = (props: Props) => {
  const [,, gridToViewportXY] = gridToViewport(props.maxGridExtent);

  const transformString = function(centre: {x: number, y: number}, zoomFactor: number): string {
    const {x, y} = gridToViewportXY(centre);
    // const basicViewboxYOffset = -1 * ((props.maxGridExtent * zoomFactor) - props.maxViewboxExtent);
    const viewboxCentre = props.maxViewboxExtent / 2;
    const panOffsetX = (x * zoomFactor) - viewboxCentre;
    const panOffsetY = (y * zoomFactor) - viewboxCentre;
    return `translate(${-1 * panOffsetX}, ${-1 * panOffsetY}) scale(${zoomFactor})`
  };

  return (
    <g transform={ transformString(props.panCentre, props.zoomFactor) }>

      <g className={ styles['minor-grid'] }>
        { [...Array(props.maxGridExtent).keys()].map(idx =>
          <line y1='0' y2={props.maxGridExtent} x1={idx} x2={idx} key={`minor-x-${idx}`} />
        )}
        { [...Array(props.maxGridExtent).keys()].map(idx =>
          <line x1='0' x2={props.maxGridExtent} y1={idx} y2={idx} key={`minor-y-${idx}`} />
        )}
      </g>

      <g className={ styles['major-grid'] }>
        { [...Array(props.maxGridExtent/10).keys()].map(idx =>
          <line y1='0' y2={props.maxGridExtent} x1={idx * 10} x2={idx * 10} key={`major-x-${idx * 10}`} />
        )}
        { [...Array(props.maxGridExtent/10).keys()].map(idx =>
          <line x1='0' x2={props.maxGridExtent} y1={idx * 10} y2={idx * 10} key={`major-y-${idx * 10}`} />
        )}
      </g>

      { props.children }
    </g>
  );
};

export default MainGrid;
