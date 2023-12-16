'use client';

import React, { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { DailyGoalType } from '@/graphql/graphql-types';

type DailyGoalTypeUI = Pick<DailyGoalType, 'blockSize' | 'quantity' | 'id'>;

const DailyGoal = () => {
  const [goal, setGoal] = useState<DailyGoalTypeUI>({
    id: 1,
    blockSize: 60,
    quantity: 7,
  });

  // Calculate total time based on block size and quantity
  const getTotalTime = (blockSize: number, quantity: number) => {
    const totalMinutes = blockSize * quantity;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}hr ${minutes}min`;
  };

  // Dummy data for dropdown items, adjust as necessary
  const goals: DailyGoalTypeUI[] = [
    { blockSize: 60, quantity: 5, id: 2 },
    { blockSize: 60, quantity: 7, id: 1 },
    { blockSize: 60, quantity: 10, id: 3 },
  ];

  const selectGoal = (selectedGoal: DailyGoalTypeUI) => {
    setGoal(selectedGoal);
  };

  return (
    <Menu as="div" className="relative rounded-lg bg-white p-4 shadow sm:p-6">
      <div className="mb-4">
        <Menu.Button className="flex w-full items-center justify-between rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <h2 className="text-lg font-semibold text-gray-900">Choose Daily Goal</h2>
          <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute z-10 w-full rounded-md bg-white shadow-lg">
          <div className="py-1">
            {goals.map((item, index) => (
              <Menu.Item key={item.id || index}>
                {({ active }) => (
                  <button
                    type="button"
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block w-full px-4 py-2 text-left text-sm',
                    )}
                    onClick={() => selectGoal(item)}
                  >
                    Blocks: {item.quantity} - Size: {item.blockSize / 60}hr - Total:{' '}
                    {getTotalTime(item.blockSize, item.quantity)}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
      <div className="mt-4 space-y-2">
        <div className="text-center text-sm font-medium text-gray-900">Blocks: {goal.quantity}</div>
        <div className="text-center text-sm font-medium text-gray-900">Size: {goal.blockSize / 60}hr</div>
        <div className="text-center text-sm font-medium text-gray-900">
          Total: {getTotalTime(goal.blockSize, goal.quantity)}
        </div>
      </div>
    </Menu>
  );
};

export default DailyGoal;
