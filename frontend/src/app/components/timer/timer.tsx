import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Cog6ToothIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { useAtom } from 'jotai';

import {
  DailyGoal,
  DailyGoalsService,
  SessionCountersService,
  SessionCounter as SessionCounterType,
  StudyBlock,
  StudyBlocksService,
  StudyBlockUpdate,
  StudyCategoriesService,
  StudyCategory,
  TimeSettings,
  TimeSettingsService,
} from '@api';
import { getCurrentUTC, getTodayDateRange, toLocalTime, toUTC } from '@utils/dateUtils';
import SessionCounterModal from '../session-counter/session-counter-modal';
import TimeSettingsModal from '../time-settings/time-settings-view';
import { useModalContext } from '@app/context/modal/modal-context';
import SessionCounter from '../session-counter/session-counter';
import { createMutationErrorHandler } from '@utils/httpUtils';
import { TimerMode, timerModeAtom } from '../../store/atoms';
import useToast from '@context/toasts/toast-context';

// Constants and utility functions
const QUERY_KEYS = {
  studyCategories: 'studyCategories',
  dailyGoals: 'dailyGoals',
  studyBlocks: 'studyBlocks',
  sessionCounters: 'sessionCounters',
  timeSettings: 'timeSettings',
};

const minutesToSeconds = (minutes: number) => minutes * 60;
const secondsToMilliseconds = (seconds: number) => seconds * 1000;
const millisecondsToSeconds = (milliseconds: number) => Math.floor(milliseconds / 1000);

const DEFAULT_DURATION = minutesToSeconds(60);
const FINAL_BELL_BUFFER = 5000;

type TimerState = {
  time: number;
  isActive: boolean;
  isBreakMode: boolean;
  studyBlockId: number | null;
  dummyActive: boolean;
};

const Timer: React.FC = () => {
  const { addToast } = useToast();
  const handleMutationError = createMutationErrorHandler(addToast);
  const { showModal } = useModalContext();
  const queryClient = useQueryClient();
  const dateRange = useMemo(() => getTodayDateRange(), []);

  const [mode, setMode] = useAtom(timerModeAtom);
  const [timerState, setTimerState] = useState<TimerState>({
    time: DEFAULT_DURATION,
    isActive: false,
    isBreakMode: false,
    studyBlockId: null,
    dummyActive: false,
  });
  const [initialTimeSet, setInitialTimeSet] = useState(false);

  const audioRef = useRef<{ break: HTMLAudioElement; interval: HTMLAudioElement; end: HTMLAudioElement }>({
    break: new Audio('/audio/break_chime.mp3'),
    interval: new Audio('/audio/interval_chime.mp3'),
    end: new Audio('/audio/end_chime.mp3'),
  });

  const workerRef = useRef<Worker | null>(null);

  // Queries
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

  const { data: sessionCountersData = [] } = useQuery<SessionCounterType[]>({
    queryKey: [QUERY_KEYS.sessionCounters],
    queryFn: () => SessionCountersService.readSessionCountersSessionCountersGet(),
  });

  const { data: timeSettingsData } = useQuery<TimeSettings[]>({
    queryKey: [QUERY_KEYS.timeSettings],
    queryFn: () => TimeSettingsService.readTimeSettingsListTimeSetttingsGet(),
  });

  // Memoized values
  const activeCategory = useMemo(() => categoriesData?.find((cat) => cat.is_selected), [categoriesData]);
  const activeDailyGoal = useMemo(() => dailyGoalsData?.find((goal) => goal.is_selected), [dailyGoalsData]);
  const activeSessionCounter = useMemo(
    () => sessionCountersData.find((counter) => counter.is_selected),
    [sessionCountersData],
  );
  const activeTimeSettings = useMemo(
    () => timeSettingsData?.find((settings) => settings.is_selected),
    [timeSettingsData],
  );

  // Mutations
  const createStudyBlockMutation = useMutation({
    mutationFn: StudyBlocksService.createStudyBlockStudyBlocksPost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.studyBlocks] });
      return data;
    },
    onError: handleMutationError('create study block'),
  });

  const updateStudyBlockMutation = useMutation({
    mutationFn: ({ id, block }: { id: number; block: StudyBlockUpdate }) =>
      StudyBlocksService.updateStudyBlockStudyBlocksStudyBlockIdPatch(id, block),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.studyBlocks] });
    },
    onError: handleMutationError('update study block'),
  });

  const createSessionCounterMutation = useMutation({
    mutationFn: (counter: { target: number; completed: number; is_selected: boolean }) =>
      SessionCountersService.createSessionCounterSessionCountersPost(counter),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.sessionCounters] });
    },
    onError: handleMutationError('create session counter'),
  });

  const updateSessionCounterMutation = useMutation({
    mutationFn: (counter: { id: number; completed: number }) =>
      SessionCountersService.updateSessionCounterSessionCountersSessionCounterIdPatch(counter.id, {
        completed: counter.completed,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.sessionCounters] });
    },
    onError: handleMutationError('update session counter'),
  });

  // Effects and callbacks
  useEffect(() => {
    const workerCode = `
      let interval = null;
      self.onmessage = (e) => {
        if (e.data === 'start') {
          interval = self.setInterval(() => {
            self.postMessage('tick');
          }, 1000);
        } else if (e.data === 'stop') {
          if (interval !== null) {
            self.clearInterval(interval);
            interval = null;
          }
        }
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    workerRef.current = new Worker(workerUrl);

    return () => {
      workerRef.current?.terminate();
      URL.revokeObjectURL(workerUrl);
    };
  }, []);

  const playChime = useCallback(
    (type: 'break' | 'interval' | 'end') => {
      if (activeTimeSettings?.is_sound === false) return;
      audioRef.current[type].play().catch((error) => console.error(`Error playing ${type} audio:`, error));
    },
    [activeTimeSettings?.is_sound],
  );

  const handleTimerFinished = useCallback(
    async (newCompleted: number) => {
      playChime('end');

      if (activeSessionCounter) {
        await updateSessionCounterMutation.mutateAsync({
          id: activeSessionCounter.id,
          completed: newCompleted,
        });
      } else {
        await createSessionCounterMutation.mutateAsync({
          completed: newCompleted,
          target: 5,
          is_selected: true,
        });
      }

      const longBreakInterval = activeTimeSettings?.long_break_interval || 2;
      const breakDuration =
        newCompleted % longBreakInterval === 0
          ? activeTimeSettings?.long_break_duration || 30
          : activeTimeSettings?.short_break_duration || 5;

      setTimerState((prev) => ({
        ...prev,
        isBreakMode: true,
        time: minutesToSeconds(breakDuration),
      }));
    },
    [activeSessionCounter, activeTimeSettings, playChime, updateSessionCounterMutation, createSessionCounterMutation],
  );

  const completeDueStudyBlock = useCallback(
    async (studyBlockId: number, endTime: string) => {
      await updateStudyBlockMutation.mutateAsync({
        id: studyBlockId,
        block: { end_time: endTime },
      });

      if (activeSessionCounter) {
        await updateSessionCounterMutation.mutateAsync({
          id: activeSessionCounter.id,
          completed: activeSessionCounter.completed + 1,
        });
      } else {
        await createSessionCounterMutation.mutateAsync({
          completed: 1,
          target: 5,
          is_selected: true,
        });
      }
    },
    [updateStudyBlockMutation, activeSessionCounter, updateSessionCounterMutation, createSessionCounterMutation],
  );

  const stopTimer = useCallback(
    async (completed = false) => {
      if (timerState.studyBlockId) {
        await updateStudyBlockMutation.mutateAsync({
          id: timerState.studyBlockId,
          block: { end_time: getCurrentUTC() },
        });
      }

      if (!completed) {
        setTimerState((prev) => ({
          ...prev,
          isActive: false,
          isBreakMode: false,
          studyBlockId: null,
          time:
            mode === TimerMode.Countdown
              ? activeTimeSettings?.duration
                ? minutesToSeconds(activeTimeSettings.duration)
                : DEFAULT_DURATION
              : 0,
        }));
        if (workerRef.current) workerRef.current.postMessage('stop');
      }

      if (completed && mode === TimerMode.Countdown) {
        const newCompleted = (activeSessionCounter?.completed || 0) + 1;
        await handleTimerFinished(newCompleted);
      }
    },
    [
      timerState.studyBlockId,
      activeSessionCounter,
      mode,
      updateStudyBlockMutation,
      handleTimerFinished,
      activeTimeSettings,
    ],
  );

  const handleTick = useCallback(() => {
    setTimerState((prev) => {
      const newTime = mode === TimerMode.Countdown ? Math.max(prev.time - 1, 0) : prev.time + 1;

      // Check for interval sound
      if (
        prev.isActive &&
        !prev.isBreakMode &&
        activeTimeSettings?.sound_interval &&
        activeTimeSettings.is_sound !== false
      ) {
        const elapsedTime = mode === TimerMode.Countdown ? (activeTimeSettings.duration || 0) * 60 - newTime : newTime;
        const remainingTime = secondsToMilliseconds(mode === TimerMode.Countdown ? newTime : elapsedTime);
        if (
          remainingTime > FINAL_BELL_BUFFER &&
          elapsedTime > 0 &&
          elapsedTime % minutesToSeconds(activeTimeSettings.sound_interval) === 0
        ) {
          playChime('interval');
        }
      }

      if (mode === TimerMode.Countdown && newTime === 0) {
        if (prev.isBreakMode) {
          stopTimer();
          playChime('break');
        } else {
          stopTimer(true);
        }
      }

      return { ...prev, time: newTime };
    });
  }, [mode, activeTimeSettings, stopTimer, playChime]);

  useEffect(() => {
    if (workerRef.current) {
      workerRef.current.onmessage = handleTick;
    }
  }, [handleTick]);

  useEffect(() => {
    if (!timerState.isActive && initialTimeSet) {
      const newTime = activeTimeSettings
        ? minutesToSeconds(activeTimeSettings.duration || DEFAULT_DURATION / 60)
        : DEFAULT_DURATION;

      setTimerState((prev) => ({
        ...prev,
        time: newTime,
      }));
    }
  }, [activeTimeSettings, initialTimeSet, timerState.isActive]);

  useEffect(() => {
    if (!studyBlocksData || !timeSettingsData || !sessionCountersData || initialTimeSet) return;

    const incompleteBlock = studyBlocksData.find((block) => !block.end_time);

    if (incompleteBlock) {
      const startTime = toLocalTime(incompleteBlock.start_time).getTime();
      const elapsedMilliseconds = Date.now() - startTime;
      let newTime;
      let duration;
      if (incompleteBlock.is_countdown) {
        duration = activeTimeSettings?.duration ? minutesToSeconds(activeTimeSettings.duration) : DEFAULT_DURATION;
        newTime = secondsToMilliseconds(duration) - elapsedMilliseconds;
        if (newTime <= 0) {
          const durationInMilliseconds = secondsToMilliseconds(duration);
          const finalTime = new Date(startTime + durationInMilliseconds);
          const finalTimeUTC = toUTC(finalTime);
          completeDueStudyBlock(incompleteBlock.id, finalTimeUTC);
          setInitialTimeSet(true);
          return;
        }
      } else {
        newTime = elapsedMilliseconds;
      }
      setTimerState((prev) => ({
        ...prev,
        studyBlockId: incompleteBlock.id,
        time: millisecondsToSeconds(newTime),
        isActive: true,
        dummyActive: !activeSessionCounter,
      }));
      setMode(incompleteBlock.is_countdown ? TimerMode.Countdown : TimerMode.OpenSession);
      if (workerRef.current) workerRef.current.postMessage('start');
    } else if (activeTimeSettings) {
      setTimerState((prev) => ({
        ...prev,
        time: minutesToSeconds(activeTimeSettings.duration || DEFAULT_DURATION / 60),
      }));
    }

    setInitialTimeSet(true);
  }, [
    studyBlocksData,
    timeSettingsData,
    sessionCountersData,
    initialTimeSet,
    activeTimeSettings,
    activeSessionCounter,
    completeDueStudyBlock,
    setMode,
  ]);

  useEffect(() => {
    const formattedTime = formatTime(timerState.time);
    let title = 'Timer';

    if (timerState.isActive || timerState.isBreakMode) {
      if (timerState.isBreakMode) {
        title = `${formattedTime} - BREAK`;
      } else if (mode === TimerMode.Countdown) {
        title = `${formattedTime} - ${activeSessionCounter ? activeSessionCounter.completed + 1 : 1}/${
          activeSessionCounter ? activeSessionCounter.target : 5
        }`;
      } else {
        title = formattedTime;
      }
    }

    document.title = title;

    return () => {
      document.title = 'Timer';
    };
  }, [timerState, activeSessionCounter, mode]);

  const startTimer = async () => {
    const newBlock = await createStudyBlockMutation.mutateAsync({
      is_countdown: mode === TimerMode.Countdown,
      daily_goal_id: activeDailyGoal?.id,
      study_category_id: activeCategory?.id,
    });

    setTimerState((prev) => ({
      ...prev,
      isActive: true,
      studyBlockId: newBlock.id,
      dummyActive: !activeSessionCounter,
    }));
    if (workerRef.current) workerRef.current.postMessage('start');
  };

  const toggleMode = () => {
    if (timerState.isActive) return;
    setMode((prevMode) => {
      const newMode = prevMode === TimerMode.Countdown ? TimerMode.OpenSession : TimerMode.Countdown;
      const newTime =
        newMode === TimerMode.Countdown
          ? activeTimeSettings?.duration
            ? minutesToSeconds(activeTimeSettings.duration)
            : DEFAULT_DURATION
          : 0;
      setTimerState((prev) => ({ ...prev, time: newTime }));
      return newMode;
    });
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
    return timerState.isActive && mode !== timerMode;
  };

  const openSettingsModal = () => {
    showModal({
      type: 'default',
      title: 'Time Settings Menu',
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
      createSessionCounterMutation.mutate({ target: activeSessionCounter.target, completed: 0, is_selected: true });
    }
  };

  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow">
      <div className="flex flex-col items-center">
        <div className="mb-4 flex space-x-4">
          {!timerState.isBreakMode &&
            Object.values(TimerMode).map((timerMode) => (
              <button
                key={timerMode}
                onClick={toggleMode}
                disabled={isButtonDisabled(timerMode)}
                className={classNames(
                  'text-sm font-medium transition-colors',
                  mode === timerMode
                    ? 'text-blue-500 font-semibold'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
                  isButtonDisabled(timerMode) && 'opacity-50 cursor-not-allowed',
                )}
              >
                {timerMode}
              </button>
            ))}
        </div>
        <p className="mb-2 text-6xl font-bold text-gray-900 dark:text-white">{formatTime(timerState.time)}</p>
        {mode === TimerMode.Countdown && !timerState.isBreakMode && (
          <SessionCounter
            target={activeSessionCounter ? activeSessionCounter.target : 5}
            completed={activeSessionCounter ? activeSessionCounter.completed : 0}
            isActive={activeSessionCounter ? timerState.isActive : timerState.dummyActive}
            isDummy={!activeSessionCounter}
            onReset={resetSessionCounter}
            onClick={openSessionsModal}
          />
        )}
        {timerState.isBreakMode && (
          <p className="mb-4 text-lg font-medium text-blue-500">
            {timerState.time > minutesToSeconds(activeTimeSettings?.short_break_duration || 5)
              ? 'Long Break'
              : 'Short Break'}
          </p>
        )}
        <div className="flex space-x-3">
          {!timerState.isActive && (
            <button
              onClick={openSettingsModal}
              className="flex items-center rounded-full p-2 px-4 transition-colors bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <Cog6ToothIcon className="h-5 w-5 mr-2" />
              <span className="whitespace-nowrap">Settings</span>
            </button>
          )}
          {!timerState.isBreakMode && (
            <button
              onClick={timerState.isActive ? () => stopTimer() : startTimer}
              className={classNames(
                'rounded-full px-6 py-2 text-sm font-semibold text-white transition-colors',
                timerState.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600',
              )}
            >
              {timerState.isActive ? 'Stop' : 'Start'}
            </button>
          )}
          {timerState.isBreakMode && (
            <button
              onClick={() => stopTimer()}
              className="rounded-full px-6 py-2 text-sm font-semibold text-white transition-colors bg-red-500 hover:bg-red-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timer;
