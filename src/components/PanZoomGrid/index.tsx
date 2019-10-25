import React, { useState, useRef } from 'react';
import styles from './PanZoomGrid.module.css';
import GridViewport from './GridViewport';
import { LeftAxis, BottomAxis } from './Axes';
import MainGrid from './MainGrid';
import { gridToViewport } from './transformation';

const maxViewboxExtent = 100;
const maxCourseExtent = 1000;

const zoomFactor = 1.0;

const [gridToViewportX, gridToViewportY,] = gridToViewport(maxCourseExtent);

const PanZoomGrid: React.FC = () => {
  // @ts-ignore
  // eslint-disable-next-line
  const [ panState, setPanState ] = useState({ pan: { x: 50, y: 50 } } as { [key: string]: any });

  const ref = useRef(null);

  const initialisePan = (e) => {
    const [cursorX, cursorY] = [e.clientX, e.clientY];
    console.log('pan init', cursorX, cursorY);
    setPanState(prev => { return { ...prev, cursor: { x: cursorX, y: cursorY }}; });
    e.preventDefault();
  };

  const endPan = (e) => {
    setPanState(prev => { return { ...prev, cursor: undefined }; });
    console.log('pan out');
    e.preventDefault();
  };

  const handlePan = (e) => {
    if (panState.cursor !== undefined) {
      //console.log(ref.current);
      const { x: oldX, y: oldY } = panState.cursor;
      const currentX = e.clientX;
      const currentY = e.clientY;
      const deltaX = currentX - oldX;
      const deltaY = currentY - oldY;
      const clientSize = Math.max(ref.current.offsetHeight, ref.current.offsetWidth);
      const proportionalX = deltaX * (maxViewboxExtent / zoomFactor) / clientSize;
      const proportionalY = deltaY * (maxViewboxExtent / zoomFactor) / clientSize;
      setPanState(prev => {
        return {
          ...prev,
          cursor: { x: currentX, y: currentY },
          pan: { x: prev.pan.x - proportionalX, y: prev.pan.y + proportionalY }
        };
      });
    }
  };

  return (
      <div className={ styles.container } >
        <div className={ `${styles.cell} ${styles['left-axis']}` } ></div>
        <div className={ `${styles.cell} ${styles['bottom-axis']}` } ></div>
        <div className={ `${styles.cell} ${styles.main}` } >
          <div className={ styles['grid-container'] } ref={ref}>

            <GridViewport styleName={ styles['viewport-left-axis'] } maxExtent={maxViewboxExtent}>
              <LeftAxis
                maxViewboxExtent={maxViewboxExtent}
                maxGridExtent={maxCourseExtent}
                panCentre={panState.pan}
                zoomFactor={zoomFactor} />
            </GridViewport>

            <GridViewport styleName={ styles['viewport-bottom-axis'] } maxExtent={maxViewboxExtent}>
              <BottomAxis
                maxViewboxExtent={maxViewboxExtent}
                maxGridExtent={maxCourseExtent}
                panCentre={panState.pan}
                zoomFactor={zoomFactor} />
            </GridViewport>

            <GridViewport styleName={ styles['viewport-main'] } maxExtent={maxViewboxExtent}>
              <MainGrid
                maxViewboxExtent={maxViewboxExtent}
                maxGridExtent={maxCourseExtent}
                panCentre={panState.pan}
                zoomFactor={zoomFactor}
                onPointerDown={initialisePan}
                onPointerUp={endPan}
                onPointerMove={handlePan}
              >
                  <circle cx={ gridToViewportX(50) } cy={ gridToViewportY(50) } r='5' stroke='red' fill='blue'/>
              </MainGrid>
            </GridViewport>

         </div>
       </div>
      </div>
  );
}

export default PanZoomGrid;
