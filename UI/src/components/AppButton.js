import { Button } from 'antd';
import React from 'react';
import '../App.css';

const AppButton = ({ label, icon, className='', ...props }) => {
  return (
    <Button
        icon={icon}
        className={className ? className : 'appButton'}
        {...props}
    >
        {label}
    </Button>
  )
}

export default AppButton;