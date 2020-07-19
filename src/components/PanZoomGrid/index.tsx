import React, { useState, useRef } from 'react';
import styles from './PanZoomGrid.module.css';
import GridViewport from './GridViewport';
import { LeftAxis, BottomAxis } from './Axes';
import MainGrid from './MainGrid';
import { gridToViewport } from './transformation';

const maxViewboxExtent = 100;
const maxCourseExtent = 1000;

const [gridToViewportX, gridToViewportY,] = gridToViewport(maxCourseExtent);

const PanZoomGrid: React.FC = () => {
  // @ts-ignore
  // eslint-disable-next-line
  const [ panState, setPanState ] = useState({ pan: { x: 50, y: 50 }, zoomFactor: 1.0 } as { [key: string]: any });

  const ref = useRef(null);

  const initialisePan = (e) => {
    const [cursorX, cursorY] = [e.clientX, e.clientY];
    setPanState(prev => { return { ...prev, cursor: { x: cursorX, y: cursorY }}; });
    e.preventDefault();
  };

  const endPan = (e) => {
    setPanState(prev => { return { ...prev, cursor: undefined }; });
    e.preventDefault();
  };

  const handlePan = (e) => {
    if (panState.cursor !== undefined) {
      const { x: oldX, y: oldY } = panState.cursor;
      const currentX = e.clientX;
      const currentY = e.clientY;
      const deltaX = currentX - oldX;
      const deltaY = currentY - oldY;
      const clientSize = Math.max(ref.current.offsetHeight, ref.current.offsetWidth);
      const proportionalX = deltaX * (maxViewboxExtent / panState.zoomFactor) / clientSize;
      const proportionalY = deltaY * (maxViewboxExtent / panState.zoomFactor) / clientSize;
      setPanState(prev => {
        return {
          ...prev,
          cursor: { x: currentX, y: currentY },
          pan: { x: prev.pan.x - proportionalX, y: prev.pan.y + proportionalY }
        };
      });
      e.preventDefault();
    }
  };

  const handleMouseWheel = (e) => {
    if (e.deltaY < 0)
      setPanState(prev => { return {...prev, zoomFactor: 1.1 * prev.zoomFactor} });
    else
      setPanState(prev => { return {...prev, zoomFactor: 0.9 * prev.zoomFactor} });
  }

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
                zoomFactor={panState.zoomFactor} />
            </GridViewport>

            <GridViewport styleName={ styles['viewport-bottom-axis'] } maxExtent={maxViewboxExtent}>
              <BottomAxis
                maxViewboxExtent={maxViewboxExtent}
                maxGridExtent={maxCourseExtent}
                panCentre={panState.pan}
                zoomFactor={panState.zoomFactor} />
            </GridViewport>

            <GridViewport styleName={ styles['viewport-main'] } maxExtent={maxViewboxExtent}>
              <MainGrid
                maxViewboxExtent={maxViewboxExtent}
                maxGridExtent={maxCourseExtent}
                panCentre={panState.pan}
                zoomFactor={panState.zoomFactor}
                onPointerDown={initialisePan}
                onPointerUp={endPan}
                onPointerMove={handlePan}
                onWheel={handleMouseWheel}
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
