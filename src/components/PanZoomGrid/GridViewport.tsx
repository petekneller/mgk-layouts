import React from 'react';
import styles from './GridViewport.module.css';

interface Props {
  children?: React.ReactNode,
  positioningStyle: string
};

const GridViewport = (props: Props) => {
  return (
    <svg
      viewBox='0 0 100 100'
      preserveAspectRatio='xMinYMax slice'
      className={ `${styles.viewport} ${styles[props.positioningStyle]}` } >
        { props.children }
    </svg>
  );
};

export default GridViewport;
