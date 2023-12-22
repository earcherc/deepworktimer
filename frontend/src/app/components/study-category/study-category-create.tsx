'use client';

import { useModalContext } from '@/app/context/modal/modal-context';
import useToast from '@/app/context/toasts/toast-context';
import { studyCategoriesAtom } from '@/app/store/atoms';
import { StudyCategoryInput, useCreateStudyCategoryMutation } from '@/graphql/graphql-types';
import { mapErrors } from '@/libs/error-map';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const StudyCategoryCreate = () => {
  const { addToast } = useToast();
  const [, setCategories] = useAtom(studyCategoriesAtom);
  const { hideModal } = useModalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, createStudyCategory] = useCreateStudyCategoryMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: '',
    },
  });

  const onSubmit = async (formData: StudyCategoryInput) => {
    setIsSubmitting(true);
    const { data, error } = await createStudyCategory({ studyCategory: { title: formData.title } });

    if (error) {
      console.error('Failed to create category:', error);
      const errorMap = mapErrors(error);
      Object.values(errorMap).forEach((errorMessage) => {
        addToast({ type: 'error', content: errorMessage });
      });
    } else if (data?.createStudyCategory) {
      setCategories((prevCategories) => [...prevCategories, data.createStudyCategory]);
      reset();
      hideModal();
      addToast({ type: 'success', content: 'Category created successfully.' });
    } else {
      addToast({ type: 'error', content: 'Failed to create category.' });
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-left text-sm font-medium leading-6 text-gray-900">
          Category Title
        </label>
        <div className="mt-2">
          <input
            {...register('title', { required: true })}
            type="text"
            name="title"
            id="title"
            className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Enter category title"
            disabled={isSubmitting}
          />
          {errors.title && <span className="text-sm text-red-600">This field is required</span>}
        </div>
      </div>
      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        <button
          type="submit"
          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create'}
        </button>
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
          onClick={hideModal}
        >
          Dismiss
        </button>
      </div>
    </form>
  );
};

export default StudyCategoryCreate;
