import { Modal } from 'antd';
import React from 'react';

const AppModal = ({ children, open, title = null, footer = false, width, height, onOk, onCancel, ...props }) => {
  return (
    <Modal
        {...props}
        open={open}
        title={title}
        onOk={onOk}
        bodyStyle={{ height: height }}
        style={{ borderRadius: '7px' }}
        footer={footer}
        destroyOnClose
        width={width}
        onCancel={onCancel}
      >
        {children}
    </Modal>
  )
}

export default AppModal;