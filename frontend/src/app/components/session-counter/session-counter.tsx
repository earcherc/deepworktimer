// session-counter.tsx
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
    const dots = [];
    for (let i = 0; i < target; i++) {
      const dotClass = classNames('w-4 h-4 rounded-full transition-all duration-300', {
        'bg-gray-300': i > completed,
        'bg-indigo-500': i < completed,
        'bg-indigo-500': i === completed && !isActive,
        'relative overflow-hidden': i === completed && isActive,
      });
      dots.push(
        <div key={i} className={dotClass}>
          {i === completed && isActive && (
            <div className="absolute inset-0 bg-indigo-500" style={{ clipPath: 'inset(0 50% 0 0)' }}></div>
          )}
        </div>,
      );
    }
    return dots;
  };

  return (
    <div className="flex space-x-2 mt-4 mb-6 cursor-pointer relative group" onClick={onClick}>
      {renderDots()}
      {!isDummy && (
        <button
          className="absolute -right-6 top-1/2 transform -translate-y-1/2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={(e) => {
            e.stopPropagation();
            onReset?.();
          }}
        >
          ↺
        </button>
      )}
    </div>
  );
};

export default SessionCounter;
