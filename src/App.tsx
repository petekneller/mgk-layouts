import React from 'react';
import './App.css';

const App: React.FC = () => {
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
            <div style={{ position:'relative', height:'100%', width:'100%' }} >
              <h1 style={{ position: 'absolute' }}>1</h1>
            </div>
          </div>
          <div className='grid-item' style={{ gridColumn: '2', gridRow: '2' }}></div>
          <div className='grid-item' style={{ gridColumn: '2', gridRow: '1', position: 'relative',
                                             borderLeft: '2px solid black',
                                             borderBottom: '2px solid black' }}>
            <svg viewBox='0 0 100 100' preserveAspectRatio='xMinYMax slice' style={{ width:'100%', height:'100%', overflow:'hidden', position:'absolute', bottom:'0' }} >
              { [...Array(100).keys()].map(idx => <line y1='0' y2='100' x1={idx} x2={idx} style={{ stroke:'lightgray', strokeWidth:'0.2%' }} />) }
              { [...Array(100).keys()].map(idx => <line x1='0' x2='100' y1={idx} y2={idx} style={{ stroke:'lightgray', strokeWidth:'0.2%' }} />) }
              { [...Array(10).keys()].map(idx => <line y1='0' y2='100' x1={idx * 10} x2={idx * 10} style={{ stroke:'darkgray', strokeWidth:'0.2%' }} />) }
              { [...Array(10).keys()].map(idx => <line x1='0' x2='100' y1={idx * 10} y2={idx * 10} style={{ stroke:'darkgray', strokeWidth:'0.2%' }} />) }
            </svg>
            <svg viewBox='0 0 100 100' preserveAspectRatio='xMinYMax slice' style={{ width:'100%', height:'100%', overflow:'hidden', position:'absolute', bottom:'0', left:'-30px' }} >
              { [...Array(9).keys()].map(idx => <line x1='0' x2='2' y1={idx * 10 + 10} y2={idx * 10 + 10} style={{ stroke:'black', strokeWidth:'0.2%' }} />) }
            </svg>
            <svg viewBox='0 0 100 100' preserveAspectRatio='xMinYMax slice' style={{ width:'100%', height:'100%', overflow:'visible', position:'absolute', bottom:'-30px' }} >
              { [...Array(9).keys()].map(idx => <line y1='100' y2='98' x1={idx * 10 + 10} x2={idx * 10 + 10} style={{ stroke:'black', strokeWidth:'0.2%' }} />) }
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
