// study-block-edit.tsx
import { useModalContext } from '../../context/modal/modal-context';
import { StudyBlock, StudyBlocksService } from '@api';
import React, { useState } from 'react';

interface StudyBlockEditProps {
  block: StudyBlock;
}

const StudyBlockEdit: React.FC<StudyBlockEditProps> = ({ block }) => {
  const [isCountdown, setIsCountdown] = useState(block.is_countdown);
  const [startTime, setStartTime] = useState(block.start_time);
  const [endTime, setEndTime] = useState(block.end_time || '');
  const { hideModal } = useModalContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await StudyBlocksService.updateStudyBlockStudyBlocksStudyBlockIdPatch(block.id, {
        ...block,
        end_time: endTime,
      });
      hideModal();
    } catch (error) {
      console.error('Failed to update study block:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          value={isCountdown ? 'countdown' : 'session'}
          onChange={(e) => setIsCountdown(e.target.value === 'countdown')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        >
          <option value="session">Session</option>
          <option value="countdown">Countdown</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Start Time</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">End Time</label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={hideModal}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default StudyBlockEdit;
