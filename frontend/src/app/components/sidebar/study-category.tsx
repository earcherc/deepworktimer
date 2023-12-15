'use client';

import React, { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { StudyCategoryType } from '@/graphql/graphql-types';

type StudyCategoryTypeUI = Pick<StudyCategoryType, 'title'>;

const StudyCategory = () => {
  const [category, setCategory] = useState<StudyCategoryTypeUI>({ title: 'Coding' });

  // Dummy data for dropdown items
  const categories: StudyCategoryTypeUI[] = [
    { title: 'Coding' },
    { title: 'Math' },
    { title: 'Science' },
    { title: 'History' },
  ];

  const selectCategory = (selectedCategory: StudyCategoryTypeUI) => {
    setCategory(selectedCategory);
  };

  return (
    <Menu as="div" className="relative rounded-lg bg-white p-4 shadow sm:p-6">
      <div className="mb-4">
        <Menu.Button className="flex w-full items-center justify-between rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <h2 className="text-lg font-semibold text-gray-900">Choose Study Category</h2>
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
            {categories.map((item, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <button
                    type="button"
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block w-full px-4 py-2 text-left text-sm',
                    )}
                    onClick={() => selectCategory(item)}
                  >
                    {item.title}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
      <div className="mt-4 space-y-2">
        <div className="text-center text-2xl font-bold text-gray-900">{category.title}</div>
      </div>
    </Menu>
  );
};

export default StudyCategory;
