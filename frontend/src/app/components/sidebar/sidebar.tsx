'use client';

import { ApiError, DailyGoal, DailyGoalsService, StudyCategoriesService, StudyCategory } from '@api';
import StudyCategoryComponent from '../study-category/study-category';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useModalContext } from '@context/modal/modal-context';
import DailyGoalComponent from '../daily-goal/daily-goal';
import useToast from '@context/toasts/toast-context';
import AddMetadataModal from './add-metadata-modal';
import React, { useState } from 'react';
import Timer from '../timer/timer';

const QUERY_KEYS = {
  studyCategories: 'studyCategories',
  dailyGoals: 'dailyGoals',
  studyBlocks: 'studyBlocks',
  sessionCounters: 'sessionCounters',
  timeSettings: 'timeSettings',
} as const;

type ComponentName = 'timer' | 'dailyGoal' | 'category';

const componentMap: Record<ComponentName, React.ComponentType<{ onRemove?: () => void }>> = {
  timer: Timer,
  dailyGoal: DailyGoalComponent,
  category: StudyCategoryComponent,
};

export default function Sidebar() {
  const { addToast } = useToast();
  const { showModal } = useModalContext();
  const queryClient = useQueryClient();
  const [activeComponents, setActiveComponents] = useState<ComponentName[]>(['timer']);

  const handleMutationError = (operation: string) => (error: unknown) => {
    let errorMessage = `Failed to ${operation}`;
    if (error instanceof ApiError) {
      errorMessage = error.body?.detail || errorMessage;
    }
    addToast({ type: 'error', content: errorMessage });
  };

  const updateDailyGoalMutation = useMutation({
    mutationFn: (goal: DailyGoal) => {
      return DailyGoalsService.updateDailyGoalDailyGoalsDailyGoalIdPatch(goal.id, goal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.dailyGoals] });
    },
    onError: handleMutationError('update daily goal'),
  });

  const updateStudyCategoryMutation = useMutation({
    mutationFn: (category: StudyCategory) => {
      if (category.id === undefined) {
        throw new Error('Category ID is undefined');
      }
      return StudyCategoriesService.updateStudyCategoryStudyCategoriesStudyCategoryIdPatch(category.id, {
        is_selected: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.studyCategories] });
    },
    onError: handleMutationError('update study category'),
  });

  const addComponent = (componentName: ComponentName) => {
    setActiveComponents((prev) => [...prev, componentName]);
  };

  const removeComponent = async (componentName: ComponentName) => {
    setActiveComponents((prev) => prev.filter((name) => name !== componentName));

    // Update backend
    if (componentName === 'dailyGoal') {
      const dailyGoals = await queryClient.fetchQuery<DailyGoal[]>({
        queryKey: [QUERY_KEYS.dailyGoals],
        queryFn: () => DailyGoalsService.readDailyGoalsDailyGoalsGet(),
      });
      const activeGoal = dailyGoals.find((goal) => goal.is_selected);
      if (activeGoal) {
        updateDailyGoalMutation.mutate({ ...activeGoal, is_selected: false });
      }
    } else if (componentName === 'category') {
      const categories = await queryClient.fetchQuery<StudyCategory[]>({
        queryKey: [QUERY_KEYS.studyCategories],
        queryFn: () => StudyCategoriesService.readStudyCategoriesStudyCategoriesGet(),
      });
      const activeCategory = categories.find((cat: StudyCategory) => cat.is_selected);
      if (activeCategory) {
        updateStudyCategoryMutation.mutate(activeCategory);
      }
    }
  };

  const openAddMetadataModal = () => {
    showModal({
      type: 'default',
      title: 'Add Metadata',
      content: (
        <AddMetadataModal
          onAdd={addComponent}
          availableComponents={
            Object.keys(componentMap).filter(
              (name) => !activeComponents.includes(name as ComponentName),
            ) as ComponentName[]
          }
        />
      ),
    });
  };

  return (
    <div className="h-100 flex w-1/3 flex-col">
      <div className="flex grow flex-col overflow-y-auto overflow-x-hidden">
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-4">
            {activeComponents.map((componentName) => {
              const Component = componentMap[componentName];
              return (
                <li key={componentName}>
                  <Component onRemove={() => removeComponent(componentName)} />
                </li>
              );
            })}
            {activeComponents.length < Object.keys(componentMap).length && (
              <li>
                <button
                  onClick={openAddMetadataModal}
                  className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 p-4 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  + Metadata
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}
