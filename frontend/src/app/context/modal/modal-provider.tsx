import React, { ReactNode, createContext, useState } from 'react';
import ModalComponent from '@/app/components/modal/modal';
import { ModalConfig, ModalContextValue } from './types';

export const ModalContext = createContext<ModalContextValue | undefined>(undefined);
ModalContext.displayName = 'ModalContext';

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig | undefined>(undefined);

  const showModal = (config: ModalConfig) => {
    setModalConfig(config);
    setIsOpened(true);
  };

  const hideModal = () => {
    setIsOpened(false);
    setModalConfig(undefined);
  };

  const value = { isOpened, modalConfig, showModal, hideModal };

  return (
    <ModalContext.Provider value={value}>
      {isOpened && <ModalComponent />}
      {children}
    </ModalContext.Provider>
  );
};
