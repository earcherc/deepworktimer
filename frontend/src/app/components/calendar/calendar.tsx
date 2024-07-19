'use client';

import { StudyBlock, StudyBlocksService } from '@api';
import { useModalContext } from '@context/modal/modal-context';
import { ChevronLeftIcon, ChevronRightIcon, MinusIcon, PlusIcon } from '@heroicons/react/20/solid';
import { useQuery } from '@tanstack/react-query';
import { calculateGridPosition } from '@utils/timeUtils';
import { addDays, endOfDay, format, formatISO, isToday, startOfDay, subDays } from 'date-fns';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CurrentTimeIndicator from './current-time-indicator';
import StudyBlockComponent from './study-block';
import StudyBlockEdit from './study-block-edit';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.5;
const MINUTES_PER_DAY = 1440;
const HOURS_PER_DAY = 24;

interface CalendarProps {}

const Calendar: React.FC<CalendarProps> = () => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { showModal } = useModalContext();

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  const dateRange = useMemo(() => {
    if (!currentDate) return null;
    const startDate = startOfDay(currentDate);
    const endDate = endOfDay(currentDate);
    return {
      start_time: formatISO(startDate),
      end_time: formatISO(endDate),
    };
  }, [currentDate]);

  const { data: studyBlocksData } = useQuery<StudyBlock[]>({
    queryKey: ['studyBlocks', dateRange?.start_time, dateRange?.end_time],
    queryFn: () => dateRange ? StudyBlocksService.queryStudyBlocksStudyBlocksQueryPost(dateRange) : Promise.resolve([]),
    enabled: !!dateRange,
  });

  const sortedStudyBlocks = useMemo(() => {
    return [...(studyBlocksData || [])].sort(
      (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
    );
  }, [studyBlocksData]);

  const scrollToCurrentTime = () => {
    if (containerRef.current) {
      const now = new Date();
      const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
      const scrollRatio = minutesSinceMidnight / MINUTES_PER_DAY;
      containerRef.current.scrollTop =
        scrollRatio * containerRef.current.scrollHeight - containerRef.current.clientHeight / 2;
    }
  };

  useEffect(() => {
    scrollToCurrentTime();
  }, []);

  const updateCurrentTime = useCallback(() => {
    setCurrentTime(new Date());
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const scheduleUpdate = () => {
      const now = new Date();
      const delay = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());

      timeoutId = setTimeout(() => {
        updateCurrentTime();
        scheduleUpdate();
      }, delay);
    };

    updateCurrentTime();
    scheduleUpdate();

    const intervalId = setInterval(() => {
      const now = new Date();
      if (now.getSeconds() === 0) {
        updateCurrentTime();
      }
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [updateCurrentTime]);

  const handleZoom = (delta: number) => {
    setZoomLevel((prevZoom) => {
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prevZoom + delta));
      return Number(newZoom.toFixed(1));
    });
  };

  const openEditStudyBlockModal = (block: StudyBlock) => {
    showModal({
      type: 'default',
      title: 'Edit Study Block',
      content: <StudyBlockEdit block={block} />,
    });
  };

  const goToPreviousDay = () => {
    setCurrentDate((prevDate) => prevDate ? subDays(prevDate, 1) : null);
  };

  const goToNextDay = () => {
    setCurrentDate((prevDate) => {
      if (!prevDate) return null;
      const nextDay = addDays(prevDate, 1);
      return isToday(nextDay) ? prevDate : nextDay;
    });
  };

  return (
    <div className="flex h-full flex-col overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between py-2 px-8">
        <button
          onClick={goToPreviousDay}
          className="p-1 ml-10 rounded text-gray-500 hover:bg-gray-100"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <span className="text-sm text-gray-500 font-semibold">
          {currentDate ? format(currentDate, 'MMMM d, yyyy') : ''}
        </span>
        <button
          onClick={goToNextDay}
          disabled={currentDate ? isToday(currentDate) : true}
          className="p-1 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="isolate flex flex-auto overflow-hidden rounded-lg bg-white">
        <div ref={containerRef} className="flex flex-auto flex-col overflow-auto">
          <div className="flex w-full flex-auto relative">
            <div className="w-14 flex-none bg-white ring-1 ring-gray-100" />
            <div className="flex-1">
              <div className="grid flex-auto grid-cols-1 grid-rows-1">
                <div
                  className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
                  style={{ gridTemplateRows: `repeat(${HOURS_PER_DAY}, minmax(${10.5 * zoomLevel}rem, 1fr))` }}
                >
                  {Array.from({ length: HOURS_PER_DAY }).map((_, index) => (
                    <div key={index}>
                      <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                        {index === 0 ? '12 AM' : `${index % 12 === 0 ? 12 : index % 12} ${index < 12 ? 'AM' : 'PM'}`}
                      </div>
                    </div>
                  ))}
                </div>
                <ol className="col-start-1 col-end-2 row-start-1 relative h-full">
                  {sortedStudyBlocks?.map((block) => (
                    <StudyBlockComponent
                      key={block.id}
                      block={block}
                      calculatePosition={calculateGridPosition}
                      onClick={() => openEditStudyBlockModal(block)}
                      currentTime={currentTime}
                    />
                  ))}
                </ol>
                <CurrentTimeIndicator currentTime={currentTime} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-4 right-4 z-10 flex items-center space-x-2 mr-4">
        <span className="text-gray-500 font-semibold">{(zoomLevel * 100).toFixed(0)}%</span>
        <button
          onClick={() => handleZoom(-ZOOM_STEP)}
          disabled={zoomLevel <= MIN_ZOOM}
          className="p-2 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-50"
        >
          <MinusIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleZoom(ZOOM_STEP)}
          disabled={zoomLevel >= MAX_ZOOM}
          className="p-2 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-50"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Calendar;