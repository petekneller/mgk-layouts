import React from 'react';
import styles from './SlideOut.module.css';

const SlideOut: React.FC = (props) => {
  // { box-sizing: border-box } changes the box model to include padding in the 100% sizing
  return (
    <div className={ styles.container }>
      <div className={ `${styles.item} ${styles.main}` }>
        { props.children }
      </div>
      <div>
        <div className={ `${styles.item} ${styles.handle}` }>
          <h1>2</h1>
        </div>
      </div>
      <div>
        <div className={ `${styles.item} ${styles.drawer}` }>
          <h1>3</h1>
        </div>
      </div>
    </div>
  );
}

export default SlideOut;
