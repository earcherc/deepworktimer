import { ArrowPathIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import React from 'react';

interface SessionCounterProps {
  target: number;
  completed: number;
  isActive: boolean;
  isDummy?: boolean;
  onReset?: () => void;
  onClick?: () => void;
}

const SessionCounter: React.FC<SessionCounterProps> = ({
  target,
  completed,
  isActive,
  isDummy = false,
  onReset,
  onClick,
}) => {
  const renderDots = () => {
    const totalDots = Math.max(target, completed + (isActive ? 1 : 0));
    const dots = [];
    for (let i = 0; i < totalDots; i++) {
      const dotClass = classNames('w-4 h-4 rounded-full transition-all duration-300 mb-1', {
        'bg-gray-300': i >= completed,
        'bg-blue-500': i < completed,
        'relative overflow-hidden': (i === completed && isActive) || (isDummy && i === 0 && isActive),
      });
      dots.push(
        <div key={i} className={dotClass}>
          {((i === completed && isActive) || (isDummy && i === 0 && isActive)) && (
            <div className="absolute inset-0 bg-blue-500" style={{ clipPath: 'inset(0 50% 0 0)' }}></div>
          )}
        </div>,
      );
    }
    return dots;
  };

  return (
    <div className="flex mt-2 mb-3 cursor-pointer relative group max-w-48" onClick={onClick}>
      <div className="flex space-x-4 transition-colors flex-wrap">{renderDots()}</div>
      {!isDummy && completed > 0 && (
        <button
          className="absolute -mt-px -right-10 top-1/2 transform -translate-y-1/2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-50 rounded-full p-1"
          onClick={(e) => {
            e.stopPropagation();
            onReset?.();
          }}
        >
          <ArrowPathIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default SessionCounter;
