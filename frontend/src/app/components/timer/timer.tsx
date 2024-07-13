'use client';

import {
  ApiError,
  DailyGoal,
  DailyGoalsService,
  StudyBlock,
  StudyBlocksService,
  StudyCategoriesService,
  StudyCategory,
} from '@api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect, useState } from 'react';
import useToast from '@app/context/toasts/toast-context';
import { differenceInSeconds, parseISO } from 'date-fns';
import { useTimer } from 'react-timer-hook';

const PomodoroTimer = () => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const { data: categoriesData } = useQuery({
    queryKey: ['studyCategories'],
    queryFn: () => StudyCategoriesService.readStudyCategoriesStudyCategoriesGet(),
  });
  const { data: dailyGoalsData } = useQuery({
    queryKey: ['dailyGoals'],
    queryFn: () => DailyGoalsService.readDailyGoalsDailyGoalsGet(),
  });
  const { data: studyBlocksData } = useQuery({
    queryKey: ['studyBlocks'],
    queryFn: () => StudyBlocksService.readStudyBlocksStudyBlocksGet(),
  });

  // Active data
  const activeCategory = categoriesData?.find((cat: StudyCategory) => cat.is_active);
  const activeDailyGoal = dailyGoalsData?.find((goal: DailyGoal) => goal.is_active);

  // State
  const [customDuration, setCustomDuration] = useState(0);
  const [studyBlockId, setStudyBlockId] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isCountDown, setIsCountDown] = useState(true);
  const [isEditingTime, setIsEditingTime] = useState(false);

  // Mutations
  const createStudyBlockMutation = useMutation({
    mutationFn: StudyBlocksService.createStudyBlockStudyBlocksPost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['studyBlocks'] });
      setStudyBlockId(data.id);
      addToast({ type: 'success', content: 'Study block created' });
    },
    onError: (error: unknown) => {
      let errorMessage = 'Failed to create study block';
      if (error instanceof ApiError) {
        errorMessage = error.body?.detail || errorMessage;
      }
      addToast({ type: 'error', content: errorMessage });
    },
  });

  const updateStudyBlockMutation = useMutation({
    mutationFn: ({ id, block }: { id: number; block: Partial<StudyBlock> }) =>
      StudyBlocksService.updateStudyBlockStudyBlocksStudyBlockIdPatch(id, block),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyBlocks'] });
      addToast({ type: 'success', content: 'Study block updated' });
    },
    onError: (error: unknown) => {
      let errorMessage = 'Failed to update study block';
      if (error instanceof ApiError) {
        errorMessage = error.body?.detail || errorMessage;
      }
      addToast({ type: 'error', content: errorMessage });
    },
  });

  // Timer setup
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + customDuration);

  const handleTimerExpiration = useCallback(async () => {
    if (studyBlockId) {
      updateStudyBlockMutation.mutate({ id: studyBlockId, block: { end: new Date().toISOString() } });
    }
    restart(expiryTimestamp, false);
    setIsActive(false);
    setStudyBlockId(null);
    addToast({ type: 'success', content: 'Session completed!' });
  }, [studyBlockId, expiryTimestamp]);

  const { seconds, minutes, hours, isRunning, start, restart } = useTimer({
    expiryTimestamp,
    onExpire: handleTimerExpiration,
    autoStart: false,
  });

  // Effects
  useEffect(() => {
    if (!isActive) {
      recoverIncompleteSession();
    }
  }, [studyBlocksData, isActive]);

  // Handlers
  const startWorkSession = useCallback(() => {
    if (activeDailyGoal && activeCategory) {
      createStudyBlockMutation.mutate({
        start: new Date().toISOString(),
        is_countdown: isCountDown,
        daily_goal_id: activeDailyGoal.id,
        study_category_id: activeCategory.id,
      });
      setIsActive(true);
      start();
    }
  }, [activeDailyGoal, activeCategory, isCountDown]);

  const stopTimer = useCallback(() => {
    if (studyBlockId) {
      updateStudyBlockMutation.mutate({ id: studyBlockId, block: { end: new Date().toISOString() } });
    }
    restart(expiryTimestamp, false);
    setIsActive(false);
    setStudyBlockId(null);
    addToast({ type: 'info', content: 'Session ended' });
  }, [studyBlockId, expiryTimestamp]);

  // Helper functions
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

  // Render
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
            onClick={() => isCountDown && !isRunning && setIsEditingTime(true)}
          >
            {isCountDown ? formatTime(hours, minutes, seconds) : formatTime(0, 0, seconds)}
          </p>
        )}
        <div className="flex space-x-3">
          <button
            onClick={() => setIsCountDown(!isCountDown)}
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Mode: {isCountDown ? 'Countdown' : 'Timer'}
          </button>
          {!isRunning && !studyBlockId && (
            <button
              onClick={startWorkSession}
              className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Start
            </button>
          )}
          {isRunning && (
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

export default PomodoroTimer;
