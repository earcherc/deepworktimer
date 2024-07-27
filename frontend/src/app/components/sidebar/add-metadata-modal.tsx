'use client';

import { useModalContext } from '@context/modal/modal-context';
import React, { useState } from 'react';

type ComponentName = 'dailyGoal' | 'category';

type AddMetadataModalProps = {
  onAdd: (componentName: ComponentName) => void;
  availableComponents: ComponentName[];
};

const componentLabels: Record<ComponentName, string> = {
  dailyGoal: 'Daily Goal',
  category: 'Study Category',
};

const AddMetadataModal: React.FC<AddMetadataModalProps> = ({ onAdd, availableComponents }) => {
  const { hideModal } = useModalContext();
  const [selectedComponent, setSelectedComponent] = useState<ComponentName | null>(null);

  const handleAdd = () => {
    if (selectedComponent) {
      onAdd(selectedComponent);
      hideModal();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {availableComponents.map((componentName) => (
          <div key={componentName} className="flex items-center">
            <input
              type="radio"
              id={componentName}
              name="component"
              value={componentName}
              checked={selectedComponent === componentName}
              onChange={() => setSelectedComponent(componentName)}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={componentName} className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {componentLabels[componentName]}
            </label>
          </div>
        ))}
      </div>

      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        <button
          type="button"
          className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2"
          onClick={handleAdd}
          disabled={!selectedComponent}
        >
          Add
        </button>
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
          onClick={hideModal}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddMetadataModal;
