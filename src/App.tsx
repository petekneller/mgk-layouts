import React from 'react';
import styles from './App.module.css';
import SlideOut from './components/SlideOut';
import PanZoomGrid from './components/PanZoomGrid';

const App: React.FC = () => {
  // { box-sizing: border-box } changes the box model to include padding in the 100% sizing
  return (
    <div id={ styles['root-container'] }>
      <header className={ styles['outer-margin'] }>
        <div id={ styles['title-block'] }>
          <h1>Motogymkhana</h1>
          <h2>Course Designer</h2>
        </div>
      </header>

      <div id={ styles['content-separator'] }></div>

      <div id={ styles['body-container'] } className={ styles['outer-margin'] }>
        <SlideOut>
          <PanZoomGrid></PanZoomGrid>
        </SlideOut>
      </div>
    </div>
  );
}

export default App;
