import React from 'react';
import { Modal, ModalProps } from 'antd';

const CustomModal = ({ ...props }: ModalProps) => {
  return <Modal {...props} footer={null} centered />;
};

export default CustomModal;
