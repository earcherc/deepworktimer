import { ComponentName, visibleComponentsAtom } from '../../store/atoms';
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid';
import { useModalContext } from '@context/modal/modal-context';
import { useAtom } from 'jotai';
import React from 'react';

type ManageMetadataModalProps = {
  onAdd: (componentName: ComponentName) => void;
  onRemove: (componentName: ComponentName) => void;
  availableComponents: ComponentName[];
};

const componentLabels: Record<ComponentName, string> = {
  dailyGoal: 'Daily Goal',
  category: 'Study Category',
};

const ManageMetadataModal: React.FC<ManageMetadataModalProps> = ({ onAdd, onRemove, availableComponents }) => {
  const { hideModal } = useModalContext();
  const [visibleComponents] = useAtom(visibleComponentsAtom);

  const handleToggle = (componentName: ComponentName) => {
    if (visibleComponents.includes(componentName)) {
      onRemove(componentName);
    } else {
      onAdd(componentName);
    }
  };

  return (
    <div className="space-y-4">
      {availableComponents.map((componentName) => {
        const isVisible = visibleComponents.includes(componentName);
        return (
          <div
            key={componentName}
            className={`flex items-center justify-between p-3 mb-2 rounded-lg cursor-pointer transition-colors duration-200 ${
              isVisible ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleToggle(componentName)}
          >
            <span>{componentLabels[componentName]}</span>
            {isVisible ? <MinusIcon className="h-5 w-5 text-white" /> : <PlusIcon className="h-5 w-5 text-gray-500" />}
          </div>
        );
      })}
      <button
        onClick={hideModal}
        className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200"
      >
        Close
      </button>
    </div>
  );
};

export default ManageMetadataModal;
