'use client';

import { DailyGoalType, useUpdateDailyGoalMutation, useUserDailyGoalsQuery } from '@/graphql/graphql-types';
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/20/solid';
import { useModalContext } from '@/app/context/modal/modal-context';
import useToast from '@/app/context/toasts/toast-context';
import { Menu, Transition } from '@headlessui/react';
import { dailyGoalsAtom } from '@/app/store/atoms';
import React, { Fragment, useEffect } from 'react';
import DailyGoalCreate from './daily-goal-create';
import { mapErrors } from '@/libs/error-map';
import classNames from 'classnames';
import { useAtom } from 'jotai';

const DailyGoal = () => {
  const { addToast } = useToast();
  const { showModal } = useModalContext();
  const [goals, setDailyGoals] = useAtom(dailyGoalsAtom);
  const [, updateDailyGoal] = useUpdateDailyGoalMutation();
  const [{ data: queryData }] = useUserDailyGoalsQuery();

  const getTotalTime = (blockSize: number, quantity: number) => {
    const totalMinutes = blockSize * quantity;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}hr ${minutes}min`;
  };

  useEffect(() => {
    if (queryData && queryData.userDailyGoals) {
      setDailyGoals(queryData.userDailyGoals);
    }
  }, [queryData]);

  const selectGoal = async (selectedGoal: DailyGoalType) => {
    if (!selectedGoal.id) return;

    const { data, error } = await updateDailyGoal({
      id: selectedGoal.id,
      dailyGoal: { isActive: true },
    });

    if (error) {
      console.error('Failed to update goal:', error);
      const errorMap = mapErrors(error);
      Object.values(errorMap).forEach((errorMessage) => {
        addToast({ type: 'error', content: errorMessage });
      });
    } else if (data) {
      const updatedGoals = goals.map((goal) => ({
        ...goal,
        isActive: goal.id === selectedGoal.id,
      }));
      setDailyGoals(updatedGoals);
      addToast({ type: 'success', content: 'Goal updated successfully.' });
    } else {
      addToast({ type: 'error', content: 'Failed to update goal.' });
    }
  };

  const openCreateGoalModal = () => {
    showModal({
      type: 'default',
      title: 'Create Daily Goal',
      content: <DailyGoalCreate />,
    });
  };

  const selectedGoal = goals.find((goal) => goal.isActive);

  return (
    <Menu as="div" className="relative rounded-lg bg-white p-4 shadow sm:p-6">
      <div className="mb-1 flex items-center justify-between">
        <div className="relative">
          <Menu.Button className="flex w-full items-center justify-between rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <h2 className="text-lg font-semibold text-gray-900">Choose Daily Goal</h2>
            <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Menu.Button>
          <Transition
            as={Fragment}
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
                            'block w-full px-4 py-2 text-left text-sm',
                          )}
                          onClick={() => selectGoal(goal)}
                        >
                          <span className="font-semibold">Blocks:</span> {goal.quantity} -
                          <span className="font-semibold"> Size:</span> {goal.blockSize}m -
                          <span className="font-semibold"> Total:</span> {getTotalTime(goal.blockSize, goal.quantity)}
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
          className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>
      {selectedGoal && (
        <div className="mt-4 space-y-2">
          <div className="text-center text-sm font-medium text-gray-900">Blocks: {selectedGoal.quantity}</div>
          <div className="text-center text-sm font-medium text-gray-900">
            Size: {selectedGoal.blockSize.toFixed(2)} min
          </div>
          <div className="text-center text-sm font-medium text-gray-900">
            Total: {getTotalTime(selectedGoal.blockSize, selectedGoal.quantity)}
          </div>
        </div>
      )}
    </Menu>
  );
};

export default DailyGoal;
