'use client';

import useToast from '@app/context/toasts/toast-context';
import React, { useEffect, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DefaultService, DailyGoal, StudyCategory, StudyBlock, StudyBlockUpdate } from '@api';
import { useTimer } from 'react-timer-hook';
import { parseISO, differenceInSeconds } from 'date-fns';

const PomodoroTimer = () => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const { data: categoriesData } = useQuery({ 
    queryKey: ['studyCategories'], 
    queryFn: DefaultService.readStudyCategoriesStudyCategoriesGet 
  });
  const { data: dailyGoalsData } = useQuery({ 
    queryKey: ['dailyGoals'], 
    queryFn: DefaultService.readDailyGoalsDailyGoalsGet 
  });
  const { data: studyBlocksData } = useQuery({ 
    queryKey: ['studyBlocks'], 
    queryFn: DefaultService.readStudyBlocksStudyBlocksGet 
  });

  // Active data
  const activeCategory = categoriesData?.find((cat: StudyCategory) => cat.is_active);
  const activeDailyGoal = dailyGoalsData?.find((goal: DailyGoal) => goal.is_active);
  const defaultWorkTimeInSeconds = (activeDailyGoal?.block_size || 25) * 60;

  // State
  const [customDuration, setCustomDuration] = useState(defaultWorkTimeInSeconds);
  const [studyBlockId, setStudyBlockId] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);

  // Mutations
  const createStudyBlockMutation = useMutation({
    mutationFn: DefaultService.createStudyBlockStudyBlocksPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['studyBlocks'] }),
  });

  const updateStudyBlockMutation = useMutation({
    mutationFn: ({ id, block }: { id: number, block: StudyBlockUpdate }) => 
      DefaultService.updateStudyBlockStudyBlocksStudyBlockIdPut(id, block),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['studyBlocks'] }),
  });

  // Timer setup
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + customDuration);

  const { 
    seconds, 
    minutes, 
    hours, 
    isRunning, 
    start, 
    pause, 
    resume, 
    restart 
  } = useTimer({
    expiryTimestamp,
    onExpire: handleTimerExpiration,
    autoStart: false,
  });

  // Effects
  useEffect(() => {
    setCustomDuration(defaultWorkTimeInSeconds);
  }, [defaultWorkTimeInSeconds]);

  useEffect(() => {
    if (!isActive) {
      recoverIncompleteSession();
    }
  }, [studyBlocksData, isActive]);

  // Handlers
  const handleTimerExpiration = useCallback(async () => {
    if (studyBlockId) {
      await endStudyBlock();
    }
    restart(expiryTimestamp, false);
    setIsActive(false);
    setStudyBlockId(null);
    addToast({ type: 'success', content: 'Pomodoro session completed!' });
  }, [studyBlockId, expiryTimestamp]);

  const startWorkSession = useCallback(() => {
    createNewStudyBlock();
    setIsActive(true);
    start();
  }, []);

  const pauseTimer = useCallback(async () => {
    if (isRunning && studyBlockId) {
      await endStudyBlock();
      pause();
      addToast({ type: 'info', content: 'Session paused' });
    }
  }, [isRunning, studyBlockId]);

  const resumeTimer = useCallback(async () => {
    if (!isRunning) {
      await createNewStudyBlock();
      resume();
      addToast({ type: 'info', content: 'Session resumed' });
    }
  }, [isRunning]);

  const stopTimer = useCallback(async () => {
    if (studyBlockId) {
      await endStudyBlock();
    }
    restart(expiryTimestamp, false);
    setIsActive(false);
    setStudyBlockId(null);
    addToast({ type: 'info', content: 'Session ended' });
  }, [studyBlockId, expiryTimestamp]);

  // Helper functions
  const createNewStudyBlock = async () => {
    if (activeDailyGoal?.id && activeCategory?.id) {
      try {
        const data = await createStudyBlockMutation.mutateAsync({
          user_id: 1, // TODO: Replace with actual user ID
          start: new Date().toISOString(),
          is_countdown: true,
          daily_goal_id: activeDailyGoal.id,
          study_category_id: activeCategory.id,
        });

        if (data?.id) {
          setStudyBlockId(data.id);
        }
      } catch (error) {
        addToast({ type: 'error', content: 'Failed to create study block' });
      }
    }
  };

const endStudyBlock = async () => {
  if (studyBlockId) {
    try {
      await updateStudyBlockMutation.mutateAsync({
        id: studyBlockId,
        block: { end: new Date().toISOString() }
      });
    } catch (error) {
      addToast({ type: 'error', content: 'Failed to end study block' });
    }
  }
};

  const recoverIncompleteSession = () => {
    const latestIncompleteBlock = studyBlocksData?.filter((block: StudyBlock) => !block.end)
      .sort((a: StudyBlock, b: StudyBlock) => new Date(b.start).getTime() - new Date(a.start).getTime())[0];

    if (latestIncompleteBlock?.id) {
      setIsActive(true);
      setStudyBlockId(latestIncompleteBlock.id);
      const startTimestamp = parseISO(latestIncompleteBlock.start).getTime();
      const nowTimestamp = Date.now();
      const elapsed = differenceInSeconds(nowTimestamp, startTimestamp);
      const remainingTimeInSeconds = Math.max(0, defaultWorkTimeInSeconds - elapsed);
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

  // Render
  return (
    <div className="rounded-lg bg-white p-4 shadow sm:p-6">
      <div className="flex flex-col items-center">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          {isRunning ? 'Focus Time' : 'Pomodoro Timer'}
        </h2>
        <p className="mb-8 text-5xl font-bold text-indigo-600">
          {`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
        </p>
        <div className="flex space-x-3">
          {!isRunning && !studyBlockId && (
            <>
              <input
                type="number"
                value={customDuration / 60}
                onChange={(e) => setCustomTimerDuration(parseInt(e.target.value, 10) * 60)}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                placeholder="Duration (minutes)"
              />
              <button
                onClick={startWorkSession}
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Start
              </button>
            </>
          )}
          {isRunning && (
            <button onClick={pauseTimer} className="timer-button bg-yellow-500 hover:bg-yellow-400">
              Pause
            </button>
          )}
          {!isRunning && studyBlockId && (
            <button onClick={resumeTimer} className="timer-button bg-green-500 hover:bg-green-400">
              Resume
            </button>
          )}
          {studyBlockId && (
            <button onClick={stopTimer} className="timer-button bg-red-500 hover:bg-red-400">
              End Session
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;