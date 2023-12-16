import React from 'react';

type ModalContent = React.ReactNode;

type ModalButtonType = {
  text: string;
  onClick: () => void;
  isPrimary?: boolean;
};

type ModalConfig = {
  type: 'success' | 'danger' | 'warning' | 'default';
  title: string;
  message?: string;
  content?: ModalContent;
  buttons?: ModalButtonType[];
};

interface ModalContextValue {
  showModal: (config: ModalConfig) => void;
  hideModal: () => void;
  modalConfig: ModalConfig | undefined;
}
