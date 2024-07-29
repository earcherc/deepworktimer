'use client';

import { ApiError, DailyGoal, DailyGoalsService, StudyCategoriesService, StudyCategory } from '@api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ComponentName, visibleComponentsAtom } from '../../store/atoms';
import StudyCategoryComponent from '../study-category/study-category';
import { useModalContext } from '@context/modal/modal-context';
import DailyGoalComponent from '../daily-goal/daily-goal';
import ManageMetadataModal from './manage-metadata-modal';
import React, { useCallback, useEffect } from 'react';
import useToast from '@context/toasts/toast-context';
import Timer from '../timer/timer';
import { useAtom } from 'jotai';

const QUERY_KEYS = {
  studyCategories: 'studyCategories',
  dailyGoals: 'dailyGoals',
  studyBlocks: 'studyBlocks',
  sessionCounters: 'sessionCounters',
  timeSettings: 'timeSettings',
} as const;

const componentMap: Record<ComponentName, React.ComponentType> = {
  dailyGoal: DailyGoalComponent,
  category: StudyCategoryComponent,
};

const componentOrder: ComponentName[] = ['dailyGoal', 'category'];

export default function Sidebar() {
  const { addToast } = useToast();
  const { showModal } = useModalContext();
  const queryClient = useQueryClient();
  const [visibleComponents, setVisibleComponents] = useAtom(visibleComponentsAtom);

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

  const { data: categoriesData } = useQuery<StudyCategory[]>({
    queryKey: [QUERY_KEYS.studyCategories],
    queryFn: () => StudyCategoriesService.readStudyCategoriesStudyCategoriesGet(),
  });

  const { data: dailyGoalsData } = useQuery<DailyGoal[]>({
    queryKey: [QUERY_KEYS.dailyGoals],
    queryFn: () => DailyGoalsService.readDailyGoalsDailyGoalsGet(),
  });

  useEffect(() => {
    if (!dailyGoalsData || !categoriesData) return;

    const newVisibleComponents: ComponentName[] = [];

    if (dailyGoalsData.some((goal) => goal.is_selected)) {
      newVisibleComponents.push('dailyGoal');
    }

    if (categoriesData.some((category) => category.is_selected)) {
      newVisibleComponents.push('category');
    }

    setVisibleComponents((prev) => {
      const combined = [...new Set([...prev, ...newVisibleComponents])];
      return componentOrder.filter((comp) => combined.includes(comp));
    });
  }, [categoriesData, dailyGoalsData, setVisibleComponents]);

  const addComponent = useCallback(
    (componentName: ComponentName) => {
      setVisibleComponents((prev) => {
        if (prev.includes(componentName)) return prev;
        const newComponents = [...prev, componentName];
        return componentOrder.filter((comp) => newComponents.includes(comp));
      });
    },
    [setVisibleComponents],
  );

  const removeComponent = useCallback(
    async (componentName: ComponentName) => {
      if (componentName === 'dailyGoal') {
        const activeGoal = dailyGoalsData?.find((goal) => goal.is_selected);
        if (activeGoal) {
          await updateDailyGoalMutation.mutateAsync({ ...activeGoal, is_selected: false });
        }
      } else if (componentName === 'category') {
        const activeCategory = categoriesData?.find((category) => category.is_selected);
        if (activeCategory) {
          await updateStudyCategoryMutation.mutateAsync(activeCategory);
        }
      }
      setVisibleComponents((prev) => prev.filter((name) => name !== componentName));
    },
    [dailyGoalsData, categoriesData, updateDailyGoalMutation, updateStudyCategoryMutation, setVisibleComponents],
  );

  const openManageMetadataModal = useCallback(() => {
    showModal({
      type: 'default',
      title: 'Manage Metadata',
      message:
        'Enhance work sessions with custom metadata. Add valuable context to each session for deeper insights, or remove for a minimalist approach.',
      content: (
        <ManageMetadataModal onAdd={addComponent} onRemove={removeComponent} availableComponents={componentOrder} />
      ),
    });
  }, [showModal, addComponent, removeComponent]);

  return (
    <div className="h-full flex flex-col space-y-4">
      <Timer />
      {componentOrder.map((componentName) => {
        if (!visibleComponents.includes(componentName)) return null;
        const Component = componentMap[componentName];
        return (
          <div key={componentName} className="relative">
            <Component />
          </div>
        );
      })}
      <button
        onClick={openManageMetadataModal}
        className="w-full rounded-md bg-gray-200 dark:bg-gray-900 p-4 text-gray-700 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center"
      >
        Manage Metadata
      </button>
    </div>
  );
}
