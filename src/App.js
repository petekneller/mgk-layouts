import React from 'react';
import './App.css';

function App() {
  // { box-sizing: border-box } changes the box model to include padding in the 100% sizing
  return (
      <div style={{ height: '100%', padding: '10px', boxSizing: 'border-box', display: 'flex' }}>
      <div className='flex-item' style={{ flexGrow: 1 }}>
        <div style={{
          height: '100%',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '30px auto',
          gridTemplateRows: 'auto 30px'
        }}>
          <div className='grid-item' style={{ gridColumn: '1', gridRow: '1' }}>
            <h1>1</h1>
          </div>
          <div className='grid-item' style={{ gridColumn: '2', gridRow: '2' }}></div>
          <div className='grid-item' style={{ gridColumn: '2', gridRow: '1',
                                             borderLeft: '2px solid black',
                                             borderBottom: '2px solid black' }}>
            <svg style={{ width: '100%', height: '100%', overflow: 'hidden' }} viewbox='0 0 100 100'>
      { [...Array(10).keys()].map(idx => <line y1=0 y2=100 x1={idx * 10} x2={idx * 10} stroke='black'/>) }
            </svg>
         </div>
        </div>
      </div>
      <div>
        <div className='flex-item' style={{ width: '20px' }}>
          <h1>2</h1>
        </div>
      </div>
      <div>
        <div className='flex-item' style={{ width: '100px' }}>
          <h1>3</h1>
        </div>
      </div>
    </div>
  );
}

export default App;
