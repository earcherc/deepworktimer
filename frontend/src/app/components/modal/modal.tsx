'use client';

import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CheckIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useModalContext } from '@/app/context/modal/modal-context';

const Modal = ({ children }: { children: React.ReactNode }) => {
  const { modalConfig, hideModal } = useModalContext();

  const modalTypeClasses = {
    success: {
      icon: <CheckIcon className="h-6 w-6 text-green-600" />,
      bgColor: 'bg-green-100',
    },
    danger: {
      icon: <XCircleIcon className="h-6 w-6 text-red-600" />,
      bgColor: 'bg-red-100',
    },
    warning: {
      icon: <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />,
      bgColor: 'bg-yellow-100',
    },
    default: {
      icon: null,
      bgColor: 'bg-gray-100',
    },
  };

  const { icon, bgColor } = modalConfig
    ? modalTypeClasses[modalConfig.type] || modalTypeClasses.default
    : modalTypeClasses.default;

  return (
    <Transition.Root show={!!modalConfig} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={hideModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${bgColor}`}>
                  {icon}
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    {modalConfig?.title}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{modalConfig?.message}</p>
                  </div>
                  {children}
                </div>
                {modalConfig && modalConfig.buttons && (
                  <div className="mt-5 sm:mt-6">
                    {modalConfig.buttons.map((button, index) => (
                      <button
                        key={index}
                        onClick={button.onClick}
                        className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm ${
                          button.isPrimary ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      >
                        {button.text}
                      </button>
                    ))}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
