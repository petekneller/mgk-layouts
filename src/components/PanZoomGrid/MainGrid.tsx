import React from 'react';
import styles from './MainGrid.module.css';

interface Props {
  transformationFn: (panCentre: {x: number, y: number}, zoomFactor: number) => {x: number, y: number},
  maxGridExtent: number,
  panCentre: {x: number, y: number},
  zoomFactor: number,
  children?: React.ReactNode
}

const MainGrid = (props: Props) => {
  const transform = function(centre: {x: number, y: number}, zoomFactor: number): string {
    const {x, y} = props.transformationFn(centre, zoomFactor);
    return `translate(${x}, ${y}) scale(${zoomFactor})`
  };

  return (
    <g transform={ transform(props.panCentre, props.zoomFactor) }>

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
