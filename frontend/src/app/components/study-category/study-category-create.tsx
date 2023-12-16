'use cient';

import React, { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useCreateStudyCategoryMutation, StudyCategoryInput } from '@/graphql/graphql-types';
import { useModalContext } from '@/app/context/modal/modal-context';

const StudyCategoryCreate = () => {
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
    try {
      const result = await createStudyCategory({ studyCategory: { title: formData.title } });
      if (result.data && result.data.createStudyCategory) {
        console.log('Category created:', result.data.createStudyCategory);
        reset();
        hideModal();
      } else {
        console.error('Failed to create category:', result.error);
      }
    } catch (error) {
      console.error('Error creating category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Form fields */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Category Title
        </label>
        <div className="mt-1">
          <input
            {...register('title', { required: true })}
            type="text"
            name="title"
            id="title"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter category title"
            disabled={isSubmitting}
          />
          {errors.title && <span className="text-sm text-red-600">This field is required</span>}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create'}
        </button>
        <button
          type="button"
          className="ml-2 inline-flex justify-center rounded-md border border-transparent bg-gray-300 px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          onClick={hideModal}
        >
          Dismiss
        </button>
      </div>
    </form>
  );
};

export default StudyCategoryCreate;
