import React from 'react';
import styles from './PanZoomGrid.module.css';
import GridViewport from './GridViewport';
import { LeftAxis, BottomAxis } from './Axes';
import MainGrid from './MainGrid';
import { gridToViewport } from './transformation';

const maxViewboxExtent = 100;
const maxCourseExtent = 1000;

const panCentre = { x: 30, y: 70 };
const zoomFactor = 0.8;

const [gridToViewportX, gridToViewportY,] = gridToViewport(maxCourseExtent);

const PanZoomGrid: React.FC = () => {
  return (
      <div className={ styles.container } >
        <div className={ `${styles.cell} ${styles['left-axis']}` } ></div>
        <div className={ `${styles.cell} ${styles['bottom-axis']}` } ></div>
        <div className={ `${styles.cell} ${styles.main}` } >
          <div className={ styles['grid-container'] }>

            <GridViewport styleName={ styles['viewport-left-axis'] } maxExtent={maxViewboxExtent}>
              <LeftAxis
                maxViewboxExtent={maxViewboxExtent}
                maxGridExtent={maxCourseExtent}
                panCentre={panCentre}
                zoomFactor={zoomFactor} />
            </GridViewport>

            <GridViewport styleName={ styles['viewport-bottom-axis'] } maxExtent={maxViewboxExtent}>
              <BottomAxis
                maxViewboxExtent={maxViewboxExtent}
                maxGridExtent={maxCourseExtent}
                panCentre={panCentre}
                zoomFactor={zoomFactor} />
            </GridViewport>

            <GridViewport styleName={ styles['viewport-main'] } maxExtent={maxViewboxExtent}>
              <MainGrid
                maxViewboxExtent={maxViewboxExtent}
                maxGridExtent={maxCourseExtent}
                panCentre={panCentre}
                zoomFactor={zoomFactor} >
                  <circle cx={ gridToViewportX(50) } cy={ gridToViewportY(50) } r='5' stroke='red' fill='blue'/>
              </MainGrid>
            </GridViewport>

         </div>
       </div>
      </div>
  );
}

export default PanZoomGrid;
