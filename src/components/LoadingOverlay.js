import React from 'react';
import { Spin } from 'antd';

const LoadingOverlay = () => {
  return (
    <div 
      className='position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center' 
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 1050 }}
    >
      <Spin size='large' />
    </div>
  );
};

export default LoadingOverlay;
