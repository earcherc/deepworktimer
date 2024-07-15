'use client';

import {
  ApiError,
  DailyGoal,
  DailyGoalsService,
  StudyBlock,
  StudyBlocksService,
  StudyCategoriesService,
  StudyCategory,
} from '@api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useModalContext } from '@context/modal/modal-context';
import useToast from '@context/toasts/toast-context';
import React, { useEffect, useState } from 'react';

interface StudyBlockEditProps {
  block: StudyBlock;
}

export function toLocalTime(dateString: string): Date {
  return new Date(dateString + 'Z');
}

export function getCurrentUTC(): string {
  return new Date().toISOString().slice(0, -1);
}

const StudyBlockEdit: React.FC<StudyBlockEditProps> = ({ block }) => {
  const [endTime, setEndTime] = useState(block.end_time ? toLocalTime(block.end_time).toISOString().slice(0, 16) : '');
  const [rating, setRating] = useState(block.rating || 0);
  const { hideModal } = useModalContext();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const [isFormChanged, setIsFormChanged] = useState(false);

  const { data: categories = [] } = useQuery<StudyCategory[]>({
    queryKey: ['studyCategories'],
    queryFn: () => StudyCategoriesService.readStudyCategoriesStudyCategoriesGet(),
  });

  const { data: goals = [] } = useQuery<DailyGoal[]>({
    queryKey: ['dailyGoals'],
    queryFn: () => DailyGoalsService.readDailyGoalsDailyGoalsGet(),
  });

  useEffect(() => {
    setIsFormChanged(
      endTime !== (block.end_time ? toLocalTime(block.end_time).toISOString().slice(0, 16) : '') ||
        rating !== block.rating,
    );
  }, [endTime, rating, block.end_time, block.rating]);

  const updateStudyBlockMutation = useMutation({
    mutationFn: (updatedBlock: Partial<StudyBlock>) =>
      StudyBlocksService.updateStudyBlockStudyBlocksStudyBlockIdPatch(block.id, updatedBlock),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyBlocks'] });
      addToast({ type: 'success', content: 'Study block updated successfully.' });
      hideModal();
    },
    onError: (error: unknown) => {
      let errorMessage = 'Failed to update study block';
      if (error instanceof ApiError) {
        errorMessage = error.body?.detail || errorMessage;
      }
      addToast({ type: 'error', content: errorMessage });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const startTimeDate = toLocalTime(block.start_time);
    const endTimeDate = new Date(endTime);

    if (endTimeDate <= startTimeDate) {
      addToast({ type: 'error', content: 'End time must be greater than the start time.' });
      return;
    }

    const updatedBlock = {
      ...block,
      end_time: endTimeDate.toISOString().slice(0, -1),
      rating,
    };

    updateStudyBlockMutation.mutate(updatedBlock);
  };

  const category = categories.find((c) => c.id === block.study_category_id);
  const goal = goals.find((g) => g.id === block.daily_goal_id);

  const ratingButtons = [1, 2, 3, 4, 5].map((value) => (
    <button
      key={value}
      type="button"
      onClick={() => setRating(value)}
      className={`px-3 py-1 border ${
        rating === value ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
      } rounded-md`}
    >
      {value}
    </button>
  ));

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-sm mx-auto">
      <div className="bg-gray-100 p-4 rounded-md mb-4">
        <p className="text-left text-sm text-gray-700 space-y-3">
          <p>
            <strong>Start:</strong> {toLocalTime(block.start_time).toLocaleString()}
          </p>
          <p>
            <strong>Category:</strong> {category?.title || 'Unknown'}
          </p>
          <p>
            <strong>Goal:</strong> {goal ? `${goal.block_size} minutes x ${goal.quantity}` : 'Unknown'}
          </p>
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">End</label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">Rating</label>
        <div className="mt-1 flex justify-between space-x-2">{ratingButtons}</div>
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
          disabled={!isFormChanged}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default StudyBlockEdit;
