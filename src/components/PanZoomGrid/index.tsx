import React from 'react';
import styles from './PanZoomGrid.module.css';
import GridViewport from './GridViewport';

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

            <GridViewport positioningStyle='viewport-main'>
              { [...Array(100).keys()].map(idx => <line y1='0' y2='100' x1={idx} x2={idx} style={{ stroke:'lightgray', strokeWidth:'0.2%' }} />) }
              { [...Array(100).keys()].map(idx => <line x1='0' x2='100' y1={idx} y2={idx} style={{ stroke:'lightgray', strokeWidth:'0.2%' }} />) }
              { [...Array(10).keys()].map(idx => <line y1='0' y2='100' x1={idx * 10} x2={idx * 10} style={{ stroke:'darkgray', strokeWidth:'0.2%' }} />) }
              { [...Array(10).keys()].map(idx => <line x1='0' x2='100' y1={idx * 10} y2={idx * 10} style={{ stroke:'darkgray', strokeWidth:'0.2%' }} />) }
            </GridViewport>

            <GridViewport positioningStyle='viewport-left-axis'>
              { [...Array(9).keys()].map(idx => <line x1='0' x2='2' y1={idx * 10 + 10} y2={idx * 10 + 10} style={{ stroke:'black', strokeWidth:'0.2%' }} />) }
            </GridViewport>

            <GridViewport positioningStyle='viewport-bottom-axis'>
              { [...Array(9).keys()].map(idx => <line y1='100' y2='98' x1={idx * 10 + 10} x2={idx * 10 + 10} style={{ stroke:'black', strokeWidth:'0.2%' }} />) }
            </GridViewport>

         </div>
       </div>
      </div>
  );
}

export default PanZoomGrid;
