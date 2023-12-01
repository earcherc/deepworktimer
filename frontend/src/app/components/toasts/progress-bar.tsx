import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';

interface ProgressBarProps {
  isPaused: boolean;
  autoCloseDelay: number;
  progressColor: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ isPaused, autoCloseDelay, progressColor }) => {
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.style.animationDuration = `${autoCloseDelay}ms`;
      progressBarRef.current.style.animationPlayState = isPaused ? 'paused' : 'running';
    }
  }, [isPaused, autoCloseDelay]);

  const progressBarClasses = classNames(
    progressColor,
    'absolute bottom-0 left-0 h-1 w-full rounded-b-md animate-countdown',
  );

  return <div ref={progressBarRef} className={progressBarClasses} />;
};

export default ProgressBar;
