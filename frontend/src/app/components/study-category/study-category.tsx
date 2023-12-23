'use client';

import { StudyCategoryType, useAllStudyCategoriesQuery, useUpdateStudyCategoryMutation } from '@/graphql/graphql-types';
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/20/solid';
import { useModalContext } from '@/app/context/modal/modal-context';
import useToast from '@/app/context/toasts/toast-context';
import StudyCategoryCreate from './study-category-create';
import { studyCategoriesAtom } from '@/app/store/atoms';
import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, useEffect } from 'react';
import { mapErrors } from '@/libs/error-map';
import classNames from 'classnames';
import { useAtom } from 'jotai';

const StudyCategory = () => {
  const { addToast } = useToast();
  const { showModal } = useModalContext();
  const [categories, setCategories] = useAtom(studyCategoriesAtom);
  const [, updateStudyCategory] = useUpdateStudyCategoryMutation();
  const [{ data: queryData }] = useAllStudyCategoriesQuery();

  useEffect(() => {
    if (queryData && queryData.allStudyCategories) {
      setCategories(queryData.allStudyCategories);
    }
  }, [queryData]);

  const selectCategory = async (selectedCategory: StudyCategoryType) => {
    if (!selectedCategory.id) return;

    const { data, error } = await updateStudyCategory({
      id: selectedCategory.id,
      studyCategory: { selected: true },
    });

    if (error) {
      console.error('Failed to create category:', error);
      const errorMap = mapErrors(error);
      Object.values(errorMap).forEach((errorMessage) => {
        addToast({ type: 'error', content: errorMessage });
      });
    } else if (data) {
      const updatedCategories = categories.map((cat) => ({
        ...cat,
        selected: cat.id === selectedCategory.id,
      }));
      setCategories(updatedCategories);
      addToast({ type: 'success', content: 'Category updated successfully.' });
    } else {
      addToast({ type: 'error', content: 'Failed to update category.' });
    }
  };

  const openCreateCategoryModal = () => {
    showModal({
      type: 'default',
      title: 'Create Study Category',
      content: <StudyCategoryCreate />,
    });
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
          className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlusIcon className="h-5 w-5" />
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
