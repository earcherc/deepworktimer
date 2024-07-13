import {
  ApiError,
  DailyGoal,
  DailyGoalsService,
  StudyBlock,
  StudyBlocksService,
  StudyBlockUpdate,
  StudyCategoriesService,
  StudyCategory,
} from '@api';
import useToast from '@app/context/toasts/toast-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getTodayDateRange } from '../../../utils/dateUtils';

const Timer: React.FC = () => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const [time, setTime] = useState(() => 0);
  const [isActive, setIsActive] = useState(false);
  const [isCountDown, setIsCountDown] = useState(true);
  const [studyBlockId, setStudyBlockId] = useState<number | null>(null);

  const initialCheckPerformed = useRef(false);
  const timerStartTime = useRef<number | null>(null);
  const serverClientTimeDiff = useRef<number | null>(null);

  const { data: categoriesData } = useQuery<StudyCategory[]>({
    queryKey: ['studyCategories'],
    queryFn: () => StudyCategoriesService.readStudyCategoriesStudyCategoriesGet(),
  });

  const { data: dailyGoalsData } = useQuery<DailyGoal[]>({
    queryKey: ['dailyGoals'],
    queryFn: () => DailyGoalsService.readDailyGoalsDailyGoalsGet(),
  });

  const dateRange = getTodayDateRange();

  const { data: studyBlocksData } = useQuery<StudyBlock[]>({
    queryKey: ['studyBlocks', dateRange.start_time, dateRange.end_time],
    queryFn: () => StudyBlocksService.queryStudyBlocksStudyBlocksQueryPost(dateRange),
  });

  const activeCategory = categoriesData?.find((cat) => cat.is_active);
  const activeDailyGoal = dailyGoalsData?.find((goal) => goal.is_active);

  const createStudyBlockMutation = useMutation({
    mutationFn: StudyBlocksService.createStudyBlockStudyBlocksPost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['studyBlocks'] });
      console.log('Study block created:', data);
      return data;
    },
    onError: (error: unknown) => {
      let errorMessage = 'Failed to create study block';
      if (error instanceof ApiError) {
        errorMessage = error.body?.detail || errorMessage;
      }
      addToast({ type: 'error', content: errorMessage });
      console.error('Error creating study block:', errorMessage);
    },
  });

  const updateStudyBlockMutation = useMutation({
    mutationFn: ({ id, block }: { id: number; block: StudyBlockUpdate }) =>
      StudyBlocksService.updateStudyBlockStudyBlocksStudyBlockIdPatch(id, block),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyBlocks'] });
      console.log('Study block updated');
    },
    onError: (error: unknown) => {
      let errorMessage = 'Failed to update study block';
      if (error instanceof ApiError) {
        errorMessage = error.body?.detail || errorMessage;
      }
      addToast({ type: 'error', content: errorMessage });
      console.error('Error updating study block:', errorMessage);
    },
  });

  const getInitialTime = useCallback(() => {
    return (activeDailyGoal?.block_size || 0) * 60; // Convert minutes to seconds
  }, [activeDailyGoal]);

  const getAdjustedNow = useCallback(() => {
    return Date.now() + (serverClientTimeDiff.current || 0);
  }, []);

  useEffect(() => {
    if (!initialCheckPerformed.current && studyBlocksData && studyBlocksData.length > 0 && activeDailyGoal) {
      console.log('Performing initial check');
      const latestBlock = studyBlocksData[0];
      console.log('Latest block:', latestBlock);

      if (!latestBlock.end) {
        console.log('Active block found');
        setIsActive(true);
        if (latestBlock.is_countdown !== undefined) setIsCountDown(latestBlock.is_countdown);
        setStudyBlockId(latestBlock.id);

        const startTime = new Date(latestBlock.start).getTime();
        const clientNow = Date.now();
        const serverNow = new Date(latestBlock.start).getTime();
        serverClientTimeDiff.current = serverNow - clientNow;

        const adjustedNow = getAdjustedNow();
        const elapsedMilliseconds = adjustedNow - startTime;
        timerStartTime.current = startTime;

        console.log('Start time:', new Date(startTime).toUTCString());
        console.log('Adjusted current time:', new Date(adjustedNow).toUTCString());
        console.log('Elapsed milliseconds:', elapsedMilliseconds);

        if (latestBlock.is_countdown) {
          console.log('Countdown mode');
          const initialTime = activeDailyGoal.block_size * 60 * 1000;
          const remainingTime = Math.max(initialTime - elapsedMilliseconds, 0);
          setTime(Math.floor(remainingTime / 1000));
          console.log('Initial time:', initialTime);
          console.log('Remaining time:', remainingTime);
        } else {
          console.log('Stopwatch mode');
          setTime(Math.floor(elapsedMilliseconds / 1000));
        }
      } else {
        console.log('No active block found');
        setTime(getInitialTime());
      }

      initialCheckPerformed.current = true;
    }
  }, [studyBlocksData, activeDailyGoal, getInitialTime, getAdjustedNow]);

  useEffect(() => {
    console.log('Timer effect triggered');
    console.log('isActive:', isActive);
    console.log('isCountDown:', isCountDown);
    console.log('timerStartTime:', timerStartTime.current);

    let interval: NodeJS.Timeout | null = null;
    if (isActive && timerStartTime.current) {
      interval = setInterval(() => {
        const adjustedNow = getAdjustedNow();
        const elapsedMilliseconds = adjustedNow - timerStartTime.current!;
        console.log('Adjusted current time:', new Date(adjustedNow).toUTCString());
        console.log('Elapsed milliseconds:', elapsedMilliseconds);

        if (isCountDown) {
          const initialTime = getInitialTime() * 1000;
          const remainingTime = Math.max(initialTime - elapsedMilliseconds, 0);
          setTime(Math.floor(remainingTime / 1000));
          console.log('Countdown - Remaining time:', remainingTime);
          if (remainingTime <= 0) {
            clearInterval(interval!);
            handleTimerExpiration();
          }
        } else {
          setTime(Math.floor(elapsedMilliseconds / 1000));
          console.log('Stopwatch - Elapsed time:', elapsedMilliseconds);
        }
      }, 1000);
    }
    return () => {
      if (interval) {
        console.log('Clearing interval');
        clearInterval(interval);
      }
    };
  }, [isActive, isCountDown, getInitialTime, getAdjustedNow]);

  const handleTimerExpiration = useCallback(async () => {
    console.log('Timer expired');
    if (studyBlockId) {
      await updateStudyBlockMutation.mutateAsync({
        id: studyBlockId,
        block: { end: new Date(getAdjustedNow()).toISOString() },
      });
    }
    setIsActive(false);
    setStudyBlockId(null);
  }, [studyBlockId, updateStudyBlockMutation, getAdjustedNow]);

  const startTimer = async () => {
    console.log('Starting timer');
    if (activeCategory && activeDailyGoal) {
      const now = getAdjustedNow();
      timerStartTime.current = now;
      const newBlock = await createStudyBlockMutation.mutateAsync({
        start: new Date(now).toISOString(),
        is_countdown: isCountDown,
        daily_goal_id: activeDailyGoal.id,
        study_category_id: activeCategory.id,
      });
      setStudyBlockId(newBlock.id);
      setIsActive(true);
      setTime(isCountDown ? getInitialTime() : 0);
      console.log('New block created:', newBlock);
    }
  };

  const stopTimer = async () => {
    console.log('Stopping timer');
    if (studyBlockId) {
      await updateStudyBlockMutation.mutateAsync({
        id: studyBlockId,
        block: { end: new Date(getAdjustedNow()).toISOString() },
      });
    }
    setIsActive(false);
    setStudyBlockId(null);
    setTime(isCountDown ? getInitialTime() : 0);
  };

  const toggleMode = () => {
    console.log('Toggling mode');
    setIsCountDown(!isCountDown);
    setTime(isCountDown ? 0 : getInitialTime());
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  console.log('Render - Current state:', { time, isActive, isCountDown, studyBlockId });

  return (
    <div className="rounded-lg bg-white p-4 shadow sm:p-6">
      <div className="flex flex-col items-center">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{isCountDown ? 'Timer' : 'Stopwatch'}</h2>
        <p className="mb-8 text-5xl font-bold text-indigo-600">{formatTime(time)}</p>
        <div className="flex space-x-3">
          {!isActive && (
            <button
              onClick={toggleMode}
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isCountDown ? 'Switch to Stopwatch' : 'Switch to Timer'}
            </button>
          )}
          <button
            onClick={isActive ? stopTimer : startTimer}
            className={`rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isActive
                ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
                : 'bg-indigo-600 hover:bg-indigo-500 focus:ring-indigo-500'
            }`}
          >
            {isActive ? 'Stop' : 'Start'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timer;