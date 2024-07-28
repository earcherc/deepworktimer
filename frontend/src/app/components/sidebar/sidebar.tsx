'use client';

import { ApiError, DailyGoal, DailyGoalsService, StudyCategoriesService, StudyCategory } from '@api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { activeComponentsAtom, ComponentName } from '../../store/atoms';
import StudyCategoryComponent from '../study-category/study-category';
import { useModalContext } from '@context/modal/modal-context';
import DailyGoalComponent from '../daily-goal/daily-goal';
import ManageMetadataModal from './manage-metadata-modal';
import React, { useCallback, useEffect } from 'react';
import useToast from '@context/toasts/toast-context';
import { PlusIcon } from '@heroicons/react/20/solid';
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

export default function Sidebar() {
  const { addToast } = useToast();
  const { showModal } = useModalContext();
  const queryClient = useQueryClient();
  const [activeComponents, setActiveComponents] = useAtom(activeComponentsAtom);

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
        is_selected: category.is_selected,
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

    const newActiveComponents: ComponentName[] = [];

    if (dailyGoalsData.some((goal) => goal.is_selected)) {
      newActiveComponents.push('dailyGoal');
    }

    if (categoriesData.some((category) => category.is_selected)) {
      newActiveComponents.push('category');
    }

    setActiveComponents(newActiveComponents);
  }, [categoriesData, dailyGoalsData, setActiveComponents]);

  const toggleComponent = useCallback(
    async (componentName: ComponentName) => {
      if (activeComponents.includes(componentName)) {
        // Remove component
        if (componentName === 'dailyGoal') {
          const activeGoal = dailyGoalsData?.find((goal) => goal.is_selected);
          if (activeGoal) {
            await updateDailyGoalMutation.mutateAsync({ ...activeGoal, is_selected: false });
          }
        } else if (componentName === 'category') {
          const activeCategory = categoriesData?.find((cat) => cat.is_selected);
          if (activeCategory) {
            await updateStudyCategoryMutation.mutateAsync({ ...activeCategory, is_selected: false });
          }
        }
        setActiveComponents((prev) => prev.filter((name) => name !== componentName));
      } else {
        // Add component (no API call, just update local state)
        setActiveComponents((prev) => [...prev, componentName]);
      }
    },
    [
      activeComponents,
      categoriesData,
      dailyGoalsData,
      updateDailyGoalMutation,
      updateStudyCategoryMutation,
      setActiveComponents,
    ],
  );

  const openManageMetadataModal = useCallback(() => {
    showModal({
      type: 'default',
      title: 'Manage Metadata',
      content: (
        <ManageMetadataModal
          onToggle={toggleComponent}
          availableComponents={Object.keys(componentMap) as ComponentName[]}
        />
      ),
    });
  }, [showModal, toggleComponent]);

  return (
    <div className="h-full flex w-1/3 flex-col">
      <div className="flex grow flex-col space-y-4 overflow-y-auto">
        <Timer />
        {activeComponents.map((componentName) => {
          const Component = componentMap[componentName];
          return (
            <div key={componentName} className="relative">
              <Component />
            </div>
          );
        })}
        <button
          onClick={openManageMetadataModal}
          className="w-full rounded-md bg-gray-200 dark:bg-gray-800 p-4 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Metadata
        </button>
      </div>
    </div>
  );
}
