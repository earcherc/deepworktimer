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
import { getCurrentUTC, getTodayDateRange, toLocalTime } from '@utils/dateUtils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Tooltip } from 'react-tooltip';

import { Cog6ToothIcon } from '@heroicons/react/20/solid';
import useToast from '@context/toasts/toast-context';
import { useEffect, useState } from 'react';

enum TimerMode {
  Countdown = 'Timer',
  OpenSession = 'Open Session',
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
  const isDisabled = !activeCategory || !activeDailyGoal;

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
    setMode(incompleteBlock.is_countdown ? TimerMode.Countdown : TimerMode.OpenSession);

    const startTime = toLocalTime(incompleteBlock.start_time).getTime();
    const elapsedMilliseconds = Date.now() - startTime;

    if (incompleteBlock.is_countdown) {
      const remainingTime = Math.max(activeBlockSize * 1000 - elapsedMilliseconds, 0);
      setTime(Math.floor(remainingTime / 1000));
    } else {
      setTime(Math.floor(elapsedMilliseconds / 1000));
    }
  }, [studyBlocksData, dailyGoalsData, activeBlockSize]);

  useEffect(() => {
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
  }, [isActive, mode, studyBlockId, updateStudyBlockMutation]);

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
    setMode(mode === TimerMode.Countdown ? TimerMode.OpenSession : TimerMode.Countdown);
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
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{mode}</h2>
        <p className="mb-8 text-5xl font-bold text-indigo-600">{formatTime(time)}</p>
        <div className="flex space-x-3">
          {!isActive && (
            <button
              disabled={isDisabled}
              onClick={toggleMode}
              className={`rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
              }`}
              data-tooltip-id="timer-tooltip"
              data-tooltip-content={isDisabled ? 'Assign goal and category' : ''}
              data-tooltip-delay-show={1000}
            >
              <Cog6ToothIcon className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={isActive ? stopTimer : startTimer}
            disabled={isDisabled}
            className={`rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isDisabled
                ? 'bg-gray-400 cursor-not-allowed'
                : isActive
                  ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
                  : 'bg-indigo-600 hover:bg-indigo-500 focus:ring-indigo-500'
            }`}
            data-tooltip-id="timer-tooltip"
            data-tooltip-content={isDisabled ? 'Assign goal and category' : ''}
            data-tooltip-delay-show={1000}
          >
            {isActive ? 'Stop' : 'Start'}
          </button>
        </div>
      </div>
      <Tooltip id="timer-tooltip" />
    </div>
  );
};

export default Timer;
