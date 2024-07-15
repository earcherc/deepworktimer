'use client';

import { calculateGridPosition, groupOverlappingBlocks } from '@utils/timeUtils';
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid';
import { useModalContext } from '@context/modal/modal-context';
import CurrentTimeIndicator from './current-time-indicator';
import React, { useEffect, useRef, useState } from 'react';
import { StudyBlock, StudyBlocksService } from '@api';
import { getTodayDateRange } from '@utils/dateUtils';
import { useQuery } from '@tanstack/react-query';
import StudyBlockEdit from './study-block-edit';
import StudyBlockComponent from './study-block';

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;
const MINUTES_PER_DAY = 1440;
const HOURS_PER_DAY = 24;

interface CalendarProps {}

const Calendar: React.FC<CalendarProps> = () => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const { showModal } = useModalContext();

  const dateRange = getTodayDateRange();
  const { data: studyBlocksData } = useQuery<StudyBlock[]>({
    queryKey: ['studyBlocks', dateRange.start_time, dateRange.end_time],
    queryFn: () => StudyBlocksService.queryStudyBlocksStudyBlocksQueryPost(dateRange),
  });

  const groupedBlocks = groupOverlappingBlocks(studyBlocksData || []);

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
  }, [scrollToCurrentTime]);

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

  return (
    <div className="flex h-full flex-col overflow-hidden relative">
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
        <span className="text-sm text-gray-500 font-semibold">{(zoomLevel * 100).toFixed(0)}%</span>
        <button
          onClick={() => handleZoom(-ZOOM_STEP)}
          disabled={zoomLevel <= MIN_ZOOM}
          className="p-1 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-50"
        >
          <MinusIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleZoom(ZOOM_STEP)}
          disabled={zoomLevel >= MAX_ZOOM}
          className="p-1 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-50"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="isolate flex flex-auto overflow-hidden rounded-lg bg-white">
        <div ref={containerRef} className="flex flex-auto flex-col overflow-auto">
          <div className="flex w-full flex-auto relative">
            <div className="w-14 flex-none bg-white ring-1 ring-gray-100" />
            <div className="grid flex-auto grid-cols-1 grid-rows-1">
              <div
                className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
                style={{ gridTemplateRows: `repeat(${HOURS_PER_DAY * 2}, minmax(${1.75 * zoomLevel}rem, auto))` }}
              >
                {Array.from({ length: HOURS_PER_DAY }).map((_, index) => (
                  <React.Fragment key={index}>
                    <div>
                      <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                        {index === 0 ? '12 AM' : `${index % 12 === 0 ? 12 : index % 12} ${index < 12 ? 'AM' : 'PM'}`}
                      </div>
                    </div>
                    <div />
                  </React.Fragment>
                ))}
              </div>
              <ol
                className="col-start-1 col-end-2 row-start-1 grid grid-cols-1"
                style={{ gridTemplateRows: `1.75rem repeat(${MINUTES_PER_DAY}, minmax(${zoomLevel}px, auto))` }}
              >
                {groupedBlocks.map((group, groupIndex) => (
                  <li key={groupIndex} className="relative mt-px flex" style={{ gridRow: group.gridRow }}>
                    {group.blocks.map((block, blockIndex) => (
                      <StudyBlockComponent
                        key={block.id}
                        block={block}
                        zoomLevel={zoomLevel}
                        calculatePosition={calculateGridPosition}
                        onDoubleClick={() => openEditStudyBlockModal(block)}
                        totalBlocks={group.blocks.length}
                        style={{
                          width: `${100 / group.blocks.length}%`,
                          left: `${(blockIndex * 100) / group.blocks.length}%`,
                        }}
                      />
                    ))}
                  </li>
                ))}
              </ol>
              <CurrentTimeIndicator />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
