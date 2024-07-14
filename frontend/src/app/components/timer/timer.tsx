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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCurrentUTC, getTodayDateRange } from '../../../utils/dateUtils';
import useToast from '@app/context/toasts/toast-context';
import { useEffect, useRef, useState } from 'react';

const Timer = () => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isCountDown, setIsCountDown] = useState<boolean | null>(null);
  const [studyBlockId, setStudyBlockId] = useState<number | null>(null);

  const initialCheckPerformed = useRef(false);

  const dateRange = getTodayDateRange();
  const currentTime = Date.now();

  const { data: categoriesData } = useQuery<StudyCategory[]>({
    queryKey: ['studyCategories'],
    queryFn: () => StudyCategoriesService.readStudyCategoriesStudyCategoriesGet(),
  });

  const { data: dailyGoalsData } = useQuery<DailyGoal[]>({
    queryKey: ['dailyGoals'],
    queryFn: () => DailyGoalsService.readDailyGoalsDailyGoalsGet(),
  });

  const { data: studyBlocksData } = useQuery<StudyBlock[]>({
    queryKey: ['studyBlocks', dateRange.start_time, dateRange.end_time],
    queryFn: () => StudyBlocksService.queryStudyBlocksStudyBlocksQueryPost(dateRange),
  });

  const activeCategory = categoriesData?.find((cat) => cat.is_selected);
  const activeDailyGoal = dailyGoalsData?.find((goal) => goal.is_selected);
  // Get block size in seconds
  const activeBlockSize = (activeDailyGoal && activeDailyGoal.block_size * 60) || 0;

  const createStudyBlockMutation = useMutation({
    mutationFn: StudyBlocksService.createStudyBlockStudyBlocksPost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['studyBlocks'] });
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

  useEffect(() => {
    if (!initialCheckPerformed.current && studyBlocksData && studyBlocksData.length > 0 && dailyGoalsData) {
      const incompleteBlock = studyBlocksData.find((block) => !block.end_time);

      if (incompleteBlock) {
        setIsActive(true);
        setStudyBlockId(incompleteBlock.id);
        if (incompleteBlock.is_countdown !== undefined) setIsCountDown(!!incompleteBlock.is_countdown);

        const startTime = new Date(incompleteBlock.start_time).getTime();
        const elapsedMilliseconds = currentTime - startTime;

        if (incompleteBlock.is_countdown) {
          const initialBlockTime = activeBlockSize * 1000;
          const remainingTime = Math.max(initialBlockTime - elapsedMilliseconds, 0);
          setTime(Math.floor(remainingTime / 1000));

          if (remainingTime <= 0) {
            handleTimerExpiration();
          }
        } else {
          setTime(Math.floor(elapsedMilliseconds / 1000));
        }
      } else {
        setTime(activeBlockSize);
        setIsCountDown(true);
      }

      initialCheckPerformed.current = true;
    }
  }, [studyBlocksData, activeDailyGoal, dailyGoalsData]);

  const handleTimerExpiration = async () => {
    if (studyBlockId) {
      await updateStudyBlockMutation.mutateAsync({
        id: studyBlockId,
        block: { end_time: getCurrentUTC() },
      });
    }
    setIsActive(false);
    setStudyBlockId(null);
  };

  useEffect(() => {
    if (!studyBlocksData || !isActive) return;

    const incompleteBlock = studyBlocksData.find((block) => !block.end_time);
    if (!incompleteBlock) return;

    const startTime = new Date(incompleteBlock.start_time + 'Z').getTime();

    const updateTimer = () => {
      const currentTime = Date.now();
      const elapsedMilliseconds = currentTime - startTime;

      if (isCountDown) {
        const initialBlockTime = activeBlockSize * 1000;
        const remainingTime = Math.max(initialBlockTime - elapsedMilliseconds, 0);
        setTime(Math.floor(remainingTime / 1000));
        if (remainingTime <= 0) {
          handleTimerExpiration();
        }
      } else {
        setTime(Math.floor(elapsedMilliseconds / 1000));
      }
    };

    updateTimer(); // Update immediately
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [studyBlocksData, isActive, isCountDown, activeBlockSize, handleTimerExpiration]);

  const startTimer = async () => {
    if (activeDailyGoal && activeCategory && isCountDown !== null) {
      const newBlock = await createStudyBlockMutation.mutateAsync({
        is_countdown: isCountDown,
        daily_goal_id: activeDailyGoal.id,
        study_category_id: activeCategory.id,
      });
      setStudyBlockId(newBlock.id);
      setIsActive(true);
      setTime(isCountDown ? activeBlockSize : 0);
    }
  };

  const stopTimer = async () => {
    if (studyBlockId) {
      await updateStudyBlockMutation.mutateAsync({
        id: studyBlockId,
        block: { end_time: getCurrentUTC() },
      });
      setIsActive(false);
      setStudyBlockId(null);
      setTime(isCountDown ? activeBlockSize : 0);
    }
  };

  const toggleMode = () => {
    setIsCountDown(!isCountDown);
    setTime(isCountDown ? 0 : activeBlockSize);
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

  return (
    <div className="rounded-lg bg-white p-4 shadow sm:p-6">
      <div className="flex flex-col items-center">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{isCountDown ? 'Timer' : 'Stopwatch'}</h2>
        <p className="mb-8 text-5xl font-bold text-indigo-600">{formatTime(time)}</p>
        <div className="flex space-x-3">
          {!isActive && (
            <button
              disabled={!activeCategory && !activeDailyGoal}
              onClick={toggleMode}
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isCountDown ? 'Switch to Stopwatch' : 'Switch to Timer'}
            </button>
          )}
          <button
            onClick={isActive ? stopTimer : startTimer}
            disabled={!activeCategory && !activeDailyGoal}
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
