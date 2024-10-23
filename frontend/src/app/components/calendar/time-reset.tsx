'use client';

import { useTimeManagement } from '@hooks/useTimeManagement';

const TimeReset = ({ currentDate, onClick }: { currentDate: Date | null; onClick: () => void }) => {
  const { formattedTime } = useTimeManagement(currentDate);

  if (!currentDate) return null;

  return (
    <button
      onClick={onClick}
      className="px-2 py-px rounded bg-red-50 text-red-500 text-sm font-medium hover:bg-red-100"
      title="Scroll to current time"
    >
      {formattedTime}
    </button>
  );
};

export default TimeReset;
