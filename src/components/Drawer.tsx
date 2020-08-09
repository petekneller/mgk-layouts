import React from 'react';
import { Drawer as MuiDrawer } from '@material-ui/core'
import { Hidden } from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import styles from './Drawer.module.css';

interface Props {
  mainContent: React.ReactNode,
  drawerContent: React.ReactNode
}

const Drawer = (props: Props) => {

  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(open => !open)

  return (
    <div id={ styles.container }>
      <div id={ styles.main }>
        { props.mainContent }
      </div>
      <div id={ styles.handle } className={ styles.item }>
        <button onClick={ handleClose }>
          { open ? <ChevronRightIcon fontSize="small"/> : <ChevronLeftIcon fontSize="small"/> }
        </button>
      </div>
      <Hidden mdDown>
        <div className={ `${styles.item} ${open ? styles.shown : styles.hidden}` }>
          { props.drawerContent }
        </div>
      </Hidden>
      <Hidden lgUp>
        <MuiDrawer
          variant="temporary"
          anchor="right"
          open={open}
          onClose={ handleClose }
        >
          { props.drawerContent }
        </MuiDrawer>
      </Hidden>
    </div>
  );
}

export default Drawer;
