import React, { useContext } from 'react';
import { ModalContext } from './modal-provider';

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};
