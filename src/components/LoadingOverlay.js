import React from 'react';
import { Spin } from 'antd';
import './styles.css';

const LoadingOverlay = () => {
  return (
    <div className='loading-overlay' aria-live='assertive' aria-busy='true'>
      <Spin size='large' />
    </div>
  );
};

export default LoadingOverlay;
