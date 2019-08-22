import React from 'react';
import styles from './PanZoomGrid.module.css';
import GridViewport from './GridViewport';

const maxViewboxExtent = 100;
const maxExtent = 1000;

const viewboxCentre = maxViewboxExtent / 2;

const zoomPanTransform = function(centre: {x: number, y: number}, zoom: number): string {
  const {x, y} = centre;
  const scaledX = x * zoom;
  const scaledY = y * zoom;
  const translateX = scaledX - viewboxCentre;
  const translateY = scaledY - viewboxCentre;
  return `translate(${-1 * translateX}, ${-1 * translateY}) scale(${zoom})`
};

const panXTransform = function(centreX: number, zoom: number): string {
  const scaledX = centreX * zoom;
  const translateX = scaledX - viewboxCentre;
  return `translate(${-1 * translateX}, 0)`;
};

const panYTransform = function(centreY: number, zoom: number): string {
  const scaledY = centreY * zoom;
  const translateY = scaledY - viewboxCentre;
  return `translate(0, ${-1 * translateY})`;
};

const panCentre = { x: 70, y: 100 };
const zoomFactor = 0.8;

const PanZoomGrid: React.FC = () => {
  return (
      <div className={ styles.container } >
        <div className={ `${styles.cell} ${styles['left-axis']}` } >
          <div style={{ position:'relative', height:'100%', width:'100%' }} >
            <h1 style={{ position: 'absolute' }}>1</h1>
          </div>
        </div>
        <div className={ `${styles.cell} ${styles['bottom-axis']}` } ></div>
        <div className={ `${styles.cell} ${styles.main}` } >
          <div className={ styles['grid-container'] }>

            <GridViewport positioningStyle='viewport-main' maxExtent={maxViewboxExtent}>
              <g transform={ zoomPanTransform(panCentre, zoomFactor) }>
                { [...Array(maxExtent).keys()].map(idx => <line y1='0' y2={maxExtent} x1={idx} x2={idx} style={{ stroke:'lightgray', strokeWidth:'0.2%' }} />) }
                { [...Array(maxExtent).keys()].map(idx => <line x1='0' x2={maxExtent} y1={idx} y2={idx} style={{ stroke:'lightgray', strokeWidth:'0.2%' }} />) }
                { [...Array(maxExtent/10).keys()].map(idx => <line y1='0' y2={maxExtent} x1={idx * 10} x2={idx * 10} style={{ stroke:'darkgray', strokeWidth:'0.2%' }} />) }
                { [...Array(maxExtent/10).keys()].map(idx => <line x1='0' x2={maxExtent} y1={idx * 10} y2={idx * 10} style={{ stroke:'darkgray', strokeWidth:'0.2%' }} />) }
                <circle cx='50' cy='50' r='5' stroke='red' fill='blue'/>
              </g>
            </GridViewport>

            <GridViewport positioningStyle='viewport-left-axis' maxExtent={maxViewboxExtent}>
              <g transform={ panYTransform(panCentre.y, zoomFactor) }>
                { [...Array(maxExtent/10 - 1).keys()].map(idx => {
                  const i = idx + 1;
                  const y = i * 10;
                  const scaledY = y * zoomFactor;
                  return <text x='0' y={ scaledY + 0.5 } className={styles['axis-text']} >{y.toString()}</text>;
                })}
              </g>
            </GridViewport>

            <GridViewport positioningStyle='viewport-bottom-axis' maxExtent={maxViewboxExtent}>
              <g transform={ panXTransform(panCentre.x, zoomFactor) }>
                { [...Array(maxExtent/10 - 1).keys()].map(idx => {
                  const i = idx + 1;
                  const x = i * 10;
                  const scaledX = x * zoomFactor;
                  return <text y={100} x={ scaledX - 1} className={styles['axis-text']} >{x.toString()}</text>;
                })}
              </g>
            </GridViewport>

         </div>
       </div>
      </div>
  );
}

export default PanZoomGrid;
