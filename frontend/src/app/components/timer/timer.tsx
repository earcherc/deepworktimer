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
import { getCurrentUTC, getTodayDateRange } from '@utils/dateUtils';
import useToast from '@context/toasts/toast-context';
import { useEffect, useState } from 'react';

enum TimerMode {
  Countdown = 'Timer',
  Stopwatch = 'Stopwatch',
}

const QUERY_KEYS = {
  studyCategories: 'studyCategories',
  dailyGoals: 'dailyGoals',
  studyBlocks: 'studyBlocks',
};

const Timer = () => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<TimerMode>(TimerMode.Countdown);
  const [studyBlockId, setStudyBlockId] = useState<number | null>(null);

  const dateRange = getTodayDateRange();

  const { data: categoriesData } = useQuery<StudyCategory[]>({
    queryKey: [QUERY_KEYS.studyCategories],
    queryFn: () => StudyCategoriesService.readStudyCategoriesStudyCategoriesGet(),
  });

  const { data: dailyGoalsData } = useQuery<DailyGoal[]>({
    queryKey: [QUERY_KEYS.dailyGoals],
    queryFn: () => DailyGoalsService.readDailyGoalsDailyGoalsGet(),
  });

  const { data: studyBlocksData } = useQuery<StudyBlock[]>({
    queryKey: [QUERY_KEYS.studyBlocks, dateRange.start_time, dateRange.end_time],
    queryFn: () => StudyBlocksService.queryStudyBlocksStudyBlocksQueryPost(dateRange),
  });

  const activeCategory = categoriesData?.find((cat) => cat.is_selected);
  const activeDailyGoal = dailyGoalsData?.find((goal) => goal.is_selected);
  const activeBlockSize = (activeDailyGoal && activeDailyGoal.block_size * 60) || 0;

  const createStudyBlockMutation = useMutation({
    mutationFn: StudyBlocksService.createStudyBlockStudyBlocksPost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.studyBlocks] });
      return data;
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof ApiError
          ? error.body?.detail || 'Failed to create study block'
          : 'Failed to create study block';
      addToast({ type: 'error', content: errorMessage });
      console.error('Error creating study block:', errorMessage);
    },
  });

  const updateStudyBlockMutation = useMutation({
    mutationFn: ({ id, block }: { id: number; block: StudyBlockUpdate }) =>
      StudyBlocksService.updateStudyBlockStudyBlocksStudyBlockIdPatch(id, block),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.studyBlocks] });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof ApiError
          ? error.body?.detail || 'Failed to update study block'
          : 'Failed to update study block';
      addToast({ type: 'error', content: errorMessage });
      console.error('Error updating study block:', errorMessage);
    },
  });

  useEffect(() => {
    if (!studyBlocksData || studyBlocksData.length === 0 || !dailyGoalsData) return;

    const incompleteBlock = studyBlocksData.find((block) => !block.end_time);
    if (!incompleteBlock) {
      setTime(activeBlockSize);
      setMode(TimerMode.Countdown);
      return;
    }

    setIsActive(true);
    setStudyBlockId(incompleteBlock.id);
    setMode(incompleteBlock.is_countdown ? TimerMode.Countdown : TimerMode.Stopwatch);

    // Add 'Z' to ensure UTC time
    const startTime = new Date(incompleteBlock.start_time + 'Z').getTime();
    const elapsedMilliseconds = Date.now() - startTime;

    if (incompleteBlock.is_countdown) {
      const remainingTime = Math.max(activeBlockSize * 1000 - elapsedMilliseconds, 0);
      setTime(Math.floor(remainingTime / 1000));
    } else {
      setTime(Math.floor(elapsedMilliseconds / 1000));
    }
  }, [studyBlocksData, dailyGoalsData, activeBlockSize]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (mode === TimerMode.Countdown) {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            handleTimerExpiration();
            return 0;
          }
          return newTime;
        } else {
          return prevTime + 1;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, mode]);

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

  const startTimer = async () => {
    if (activeDailyGoal && activeCategory) {
      const newBlock = await createStudyBlockMutation.mutateAsync({
        is_countdown: mode === TimerMode.Countdown,
        daily_goal_id: activeDailyGoal.id,
        study_category_id: activeCategory.id,
      });
      setStudyBlockId(newBlock.id);
      setIsActive(true);
      setTime(mode === TimerMode.Countdown ? activeBlockSize : 0);
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
      setTime(mode === TimerMode.Countdown ? activeBlockSize : 0);
    }
  };

  const toggleMode = () => {
    setMode(mode === TimerMode.Countdown ? TimerMode.Stopwatch : TimerMode.Countdown);
    setTime(mode === TimerMode.Countdown ? 0 : activeBlockSize);
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
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{mode}</h2>
        <p className="mb-8 text-5xl font-bold text-indigo-600">{formatTime(time)}</p>
        <div className="flex space-x-3">
          {!isActive && (
            <button
              disabled={!activeCategory && !activeDailyGoal}
              onClick={toggleMode}
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Switch to {mode === TimerMode.Countdown ? 'Stopwatch' : 'Timer'}
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
