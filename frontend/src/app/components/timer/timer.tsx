import { DailyGoal, StudyBlock, StudyBlockCreate, StudyBlockUpdate, StudyCategory } from '@api';
import React, { useCallback, useEffect, useState } from 'react';

interface TimerProps {
  activeCategory: StudyCategory | undefined;
  activeDailyGoal: DailyGoal | undefined;
  studyBlocksData: StudyBlock[] | undefined;
  createStudyBlock: (block: StudyBlockCreate) => Promise<StudyBlock>;
  updateStudyBlock: (params: { id: number; block: Partial<StudyBlockUpdate> }) => Promise<void>;
}

const Timer: React.FC<TimerProps> = ({
  activeCategory,
  activeDailyGoal,
  studyBlocksData,
  createStudyBlock,
  updateStudyBlock,
}) => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isCountDown, setIsCountDown] = useState(true);
  const [studyBlockId, setStudyBlockId] = useState<number | null>(null);

  const getInitialTime = useCallback(() => {
    return (activeDailyGoal?.block_size || 0) * 60; // Convert minutes to seconds
  }, [activeDailyGoal]);

  useEffect(() => {
    if (isCountDown) {
      setTime(getInitialTime());
    }
  }, [isCountDown, getInitialTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (isCountDown) {
            if (prevTime <= 0) {
              clearInterval(interval!);
              handleTimerExpiration();
              return 0;
            }
            return prevTime - 1;
          } else {
            return prevTime + 1;
          }
        });
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval!);
    }
    return () => clearInterval(interval!);
  }, [isActive, isCountDown]);

  const handleTimerExpiration = useCallback(async () => {
    if (studyBlockId) {
      await updateStudyBlock({ id: studyBlockId, block: { end: new Date().toISOString() } });
    }
    setIsActive(false);
    setStudyBlockId(null);
  }, [studyBlockId, updateStudyBlock]);

  const startTimer = async () => {
    if (activeCategory && activeDailyGoal) {
      const newBlock = await createStudyBlock({
        start: new Date().toISOString(),
        is_countdown: isCountDown,
        daily_goal_id: activeDailyGoal.id,
        study_category_id: activeCategory.id,
      });
      setStudyBlockId(newBlock.id);
      setIsActive(true);
      setTime(isCountDown ? getInitialTime() : 0);
    }
  };

  const stopTimer = async () => {
    if (studyBlockId) {
      await updateStudyBlock({ id: studyBlockId, block: { end: new Date().toISOString() } });
    }
    setIsActive(false);
    setStudyBlockId(null);
    setTime(isCountDown ? getInitialTime() : 0);
  };

  const toggleMode = () => {
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
