import React from 'react';
import styles from './App.module.css';
import SlideOut from './components/SlideOut';
import PanZoomGrid from './components/PanZoomGrid';

const App: React.FC = () => {
  // { box-sizing: border-box } changes the box model to include padding in the 100% sizing
  return (
      <div className={ styles['outer-spacing'] }>
        <SlideOut>
          <PanZoomGrid></PanZoomGrid>
        </SlideOut>
      </div>
  );
}

export default App;
