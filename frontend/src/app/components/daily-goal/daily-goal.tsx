'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/20/solid';
import { useModalContext } from '@app/context/modal/modal-context';
import { DailyGoalsService, DailyGoal, ApiError } from '@api';
import useToast from '@app/context/toasts/toast-context';
import { Menu, Transition } from '@headlessui/react';
import DailyGoalCreate from './daily-goal-create';
import classNames from 'classnames';
import React from 'react';

const DailyGoalComp = () => {
  const { addToast } = useToast();
  const { showModal } = useModalContext();
  const queryClient = useQueryClient();

  const { data: goals = [] } = useQuery<DailyGoal[]>({
    queryKey: ['dailyGoals'],
    queryFn: () => DailyGoalsService.readDailyGoalsDailyGoalsGet(),
  });

  const updateDailyGoalMutation = useMutation({
    mutationFn: (goal: DailyGoal) => {
      return DailyGoalsService.updateDailyGoalDailyGoalsDailyGoalIdPatch(goal.id, goal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyGoals'] });
      addToast({ type: 'success', content: 'Goal updated successfully.' });
    },
    onError: (error: unknown) => {
      let errorMessage = 'Failed to update goal';
      if (error instanceof ApiError) {
        errorMessage = error.body?.detail || errorMessage;
      }
      addToast({ type: 'error', content: errorMessage });
    },
  });

  const getTotalTime = (blockSize: number, quantity: number) => {
    const totalMinutes = blockSize * quantity;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}hr ${minutes}min`;
  };

  const selectGoal = (activeGoal: DailyGoal) => {
    updateDailyGoalMutation.mutate({ ...activeGoal, is_active: true });
  };

  const openCreateGoalModal = () => {
    showModal({
      type: 'default',
      title: 'Create Daily Goal',
      content: <DailyGoalCreate />,
    });
  };

  const activeGoal = goals.find((goal) => goal.is_active);

  return (
    <Menu as="div" className="relative rounded-lg bg-white p-4 shadow sm:p-6">
      <div className="mb-1 flex items-center justify-between">
        <div className="relative w-full">
          <Menu.Button className="flex w-full items-center justify-between rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <h2 className="text-lg font-semibold text-gray-900">Choose Daily Goal</h2>
            <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Menu.Button>
          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
              <div className="py-1">
                {goals.length > 0 ? (
                  goals.map((goal) => (
                    <Menu.Item key={goal.id}>
                      {({ active }) => (
                        <button
                          type="button"
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'w-full flex-nowrap px-4 py-2 text-left text-sm',
                          )}
                          onClick={() => selectGoal(goal)}
                        >
                          <span className="font-semibold">Quantity:</span> {goal.quantity},{' '}
                          <span className="font-semibold">Duration:</span> {goal.block_size}m,{' '}
                          <span className="font-semibold">Total:</span> {getTotalTime(goal.block_size, goal.quantity)}
                        </button>
                      )}
                    </Menu.Item>
                  ))
                ) : (
                  <Menu.Item>
                    <div className="block w-full px-4 py-2 text-left text-sm text-gray-500">No Goals</div>
                  </Menu.Item>
                )}
              </div>
            </Menu.Items>
          </Transition>
        </div>
        <button
          onClick={openCreateGoalModal}
          className="ml-3 rounded-md bg-blue-500 p-3 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>
      {activeGoal && (
        <div className="mt-4 space-y-2">
          <div className="text-center text-sm font-medium text-gray-900">Blocks: {activeGoal.quantity}</div>
          <div className="text-center text-sm font-medium text-gray-900">
            Size: {activeGoal.block_size.toFixed(2)} min
          </div>
          <div className="text-center text-sm font-medium text-gray-900">
            Total: {getTotalTime(activeGoal.block_size, activeGoal.quantity)}
          </div>
        </div>
      )}
    </Menu>
  );
};

export default DailyGoalComp;
