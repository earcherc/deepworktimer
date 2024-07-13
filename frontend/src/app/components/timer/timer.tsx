// timer.tsx
import { DailyGoal, StudyBlock, StudyBlockCreate, StudyBlockUpdate, StudyCategory } from '@api';
import React, { useCallback, useEffect, useState } from 'react';
import { differenceInSeconds, parseISO } from 'date-fns';
import { useTimer } from 'react-timer-hook';

interface TimerProps {
  activeCategory: StudyCategory | undefined;
  activeDailyGoal: DailyGoal | undefined;
  studyBlocksData: StudyBlock[] | undefined;
  createStudyBlock: (block: StudyBlockCreate) => Promise<StudyBlock>;
  updateStudyBlock: (params: { id: number; block: Partial<StudyBlockUpdate> }) => Promise<void>;
  addToast: (toast: { type: string; content: string }) => void;
}

const Timer: React.FC<TimerProps> = ({
  activeCategory,
  activeDailyGoal,
  studyBlocksData,
  createStudyBlock,
  updateStudyBlock,
  addToast,
}) => {
  const [customDuration, setCustomDuration] = useState(activeDailyGoal?.block_size || 0);
  const [studyBlockId, setStudyBlockId] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isCountDown, setIsCountDown] = useState(true);
  const [isEditingTime, setIsEditingTime] = useState(false);

  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + customDuration);

  const handleTimerExpiration = useCallback(async () => {
    if (studyBlockId) {
      await updateStudyBlock({ id: studyBlockId, block: { end: new Date().toISOString() } });
    }
    restart(expiryTimestamp, false);
    setIsActive(false);
    setStudyBlockId(null);
  }, [studyBlockId, expiryTimestamp, updateStudyBlock]);

  const { seconds, minutes, hours, isRunning, start, restart, pause } = useTimer({
    expiryTimestamp,
    onExpire: handleTimerExpiration,
    autoStart: false,
  });

  useEffect(() => {
    if (!isActive) {
      recoverIncompleteSession();
    }
  }, [studyBlocksData, isActive]);

  const startWorkSession = useCallback(async () => {
    if (activeDailyGoal && activeCategory) {
      const newBlock = await createStudyBlock({
        start: new Date().toISOString(),
        is_countdown: isCountDown,
        daily_goal_id: activeDailyGoal.id,
        study_category_id: activeCategory.id,
      });
      setStudyBlockId(newBlock.id);
      setIsActive(true);
      const newExpiryTimestamp = new Date();
      newExpiryTimestamp.setSeconds(newExpiryTimestamp.getSeconds() + (isCountDown ? customDuration : 0));
      restart(newExpiryTimestamp, true);
    }
  }, [activeDailyGoal, activeCategory, isCountDown, createStudyBlock, customDuration, restart]);

  const stopTimer = useCallback(async () => {
    if (studyBlockId) {
      await updateStudyBlock({ id: studyBlockId, block: { end: new Date().toISOString() } });
    }
    pause();
    setIsActive(false);
    setStudyBlockId(null);

    if (isCountDown) {
      restart(expiryTimestamp, false);
    } else {
      const newExpiryTimestamp = new Date();
      newExpiryTimestamp.setSeconds(newExpiryTimestamp.getSeconds());
      restart(newExpiryTimestamp, false);
    }
  }, [studyBlockId, expiryTimestamp, updateStudyBlock, isCountDown, pause, restart]);

  const recoverIncompleteSession = () => {
    const latestIncompleteBlock = studyBlocksData
      ?.filter((block: StudyBlock) => !block.end)
      .sort((a: StudyBlock, b: StudyBlock) => new Date(b.start).getTime() - new Date(a.start).getTime())[0];

    if (latestIncompleteBlock?.id) {
      setIsActive(true);
      setStudyBlockId(latestIncompleteBlock.id);
      setIsCountDown(latestIncompleteBlock.is_countdown ?? true);
      const startTimestamp = parseISO(latestIncompleteBlock.start).getTime();
      const nowTimestamp = Date.now();
      const elapsed = differenceInSeconds(nowTimestamp, startTimestamp);
      const remainingTimeInSeconds = isCountDown ? Math.max(0, customDuration - elapsed) : elapsed;
      const newExpiryTimestamp = new Date();
      newExpiryTimestamp.setSeconds(newExpiryTimestamp.getSeconds() + remainingTimeInSeconds);
      restart(newExpiryTimestamp, true);
    } else {
      restart(expiryTimestamp, false);
    }
  };

  const setCustomTimerDuration = (durationInSeconds: number) => {
    setCustomDuration(durationInSeconds);
    const newExpiryTimestamp = new Date();
    newExpiryTimestamp.setSeconds(newExpiryTimestamp.getSeconds() + durationInSeconds);
    restart(newExpiryTimestamp, false);
  };

  const handleTimeClick = () => {
    if (!isRunning) {
      setIsEditingTime(true);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [h, m, s] = e.target.value.split(':').map(Number);
    const totalSeconds = h * 3600 + m * 60 + s;
    if (totalSeconds <= 32400) {
      // 9 hours in seconds
      setCustomTimerDuration(totalSeconds);
    }
  };

  const handleTimeBlur = () => {
    setIsEditingTime(false);
  };

  const formatTime = (h: number, m: number, s: number) => {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow sm:p-6">
      <div className="flex flex-col items-center">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{isCountDown ? 'Countdown' : 'Timer'}</h2>
        {isCountDown && isEditingTime ? (
          <input
            type="text"
            value={formatTime(hours, minutes, seconds)}
            onChange={handleTimeChange}
            onBlur={handleTimeBlur}
            className="mb-8 text-5xl font-bold text-indigo-600 bg-transparent border-b border-indigo-600 focus:outline-none"
            autoFocus
          />
        ) : (
          <p
            className={`mb-8 text-5xl font-bold text-indigo-600 ${isCountDown && !isRunning ? 'cursor-pointer' : ''}`}
            onClick={handleTimeClick}
          >
            {isCountDown ? formatTime(hours, minutes, seconds) : formatTime(hours, minutes, seconds)}
          </p>
        )}
        <div className="flex space-x-3">
          {!isActive && (
            <button
              onClick={() => setIsCountDown(!isCountDown)}
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Mode: {isCountDown ? 'Countdown' : 'Timer'}
            </button>
          )}
          {!isRunning && !studyBlockId && (
            <button
              onClick={startWorkSession}
              className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Start
            </button>
          )}
          {isActive && (
            <button
              onClick={stopTimer}
              className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Stop
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timer;
