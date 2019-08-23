import React from 'react';
import styles from './PanZoomGrid.module.css';
import GridViewport from './GridViewport';
import panTransform from './transformation';
import { LeftAxis, BottomAxis } from './Axes';
import MainGrid from './MainGrid';

const maxViewboxExtent = 100;
const maxCourseExtent = 1000;

const viewboxCentre = maxViewboxExtent / 2;

const gridTransformFn = panTransform({x: viewboxCentre, y: viewboxCentre});

const panCentre = { x: 70, y: 100 };
const zoomFactor = 0.8;

const PanZoomGrid: React.FC = () => {
  return (
      <div className={ styles.container } >
        <div className={ `${styles.cell} ${styles['left-axis']}` } ></div>
        <div className={ `${styles.cell} ${styles['bottom-axis']}` } ></div>
        <div className={ `${styles.cell} ${styles.main}` } >
          <div className={ styles['grid-container'] }>

            <GridViewport styleName={ styles['viewport-left-axis'] } maxExtent={maxViewboxExtent}>
              <LeftAxis
                transformationFn={ gridTransformFn }
                maxViewboxExtent={maxViewboxExtent}
                maxGridExtent={maxCourseExtent}
                panCentre={panCentre}
                zoomFactor={zoomFactor} />
            </GridViewport>

            <GridViewport styleName={ styles['viewport-bottom-axis'] } maxExtent={maxViewboxExtent}>
              <BottomAxis
                transformationFn={ gridTransformFn }
                maxViewboxExtent={maxViewboxExtent}
                maxGridExtent={maxCourseExtent}
                panCentre={panCentre}
                zoomFactor={zoomFactor} />
            </GridViewport>

            <GridViewport styleName={ styles['viewport-main'] } maxExtent={maxViewboxExtent}>
              <MainGrid
                transformationFn={ gridTransformFn }
                maxGridExtent={maxCourseExtent}
                panCentre={panCentre}
                zoomFactor={zoomFactor} >
                  <circle cx='50' cy='50' r='5' stroke='red' fill='blue'/>
              </MainGrid>
            </GridViewport>

         </div>
       </div>
      </div>
  );
}

export default PanZoomGrid;
