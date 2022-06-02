import React from 'react';

import useWindowResize from '../../hooks/useWindowResize';
import './Banner.css';

interface PropTypes {
  title: string;
  placement?: 'top' | 'bottom';
}

const Banner: React.FC<PropTypes> = ({ title, placement = 'top' }) => {
  const windowSize = useWindowResize();

  return (<div className={`banner${placement === 'bottom' ? ' bottom' : ''}`}>
    <h1>{`${title}: ${windowSize.toUpperCase()}`}</h1>
  </div>);
};

export default Banner;
