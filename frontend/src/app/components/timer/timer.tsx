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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import SessionCounterModal from '../session-counter/session-counter-modal';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import TimeSettingsModal from '../time-settings/time-settings-view';
import { useModalContext } from '@app/context/modal/modal-context';
import SessionCounter from '../session-counter/session-counter';
import { createMutationErrorHandler } from '@utils/httpUtils';
import { TimerMode, timerModeAtom } from '../../store/atoms';
import { Cog6ToothIcon } from '@heroicons/react/20/solid';
import useToast from '@context/toasts/toast-context';
import classNames from 'classnames';
import { useAtom } from 'jotai';

const QUERY_KEYS = {
  studyCategories: 'studyCategories',
  dailyGoals: 'dailyGoals',
  studyBlocks: 'studyBlocks',
  sessionCounters: 'sessionCounters',
  timeSettings: 'timeSettings',
};

const minutesToSeconds = (minutes: number) => minutes * 60;
const minutesToMilliseconds = (minutes: number) => minutes * 60 * 1000;
const secondsToMilliseconds = (seconds: number) => seconds * 1000;
const millisecondsToSeconds = (milliseconds: number) => Math.floor(milliseconds / 1000);

const DEFAULT_DURATION = minutesToSeconds(60);

const Timer: React.FC = () => {
  const { addToast } = useToast();
  const handleMutationError = createMutationErrorHandler(addToast);
  const { showModal } = useModalContext();
  const queryClient = useQueryClient();
  const dateRange = getTodayDateRange();

  const [time, setTime] = useState<number>(DEFAULT_DURATION);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [mode, setMode] = useAtom(timerModeAtom);
  const [studyBlockId, setStudyBlockId] = useState<number | null>(null);
  const [dummyActive, setDummyActive] = useState(false);
  const [isBreakMode, setIsBreakMode] = useState(false);
  const [breakAudio, setBreakAudio] = useState<HTMLAudioElement | null>(null);
  const [intervalAudio, setIntervalAudio] = useState<HTMLAudioElement | null>(null);
  const [endAudio, setEndAudio] = useState<HTMLAudioElement | null>(null);
  const workerRef = useRef<Worker | null>(null);

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

  const activeCategory = categoriesData?.find((cat) => cat.is_selected);
  const activeDailyGoal = dailyGoalsData?.find((goal) => goal.is_selected);
  const activeSessionCounter = sessionCountersData.find((counter) => counter.is_selected);
  const activeTimeSettings = timeSettingsData?.find((settings) => settings.is_selected);

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

  useEffect(() => {
    setBreakAudio(new Audio('/audio/break_chime.mp3'));
    setIntervalAudio(new Audio('/audio/interval_chime.mp3'));
    setEndAudio(new Audio('/audio/end_chime.mp3'));
  }, []);

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
      let audio;
      if (type === 'break') audio = breakAudio;
      if (type == 'interval') audio = intervalAudio;
      if (type == 'end') audio = endAudio;
      if (audio) {
        audio.play().catch((error) => console.error(`Error playing ${type} audio:`, error));
      }
    },
    [breakAudio, intervalAudio, endAudio, activeTimeSettings],
  );

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setIsBreakMode(false);
    if (!activeSessionCounter) setDummyActive(false);
    if (workerRef.current) workerRef.current.postMessage('stop');

    if (mode == TimerMode.Countdown) {
      setTime(activeTimeSettings?.duration ? minutesToSeconds(activeTimeSettings.duration) : DEFAULT_DURATION);
    } else {
      setTime(0);
    }
  }, [mode, activeTimeSettings, activeSessionCounter]);

  const completeDueStudyBlock = useCallback(
    async (studyBlockId: number, endTime: string) => {
      await updateStudyBlockMutation.mutateAsync({
        id: studyBlockId,
        block: { end_time: endTime },
      });
    },
    [updateStudyBlockMutation],
  );

  useEffect(() => {
    if (!studyBlocksData) return;

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
          return;
        }
      } else {
        newTime = elapsedMilliseconds;
      }

      setStudyBlockId(incompleteBlock.id);
      setMode(incompleteBlock.is_countdown ? TimerMode.Countdown : TimerMode.OpenSession);
      setTime(millisecondsToSeconds(newTime));
      setIsActive(true);
    }
  }, [studyBlocksData, completeDueStudyBlock, setMode, activeTimeSettings]);

  useEffect(() => {
    if (isActive && !isBreakMode && activeTimeSettings?.sound_interval) {
      const intervalId = setInterval(() => {
        if (activeTimeSettings.is_sound !== false) {
          playChime('interval');
        }
      }, minutesToMilliseconds(activeTimeSettings.sound_interval));

      return () => clearInterval(intervalId);
    }
    return undefined;
  }, [isActive, isBreakMode, activeTimeSettings, playChime]);

  const handleTimerFinished = useCallback(
    async (newCompleted: number) => {
      if (!activeTimeSettings || activeTimeSettings.is_sound !== false) {
        playChime('end');
      }

      setIsBreakMode(true);

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
      if (newCompleted % longBreakInterval === 0) {
        setTime(minutesToSeconds(activeTimeSettings?.long_break_duration || 30));
      } else {
        setTime(minutesToSeconds(activeTimeSettings?.short_break_duration || 5));
      }
    },
    [activeSessionCounter, activeTimeSettings, playChime, updateSessionCounterMutation, createSessionCounterMutation],
  );

  const stopTimer = useCallback(
    async (completed = false) => {
      resetTimer();

      if (studyBlockId) {
        await updateStudyBlockMutation.mutateAsync({
          id: studyBlockId,
          block: { end_time: getCurrentUTC() },
        });
        setStudyBlockId(null);
      }

      if (completed && mode === TimerMode.Countdown) {
        if (activeSessionCounter) {
          const newCompleted = activeSessionCounter.completed + 1;
          await handleTimerFinished(newCompleted);
        } else {
          await handleTimerFinished(1);
        }
      }
    },
    [studyBlockId, updateStudyBlockMutation, mode, activeSessionCounter, handleTimerFinished, resetTimer],
  );

  const handleTick = useCallback(() => {
    setTime((prevTime) => {
      if ((mode === TimerMode.Countdown && !isBreakMode) || isBreakMode) {
        const newTime = Math.max(prevTime - 1, 0);
        if (newTime === 0) {
          stopTimer(true);
          return newTime;
        }
        return newTime;
      } else {
        return prevTime + 1;
      }
    });
  }, [mode, isBreakMode, stopTimer]);

  useEffect(() => {
    if (!workerRef.current) return;

    workerRef.current.onmessage = handleTick;

    if (isActive) {
      workerRef.current.postMessage('start');
    } else {
      workerRef.current.postMessage('stop');
    }

    return () => {
      workerRef.current?.postMessage('stop');
    };
  }, [isActive, handleTick]);

  useEffect(() => {
    const formattedTime = formatTime(time);
    document.title = isActive ? formattedTime : 'Timer';

    return () => {
      document.title = 'Timer';
    };
  }, [time, isActive]);

  const startTimer = async () => {
    const newBlock = await createStudyBlockMutation.mutateAsync({
      is_countdown: mode === TimerMode.Countdown,
      daily_goal_id: activeDailyGoal?.id,
      study_category_id: activeCategory?.id,
    });

    setStudyBlockId(newBlock.id);
    setIsActive(true);

    if (!activeSessionCounter) setDummyActive(true);
    if (workerRef.current) workerRef.current.postMessage('start');
  };

  const toggleMode = () => {
    if (isActive) return;
    setMode((prevMode) => {
      const newMode = prevMode === TimerMode.Countdown ? TimerMode.OpenSession : TimerMode.Countdown;
      if (newMode === TimerMode.Countdown) {
        setTime(activeTimeSettings?.duration ? minutesToSeconds(activeTimeSettings.duration) : DEFAULT_DURATION);
      } else {
        setTime(0);
      }
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
      createSessionCounterMutation.mutate({ target: activeSessionCounter.target, completed: 0, is_selected: true });
    }
  };

  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow">
      <div className="flex flex-col items-center">
        <div className="mb-4 flex space-x-4">
          {!isBreakMode &&
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
        <p className="mb-2 text-6xl font-bold text-gray-900 dark:text-white">{formatTime(time)}</p>
        {mode === TimerMode.Countdown && !isBreakMode && (
          <SessionCounter
            target={activeSessionCounter ? activeSessionCounter.target : 5}
            completed={activeSessionCounter ? activeSessionCounter.completed : 0}
            isActive={activeSessionCounter ? isActive : dummyActive}
            isDummy={!activeSessionCounter}
            onReset={resetSessionCounter}
            onClick={openSessionsModal}
          />
        )}
        {isBreakMode && (
          <p className="mb-4 text-lg font-medium text-blue-500">
            {time > minutesToSeconds(activeTimeSettings?.short_break_duration || 5) ? 'Long Break' : 'Short Break'}
          </p>
        )}
        <div className="flex space-x-3">
          {!isActive && (
            <button
              onClick={openSettingsModal}
              className="rounded-full p-2 transition-colors bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <Cog6ToothIcon className="h-5 w-5" />
            </button>
          )}
          {!isBreakMode && (
            <button
              onClick={isActive ? () => stopTimer() : startTimer}
              className={classNames(
                'rounded-full px-6 py-2 text-sm font-semibold text-white transition-colors',
                isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600',
              )}
            >
              {isActive ? 'Stop' : 'Start'}
            </button>
          )}
          {isBreakMode && (
            <button
              onClick={() => resetTimer()}
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
