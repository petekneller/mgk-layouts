import React from 'react';
import styles from './GridViewport.module.css';

interface Props {
  children?: React.ReactNode,
  styleName: string
  maxExtent: number
};

const GridViewport = (props: Props) => {
  return (
    <svg
      viewBox={ `0 0 ${props.maxExtent} ${props.maxExtent}` }
      preserveAspectRatio='xMinYMax slice'
      className={ `${styles.viewport} ${props.styleName}` } >
        { props.children }
    </svg>
  );
};

export default GridViewport;
