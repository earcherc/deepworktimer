// timer-container.tsx
import {
  ApiError,
  DailyGoalsService,
  StudyBlock,
  StudyBlockCreate,
  StudyBlocksService,
  StudyBlockUpdate,
  StudyCategoriesService,
} from '@api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useToast from '@app/context/toasts/toast-context';

import Timer from './timer';
import React from 'react';

const TimerContainer: React.FC = () => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['studyCategories'],
    queryFn: () => StudyCategoriesService.readStudyCategoriesStudyCategoriesGet(),
  });

  const { data: dailyGoalsData, isLoading: isDailyGoalsLoading } = useQuery({
    queryKey: ['dailyGoals'],
    queryFn: () => DailyGoalsService.readDailyGoalsDailyGoalsGet(),
  });

  const { data: studyBlocksData, isLoading: isStudyBlocksLoading } = useQuery({
    queryKey: ['studyBlocks'],
    queryFn: () => StudyBlocksService.readStudyBlocksStudyBlocksGet(),
  });

  const createStudyBlockMutation = useMutation({
    mutationFn: StudyBlocksService.createStudyBlockStudyBlocksPost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['studyBlocks'] });
      addToast({ type: 'success', content: 'Study block created' });
      return data;
    },
    onError: (error: unknown) => {
      let errorMessage = 'Failed to create study block';
      if (error instanceof ApiError) {
        errorMessage = error.body?.detail || errorMessage;
      }
      addToast({ type: 'error', content: errorMessage });
    },
  });

  const updateStudyBlockMutation = useMutation({
    mutationFn: ({ id, block }: { id: number; block: StudyBlockUpdate }) =>
      StudyBlocksService.updateStudyBlockStudyBlocksStudyBlockIdPatch(id, block),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyBlocks'] });
      addToast({ type: 'success', content: 'Study block updated' });
    },
    onError: (error: unknown) => {
      let errorMessage = 'Failed to update study block';
      if (error instanceof ApiError) {
        errorMessage = error.body?.detail || errorMessage;
      }
      addToast({ type: 'error', content: errorMessage });
    },
  });

  if (isCategoriesLoading || isDailyGoalsLoading || isStudyBlocksLoading) {
    return <div>Loading...</div>;
  }

  const activeCategory = categoriesData?.find((cat) => cat.is_active);
  const activeDailyGoal = dailyGoalsData?.find((goal) => goal.is_active);

  const createStudyBlock = async (block: StudyBlockCreate): Promise<StudyBlock> => {
    return createStudyBlockMutation.mutateAsync(block);
  };

  const updateStudyBlock = async (params: { id: number; block: StudyBlockUpdate }): Promise<void> => {
    await updateStudyBlockMutation.mutateAsync(params);
  };

  return (
    <Timer
      activeCategory={activeCategory}
      activeDailyGoal={activeDailyGoal}
      studyBlocksData={studyBlocksData}
      createStudyBlock={createStudyBlock}
      updateStudyBlock={updateStudyBlock}
      addToast={addToast}
    />
  );
};

export default TimerContainer;
