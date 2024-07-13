'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, StudyCategoriesService, StudyCategory } from '@api';
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/20/solid';
import { useModalContext } from '@app/context/modal/modal-context';
import StudyCategoryCreate from './study-category-create';
import useToast from '@app/context/toasts/toast-context';
import { Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';
import React from 'react';

const StudyCategoryComponent = () => {
  const { addToast } = useToast();
  const { showModal } = useModalContext();
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery<StudyCategory[]>({
    queryKey: ['studyCategories'],
    queryFn: () => StudyCategoriesService.readStudyCategoriesStudyCategoriesGet(),
  });

  const updateStudyCategoryMutation = useMutation({
    mutationFn: (category: StudyCategory) => {
      if (category.id === undefined) {
        throw new Error('Category ID is undefined');
      }
      return StudyCategoriesService.updateStudyCategoryStudyCategoriesStudyCategoryIdPatch(category.id, {
        is_active: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyCategories'] });
    },
    onError: (error: unknown) => {
      let errorMessage = 'Failed to update category';
      if (error instanceof ApiError) {
        errorMessage = error.body?.detail || errorMessage;
      }
      addToast({ type: 'error', content: errorMessage });
    },
  });

  const selectCategory = (selectedCategory: StudyCategory) => {
    updateStudyCategoryMutation.mutate(selectedCategory);
  };

  const openCreateCategoryModal = () => {
    showModal({
      type: 'default',
      title: 'Create Study Category',
      content: <StudyCategoryCreate />,
    });
  };

  const activeCategory = categories.find((cat) => cat.is_active);

  return (
    <Menu as="div" className="relative rounded-lg bg-white p-4 shadow sm:p-6">
      <div className="mb-1 flex items-center justify-between">
        <div className="relative w-full">
          <Menu.Button className="flex w-full items-center justify-between rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <h2 className="text-lg font-semibold text-gray-900">Choose Study Category</h2>
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
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <Menu.Item key={category.id}>
                      {({ active }) => (
                        <button
                          type="button"
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block w-full px-4 py-2 text-left text-sm',
                          )}
                          onClick={() => selectCategory(category)}
                        >
                          {category.title}
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
          className="ml-3 rounded-md bg-blue-500 p-3 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>
      {activeCategory && (
        <div className="mt-4 space-y-2">
          <div className="text-center text-2xl font-bold text-gray-900">{activeCategory.title}</div>
        </div>
      )}
    </Menu>
  );
};

export default StudyCategoryComponent;
