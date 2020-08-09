import React from 'react';
import styles from './App.module.css';
import Drawer from './components/Drawer';
import PanZoomGrid from './components/PanZoomGrid';
import { IconButton } from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings';
import PrintIcon from '@material-ui/icons/Print';
import PrefsDialog from './components/PrefsDialog';
import PrintDialog from './components/PrintDialog';

const App: React.FC = () => {
  const [ prefsOpen, setPrefsOpen ] = React.useState(false);
  const [ printOpen, setPrintOpen ] = React.useState(false);

  return (
    <div id={ styles['root-container'] }>
      <header className={ styles['outer-margin'] }>
        <div id={ styles['title-block'] }>
          <h1>Motogymkhana</h1>
          <h2>Course Designer</h2>
        </div>
        <div id={ styles['title-right'] }>
          <IconButton onClick={ () => setPrintOpen(true) }>
            <PrintIcon fontSize="large"/>
          </IconButton>
          <PrintDialog open={printOpen} onClose={ () => setPrintOpen(false) }/>

          <IconButton onClick={ () => setPrefsOpen(true) }>
            <SettingsIcon fontSize="large" />
          </IconButton>
          <PrefsDialog open={prefsOpen} onClose={ () => setPrefsOpen(false) }/>
        </div>
      </header>

      <div id={ styles['content-separator'] }></div>

      <div id={ styles['body-container'] } className={ styles['outer-margin'] }>
        <Drawer
          mainContent={
            <PanZoomGrid></PanZoomGrid>
          }
          drawerContent={
            <h1 style={{ width: '200px' }}>Hello world</h1>
          }
        />
      </div>
    </div>
  );
}

export default App;
