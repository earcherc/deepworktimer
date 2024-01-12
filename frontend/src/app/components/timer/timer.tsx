'use client';

import {
  useCreateStudyBlockMutation,
  useUpdateStudyBlockMutation,
  useUserStudyCategoriesQuery,
  useUserDailyGoalsQuery,
  useUserStudyBlocksQuery,
} from '@/graphql/graphql-types';
import useToast from '@/app/context/toasts/toast-context';
import React, { useEffect, useState } from 'react';
import { mapErrors } from '@/libs/error-map';
import { useTimer } from 'react-timer-hook';

const PomodoroTimer = () => {
  const { addToast } = useToast();
  const [{ data: categoriesData }] = useUserStudyCategoriesQuery();
  const [{ data: dailyGoalsData }] = useUserDailyGoalsQuery();
  const [{ data: studyBlocksData }] = useUserStudyBlocksQuery();

  const activeCategory = categoriesData?.userStudyCategories.find((cat) => cat.isActive);
  const activeDailyGoal = dailyGoalsData?.userDailyGoals.find((goal) => goal.isActive);

  const defaultWorkTimeInSeconds = (activeDailyGoal?.blockSize || 25) * 60;

  const [studyBlockId, setStudyBlockId] = useState<number | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);

  const [, createStudyBlock] = useCreateStudyBlockMutation();
  const [, updateStudyBlock] = useUpdateStudyBlockMutation();

  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + defaultWorkTimeInSeconds);

  const { seconds, minutes, hours, isRunning, start, pause, resume, restart } = useTimer({
    expiryTimestamp,
    onExpire: () => handleTimerExpiration(),
    autoStart: false,
  });

  // To recover timer after page refresh
  useEffect(() => {
    // Avoid resetting if timer is in progress
    if (!isActive) {
      const latestIncompleteBlock = studyBlocksData?.userStudyBlocks
        .filter((block) => !block.end)
        .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())[0];

      if (latestIncompleteBlock?.id) {
        setIsActive(true);
        setStudyBlockId(latestIncompleteBlock.id);
        // Calculate remaining time
        const startTimestamp = new Date(latestIncompleteBlock.start + 'Z').getTime();
        const nowTimestamp = Date.now();
        const elapsed = nowTimestamp - startTimestamp;
        const remainingTimeInSeconds = Math.max(0, defaultWorkTimeInSeconds - Math.floor(elapsed / 1000));
        const newExpiryTimestamp = new Date();
        newExpiryTimestamp.setSeconds(newExpiryTimestamp.getSeconds() + remainingTimeInSeconds);
        restart(newExpiryTimestamp, true);
      } else {
        // If no incomplete blocks, reset timer
        restart(expiryTimestamp, false);
      }
    }
  }, [studyBlocksData]);

  const handleTimerExpiration = async () => {
    if (studyBlockId) {
      await endStudyBlock();
    }
    restart(expiryTimestamp, false);
    setIsActive(false);
    setStudyBlockId(null);
  };

  const startWorkSession = () => {
    createNewStudyBlock();
    setIsActive(true);
    start();
  };

  const pauseTimer = async () => {
    if (isRunning) {
      if (studyBlockId) {
        await endStudyBlock();
      }
      pause();
    }
  };

  const resumeTimer = async () => {
    if (!isRunning) {
      await createNewStudyBlock();
      resume();
    }
  };

  const createNewStudyBlock = async () => {
    if (activeDailyGoal?.id && activeCategory?.id) {
      const { data, error } = await createStudyBlock({
        studyBlock: {
          start: new Date().toISOString(),
          isCountdown: true,
          dailyGoalId: activeDailyGoal.id,
          studyCategoryId: activeCategory.id,
        },
      });

      if (error) {
        const errorMap = mapErrors(error);
        Object.values(errorMap).forEach((errorMessage) => addToast({ type: 'error', content: errorMessage }));
      } else if (data?.createStudyBlock.id) {
        setStudyBlockId(data.createStudyBlock.id);
      }
    }
  };

  const endStudyBlock = async () => {
    if (studyBlockId) {
      const { error } = await updateStudyBlock({
        id: studyBlockId,
        studyBlock: { end: new Date().toISOString() },
      });

      if (error) {
        const errorMap = mapErrors(error);
        Object.values(errorMap).forEach((errorMessage) => addToast({ type: 'error', content: errorMessage }));
      }
    }
  };

  const stopTimer = async () => {
    if (studyBlockId) {
      endStudyBlock();
    }
    restart(expiryTimestamp, false);
    setIsActive(false);
    setStudyBlockId(null);
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow sm:p-6">
      <div className="flex flex-col items-center">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{isRunning ? 'Focus Time' : 'Paused'}</h2>
        <p className="mb-8 text-5xl font-bold text-indigo-600">
          <span>{hours.toString().padStart(2, '0')}</span>:<span>{minutes.toString().padStart(2, '0')}</span>:
          <span>{seconds.toString().padStart(2, '0')}</span>
        </p>
        <div className="flex space-x-3">
          {!isRunning && !studyBlockId && (
            <button
              onClick={startWorkSession}
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Start
            </button>
          )}
          {isRunning && (
            <button
              onClick={pauseTimer}
              className="inline-flex items-center rounded-md bg-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
            >
              Pause
            </button>
          )}
          {!isRunning && studyBlockId && (
            <button
              onClick={resumeTimer}
              className="inline-flex items-center rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            >
              Resume
            </button>
          )}
          {studyBlockId && (
            <button
              onClick={stopTimer}
              className="inline-flex items-center rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
            >
              End/Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
