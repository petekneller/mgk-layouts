import React from 'react';
import styles from './Axes.module.css';

interface Props {
  transformationFn: (panCentre: {x: number, y: number}, zoomFactor: number) => {x: number, y: number},
  maxViewboxExtent: number,
  maxGridExtent: number,
  panCentre: {x: number, y: number},
  zoomFactor: number
}

const LeftAxis = (props: Props) => {
  const leftAxisTransform = function(centreY: number, zoomFactor: number): string {
    // @ts-ignore: unused args
    // eslint-disable-next-line
    const {x, y} = props.transformationFn({x: 0, y: centreY}, zoomFactor);
    return `translate(0, ${y})`;
  };

  return (
    <g transform={ leftAxisTransform(props.panCentre.y, props.zoomFactor) }>
      { [...Array(props.maxGridExtent/10 - 1).keys()].map(idx => {
        const i = idx + 1;
        const y = i * 10;
        const scaledY = y * props.zoomFactor;
        return <text x='0' y={ scaledY + 0.5 } className={styles['axis-text']} >{y.toString()}</text>;
      })}
    </g>
  );
};

const BottomAxis = (props: Props) => {
  const bottomAxisTransform = function(centreX: number, zoomFactor: number): string {
    // @ts-ignore: unused args
    // eslint-disable-next-line
    const {x, y} = props.transformationFn({x: centreX, y: 0}, zoomFactor);
    return `translate(${x}, 0)`;
  };

  return (
    <g transform={ bottomAxisTransform(props.panCentre.x, props.zoomFactor) }>
      { [...Array(props.maxGridExtent/10 - 1).keys()].map(idx => {
        const i = idx + 1;
        const x = i * 10;
        const scaledX = x * props.zoomFactor;
        return <text y={props.maxViewboxExtent} x={ scaledX - 1 } className={styles['axis-text']} >{x.toString()}</text>;
      })}
    </g>
  );
};

export {
  LeftAxis,
  BottomAxis
};
