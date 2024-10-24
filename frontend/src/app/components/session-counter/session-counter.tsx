import { ArrowPathIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { type FC } from 'react';

interface SessionCounterProps {
  target: number;
  completed: number;
  isActive: boolean;
  onReset: () => void;
  onClick: () => void;
}

const SessionCounter: FC<SessionCounterProps> = ({ target, completed, isActive, onReset, onClick }) => {
  return (
    <div className="flex mt-2 mb-3 cursor-pointer relative group max-w-48" onClick={onClick}>
      <div className="flex space-x-4 transition-colors flex-wrap">
        {[...Array(target)].map((val, i) => (
          <div
            key={val + i}
            className={classNames('w-4 h-4 rounded-full mb-1', {
              'bg-gray-300': i >= completed && !(i === completed && isActive),
              'bg-blue-500': i < completed,
              'relative overflow-hidden bg-gray-300': i === completed && isActive,
            })}
          >
            {i === completed && isActive && (
              <div className="absolute inset-0 bg-blue-500" style={{ clipPath: 'inset(0 50% 0 0)' }} />
            )}
          </div>
        ))}
      </div>
      {completed > 0 && (
        <button
          className="absolute -mt-px -right-10 top-1/2 transform -translate-y-1/2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-50 rounded-full p-1"
          onClick={(e) => {
            e.stopPropagation();
            onReset();
          }}
        >
          <ArrowPathIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default SessionCounter;
