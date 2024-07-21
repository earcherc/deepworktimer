import {
  ApiError,
  DailyGoal,
  DailyGoalsService,
  SessionCountersService,
  SessionCounter as SessionCounterType,
  StudyBlock,
  StudyBlocksService,
  StudyBlockUpdate,
  StudyCategoriesService,
  StudyCategory,
} from '@api';
import { getCurrentUTC, getTodayDateRange, toLocalTime } from '@utils/dateUtils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import SessionCounterModal from '../session-counter/session-counter-modal';
import TimeSettingsModal from '../time-settings/time-settings-view';
import { useModalContext } from '@app/context/modal/modal-context';
import SessionCounter from '../session-counter/session-counter';
import React, { useCallback, useEffect, useState } from 'react';
import { TimerMode, timerModeAtom } from '../../store/atoms';
import { Cog6ToothIcon } from '@heroicons/react/20/solid';
import useToast from '@context/toasts/toast-context';
import { Tooltip } from 'react-tooltip';
import classNames from 'classnames';
import { useAtom } from 'jotai';

const QUERY_KEYS = {
  studyCategories: 'studyCategories',
  dailyGoals: 'dailyGoals',
  studyBlocks: 'studyBlocks',
  sessionCounters: 'sessionCounters',
};

const Timer: React.FC = () => {
  const { addToast } = useToast();
  const { showModal } = useModalContext();
  const queryClient = useQueryClient();
  const dateRange = getTodayDateRange();

  const [time, setTime] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [mode, setMode] = useAtom(timerModeAtom);
  const [studyBlockId, setStudyBlockId] = useState<number | null>(null);
  const [dummyActive, setDummyActive] = useState(false);

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

  // const { data: timeSettingsData = [] } = useQuery<TimeSettings[]>({
  //   queryKey: ['timeSettings'],
  //   queryFn: () => TimeSettingsService.readTimeSettingsListTimeSetttingsGet(),
  // });

  const { data: sessionCountersData = [] } = useQuery<SessionCounterType[]>({
    queryKey: [QUERY_KEYS.sessionCounters],
    queryFn: () => SessionCountersService.readSessionCountersSessionCountersGet(),
  });

  const activeCategory = categoriesData?.find((cat) => cat.is_selected);
  const activeDailyGoal = dailyGoalsData?.find((goal) => goal.is_selected);
  const activeBlockSize = activeDailyGoal ? activeDailyGoal.block_size * 60 : 0;
  const isDisabled = !activeCategory || !activeDailyGoal;
  const activeSessionCounter = sessionCountersData.find((counter) => counter.is_selected);

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

  const createSessionCounterMutation = useMutation({
    mutationFn: (counter: { target: number; completed: number }) =>
      SessionCountersService.createSessionCounterSessionCountersPost(counter),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.sessionCounters] });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof ApiError
          ? error.body?.detail || 'Failed to create session counter'
          : 'Failed to create session counter';
      addToast({ type: 'error', content: errorMessage });
    },
  });

  const updateSessionCounterMutation = useMutation({
    mutationFn: (counter: { id: number; completed: number }) =>
      SessionCountersService.updateSessionCounterSessionCountersSessionCounterIdPatch(counter.id, {
        completed: counter.completed,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.sessionCounters] });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof ApiError
          ? error.body?.detail || 'Failed to update session counter'
          : 'Failed to update session counter';
      addToast({ type: 'error', content: errorMessage });
    },
  });

  useEffect(() => {
    if (!studyBlocksData || !activeDailyGoal) return;

    const incompleteBlock = studyBlocksData.find((block) => !block.end_time);
    if (incompleteBlock) {
      const startTime = toLocalTime(incompleteBlock.start_time).getTime();
      const elapsedMilliseconds = Date.now() - startTime;
      const newTime = incompleteBlock.is_countdown
        ? Math.max(activeBlockSize * 1000 - elapsedMilliseconds, 0)
        : elapsedMilliseconds;

      setTime(Math.floor(newTime / 1000));
      setIsActive(true);
      setMode(incompleteBlock.is_countdown ? TimerMode.Countdown : TimerMode.OpenSession);
      setStudyBlockId(incompleteBlock.id);
    } else {
      setTime(mode === TimerMode.Countdown ? activeBlockSize : 0);
      setIsActive(false);
      setStudyBlockId(null);
      setDummyActive(false);
    }
  }, [studyBlocksData, activeDailyGoal, activeBlockSize, mode, setMode]);

  const stopTimer = useCallback(async () => {
    if (studyBlockId) {
      await updateStudyBlockMutation.mutateAsync({
        id: studyBlockId,
        block: { end_time: getCurrentUTC() },
      });
      setIsActive(false);
      setStudyBlockId(null);

      if (time === 0) {
        // Only create/update session counter if timer reached 0
        if (activeSessionCounter) {
          updateSessionCounterMutation.mutate({
            id: activeSessionCounter.id,
            completed: activeSessionCounter.completed + 1,
          });
        } else {
          createSessionCounterMutation.mutate({ target: 5, completed: 1 });
        }
      }
      setDummyActive(false);
    }
  }, [
    studyBlockId,
    updateStudyBlockMutation,
    activeSessionCounter,
    updateSessionCounterMutation,
    createSessionCounterMutation,
    time,
  ]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (mode === TimerMode.Countdown) {
          const newTime = Math.max(prevTime - 1, 0);
          if (newTime === 0) {
            stopTimer();
          }
          return newTime;
        } else {
          return prevTime + 1;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, mode, stopTimer]);

  const startTimer = async () => {
    if (activeDailyGoal && activeCategory) {
      const newBlock = await createStudyBlockMutation.mutateAsync({
        is_countdown: mode === TimerMode.Countdown,
        daily_goal_id: activeDailyGoal.id,
        study_category_id: activeCategory.id,
      });
      setStudyBlockId(newBlock.id);
      if (!activeSessionCounter) {
        setDummyActive(true);
      }
    }
  };

  const toggleMode = () => {
    if (isActive) return;
    setMode((prevMode) => (prevMode === TimerMode.Countdown ? TimerMode.OpenSession : TimerMode.Countdown));
    setTime(() => (mode === TimerMode.Countdown ? 0 : activeBlockSize));
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

  const isButtonDisabled = (timerMode: TimerMode) => {
    return isActive && mode !== timerMode;
  };

  const openSettingsModal = () => {
    showModal({
      type: 'default',
      title: 'Time Settings',
      content: <TimeSettingsModal />,
    });
  };

  const openSessionsModal = () => {
    showModal({
      type: 'default',
      title: 'Session Counter',
      content: <SessionCounterModal />,
    });
  };

  const resetSessionCounter = () => {
    if (activeSessionCounter) {
      createSessionCounterMutation.mutate({ target: activeSessionCounter.target, completed: 0 });
    }
  };

  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg">
      <div className="flex flex-col items-center">
        <div className="mb-4 flex space-x-4">
          {Object.values(TimerMode).map((timerMode) => (
            <button
              key={timerMode}
              onClick={toggleMode}
              disabled={isButtonDisabled(timerMode)}
              className={classNames(
                'text-sm font-medium transition-colors',
                mode === timerMode
                  ? 'text-indigo-500 font-semibold'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
                isButtonDisabled(timerMode) && 'opacity-50 cursor-not-allowed',
              )}
            >
              {timerMode}
            </button>
          ))}
        </div>
        <p className="mb-2 text-6xl font-bold text-gray-900 dark:text-white">{formatTime(time)}</p>
        {mode === TimerMode.Countdown && (
          <SessionCounter
            target={activeSessionCounter ? activeSessionCounter.target : 5}
            completed={activeSessionCounter ? activeSessionCounter.completed : 0}
            isActive={activeSessionCounter ? isActive : dummyActive}
            isDummy={!activeSessionCounter}
            onReset={resetSessionCounter}
            onClick={openSessionsModal}
          />
        )}
        <div className="flex space-x-3">
          {!isActive && (
            <button
              onClick={openSettingsModal}
              disabled={isDisabled}
              className={classNames(
                'rounded-full p-2 transition-colors',
                isDisabled
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
              )}
              data-tooltip-id="timer-tooltip"
              data-tooltip-content={isDisabled ? 'Assign goal and category' : ''}
              data-tooltip-delay-show={1000}
            >
              <Cog6ToothIcon className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={isActive ? stopTimer : startTimer}
            disabled={isDisabled}
            className={classNames(
              'rounded-full px-6 py-2 text-sm font-semibold text-white transition-colors',
              isDisabled
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                : isActive
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-indigo-500 hover:bg-indigo-600',
            )}
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
