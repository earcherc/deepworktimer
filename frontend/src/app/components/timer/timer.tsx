'use client';

import React from 'react';
import { useTimer } from 'react-timer-hook';

const PomodoroTimer = () => {
  const workTimeInSeconds = 25 * 60;
  const breakTimeInSeconds = 5 * 60;

  const getExpiryTimestamp = (timeInSeconds: number) => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + timeInSeconds);
    return time;
  };

  const { seconds, minutes, isRunning, start, pause, restart } = useTimer({
    expiryTimestamp: getExpiryTimestamp(workTimeInSeconds),
    onExpire: () => console.warn('Timer finished'),
  });

  const startTimer = () => {
    restart(getExpiryTimestamp(workTimeInSeconds), true);
  };

  const startBreak = () => {
    restart(getExpiryTimestamp(breakTimeInSeconds), true);
  };

  const pauseTimer = () => {
    if (isRunning) {
      pause();
    }
  };

  const resetTimer = () => {
    restart(getExpiryTimestamp(workTimeInSeconds), false);
  };

  // Format the time left in mm:ss format
  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow sm:p-6">
      <div className="flex flex-col items-center">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{isRunning ? 'Focus Time' : 'Paused'}</h2>
        <p className="mb-8 text-5xl font-bold text-indigo-600">{formatTime(minutes, seconds)}</p>
        <div className="flex space-x-3">
          {!isRunning && (
            <button
              onClick={startTimer}
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Start Work
            </button>
          )}
          {isRunning && (
            <button
              onClick={pauseTimer}
              className="inline-flex items-center rounded-md bg-yellow-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
            >
              Pause
            </button>
          )}
          <button
            onClick={resetTimer}
            className="inline-flex items-center rounded-md bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Reset
          </button>
          <button
            onClick={startBreak}
            className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Start Break
          </button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
