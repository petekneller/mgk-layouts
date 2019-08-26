import React from 'react';
import styles from './Axes.module.css';
import { gridToViewport } from './transformation';
const _ = require('lodash');

interface Props {
  maxViewboxExtent: number,
  maxGridExtent: number,
  panCentre: {x: number, y: number},
  zoomFactor: number
}

const LeftAxis = (props: Props) => {
  const [gridToViewportX, gridToViewportY,] = gridToViewport(props.maxGridExtent);

  const transformString = function(centreY: number, zoomFactor: number): string {
    const basicViewboxOffset = -1 * (props.maxGridExtent - props.maxViewboxExtent);
    const viewboxCentre = props.maxViewboxExtent / 2;
    const panOffset = (centreY * zoomFactor) - viewboxCentre;
    return `translate(0, ${basicViewboxOffset + panOffset})`;
  };

  return (
    <g transform={ transformString(props.panCentre.y, props.zoomFactor) }>
      { _.drop([...Array(props.maxGridExtent/10).keys()]).map((idx: number) => {
        const y = idx * 10;
        const scaledY = y * props.zoomFactor;
        return <text x={ gridToViewportX(0) } y={ gridToViewportY(scaledY - 0.5) } className={styles['axis-text']} key={`left-${y.toString()}`} >{y.toString()}</text>;
      })}
    </g>
  );
};

const BottomAxis = (props: Props) => {
  const [gridToViewportX,,] = gridToViewport(props.maxGridExtent);

  const transformString = function(centreX: number, zoomFactor: number): string {
    const viewboxCentre = props.maxViewboxExtent / 2;
    const panOffset = (centreX * zoomFactor) - viewboxCentre;
    return `translate(${-1 * panOffset}, ${0})`;
  };

  return (
    <g transform={ transformString(props.panCentre.x, props.zoomFactor) }>
      { _.drop([...Array(props.maxGridExtent/10 - 1).keys()]).map((idx: number) => {
        const x = idx * 10;
        const scaledX = x * props.zoomFactor;
        return <text y={ props.maxViewboxExtent } x={ gridToViewportX(scaledX - 1) } className={styles['axis-text']} key={`bottom-${x.toString()}`} >{x.toString()}</text>;
      })}
    </g>
  );
};

export {
  LeftAxis,
  BottomAxis
};
