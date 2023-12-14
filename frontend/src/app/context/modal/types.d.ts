import React from 'react';

type ModalContent = React.ReactNode | null;

type ModalButtonType = {
  text: string;
  onClick: () => void;
  isPrimary?: boolean;
};

type ModalConfig = {
  type: 'success' | 'danger' | 'warning' | 'default';
  title: string;
  message: string;
  buttons: ModalButtonType[];
};

interface ModalContextValue {
  showModal: (config: ModalConfig) => void;
  hideModal: () => void;
  modalConfig: ModalConfig | undefined;
}
