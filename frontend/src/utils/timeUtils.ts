import { toLocalTime } from './dateUtils';
import { StudyBlock } from '@api';

export const minutesToGridPosition = (minutes: number, zoomLevel: number) => {
  return Math.round((minutes + 2) * zoomLevel);
};

export const dateToGridPosition = (date: Date, zoomLevel: number) => {
  const minutes = date.getHours() * 60 + date.getMinutes();
  return minutesToGridPosition(minutes, zoomLevel);
};

export const calculateGridPosition = (date: Date, zoomLevel: number): number => {
  const minutesSinceMidnight = date.getHours() * 60 + date.getMinutes();
  return minutesSinceMidnight * zoomLevel;
};

export const groupOverlappingBlocks = (blocks: StudyBlock[]) => {
  const sortedBlocks = blocks.sort((a, b) => toLocalTime(a.start_time).getTime() - toLocalTime(b.start_time).getTime());
  const groupedBlocks: { gridRow: string; blocks: StudyBlock[] }[] = [];

  sortedBlocks.forEach((block) => {
    const startTime = toLocalTime(block.start_time);
    const endTime = block.end_time ? toLocalTime(block.end_time) : new Date();
    const startPosition = calculateGridPosition(startTime, 1);
    const endPosition = calculateGridPosition(endTime, 1);

    let placed = false;
    for (const group of groupedBlocks) {
      if (
        !group.blocks.some((existingBlock) => {
          const existingStartTime = toLocalTime(existingBlock.start_time);
          const existingEndTime = existingBlock.end_time ? toLocalTime(existingBlock.end_time) : new Date();
          return startTime < existingEndTime && endTime > existingStartTime;
        })
      ) {
        group.blocks.push(block);
        const [groupStart, groupEnd] = group.gridRow.split(' / ').map(Number);
        group.gridRow = `${Math.min(groupStart, startPosition)} / ${Math.max(groupEnd, endPosition)}`;
        placed = true;
        break;
      }
    }

    if (!placed) {
      groupedBlocks.push({ gridRow: `${startPosition} / ${endPosition}`, blocks: [block] });
    }
  });

  return groupedBlocks;
};
