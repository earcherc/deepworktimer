'use client';

import React, { Fragment, useRef } from 'react';
import { StudyBlockType } from '@/graphql/graphql-types';
import StudyBlock from './study-block';

const currentDate = new Date();

// Set the time to 1 AM on the current day
currentDate.setHours(1, 0, 0, 0); // sets the time to 1:00 AM

const dummyStudyBlocks: StudyBlockType[] = [
  {
    dailyGoalId: 1,
    end: new Date(currentDate.getTime() + 60 * 60 * 1000).toISOString(), // 1 hour after the start time
    start: currentDate.toISOString(),
    studyCategoryId: 2,
    title: 'Study Session',
    userId: 1,
    rating: 4.5,
  },
];

export default function Calendar() {
  const container = useRef(null);
  const containerOffset = useRef(null);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="isolate flex flex-auto overflow-auto rounded-lg bg-white">
        <div ref={container} className="flex flex-auto flex-col overflow-auto">
          <div className="flex w-full flex-auto">
            <div className="w-14 flex-none bg-white ring-1 ring-gray-100" />
            <div className="grid flex-auto grid-cols-1 grid-rows-1">
              {/* Horizontal lines */}
              <div
                className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
                style={{ gridTemplateRows: 'repeat(48, minmax(3.5rem, 1fr))' }}
              >
                <div ref={containerOffset} className="row-end-1 h-7"></div>
                {Array.from({ length: 24 }).map((_, index) => (
                  <Fragment key={index}>
                    <div>
                      <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                        {index === 0 ? '12 AM' : `${index % 12 === 0 ? 12 : index % 12} ${index < 12 ? 'AM' : 'PM'}`}
                      </div>
                    </div>
                    <div />
                  </Fragment>
                ))}
              </div>

              {/* Events */}
              <ol
                className="col-start-1 col-end-2 row-start-1 grid grid-cols-1"
                style={{ gridTemplateRows: '1.75rem repeat(1440, minmax(1px, auto))' }}
              >
                {dummyStudyBlocks.map((block, index) => (
                  <StudyBlock
                    key={block.dailyGoalId || index}
                    block={{ title: block.title, start: block.start, end: block.end }}
                  />
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
