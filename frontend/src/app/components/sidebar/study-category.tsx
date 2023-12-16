'use client';

import React, { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { StudyCategoryType, useAllStudyCategoriesQuery, useUpdateStudyCategoryMutation } from '@/graphql/graphql-types';
import { studyCategoriesAtom } from '@/app/store/atoms';
import { useAtom } from 'jotai';
import useToast from '@/app/context/toasts/toast-context';

const StudyCategory = () => {
  const { addToast } = useToast();
  const [categories, setCategories] = useAtom(studyCategoriesAtom);
  const [{ data }, updateStudyCategory] = useUpdateStudyCategoryMutation();
  const [{ data: queryData, fetching, error }] = useAllStudyCategoriesQuery();

  useEffect(() => {
    if (queryData && queryData.allStudyCategories) {
      setCategories(queryData.allStudyCategories);
    }
  }, [queryData, setCategories]);

  const selectCategory = async (selectedCategory: StudyCategoryType) => {
    if (typeof selectedCategory.id === 'number') {
      try {
        await updateStudyCategory({
          id: selectedCategory.id,
          studyCategory: { ...selectedCategory, selected: true },
        });

        const updatedCategories = categories.map((cat) => ({
          ...cat,
          selected: cat.id === selectedCategory.id,
        }));
        setCategories(updatedCategories);
      } catch (error) {
        console.error('Error updating category:', error);
        addToast({ type: 'error', content: 'Failed to update the category.' });
      }
    } else {
      console.error('Selected category ID is undefined');
      addToast({ type: 'error', content: 'Invalid category selection.' });
    }
  };

  const openCreateCategoryModal = () => {
    // Logic to open the modal
  };

  const selectedCategory = categories.find((cat) => cat.selected);

  return (
    <Menu as="div" className="relative rounded-lg bg-white p-4 shadow sm:p-6">
      <div className="mb-1 flex items-center justify-between">
        <div className="relative">
          <Menu.Button className="flex w-full items-center justify-between rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <h2 className="text-lg font-semibold text-gray-900">Choose Study Category</h2>
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
                {categories.length > 0 ? (
                  categories.map((item) => (
                    <Menu.Item key={item.id}>
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
                  ))
                ) : (
                  <Menu.Item>
                    <div className="block w-full px-4 py-2 text-left text-sm text-gray-500">No Categories</div>
                  </Menu.Item>
                )}
              </div>
            </Menu.Items>
          </Transition>
        </div>
        <button
          onClick={openCreateCategoryModal}
          className="ml-4 rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Add new category" // Accessibility label for screen readers
        >
          <PlusIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      {selectedCategory && (
        <div className="mt-4 space-y-2">
          <div className="text-center text-2xl font-bold text-gray-900">{selectedCategory.title}</div>
        </div>
      )}
    </Menu>
  );
};

export default StudyCategory;
