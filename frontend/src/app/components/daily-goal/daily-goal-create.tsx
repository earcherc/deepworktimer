'use client';

import { useCreateDailyGoalMutation } from '@/graphql/graphql-types';
import { useModalContext } from '@/app/context/modal/modal-context';
import useToast from '@/app/context/toasts/toast-context';
import { dailyGoalsAtom } from '@/app/store/atoms';
import { mapErrors } from '@/libs/error-map';
import { useForm } from 'react-hook-form';
import React, { useState } from 'react';
import { useAtom } from 'jotai';

interface FormData {
  quantity: string;
  blockSize: string;
}

const DailyGoalCreate = () => {
  const { addToast } = useToast();
  const [, setDailyGoals] = useAtom(dailyGoalsAtom);
  const { hideModal } = useModalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, createDailyGoal] = useCreateDailyGoalMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      quantity: '0',
      blockSize: '0',
    },
  });

  const onSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    const { data, error } = await createDailyGoal({
      dailyGoal: {
        quantity: Number(formData.quantity),
        blockSize: Number(formData.blockSize),
        isActive: false,
      },
    });

    if (error) {
      console.error('Failed to create daily goal:', error);
      const errorMap = mapErrors(error);
      Object.values(errorMap).forEach((errorMessage) => {
        addToast({ type: 'error', content: errorMessage });
      });
    } else if (data?.createDailyGoal) {
      setDailyGoals((prevGoals) => [...prevGoals, data.createDailyGoal]);
      reset();
      hideModal();
      addToast({ type: 'success', content: 'Daily goal created successfully.' });
    } else {
      addToast({ type: 'error', content: 'Failed to create daily goal.' });
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="blockSize" className="block text-left text-sm font-medium leading-6 text-gray-900">
          Block Size
        </label>
        <div className="mt-2">
          <input
            {...register('blockSize', { required: true, valueAsNumber: true })}
            type="number"
            name="blockSize"
            id="blockSize"
            className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Enter study block duration (minutes)"
            disabled={isSubmitting}
          />
          {errors.blockSize && <span className="text-sm text-red-600">This field is required</span>}
        </div>
      </div>

      <div>
        <label htmlFor="quantity" className="block text-left text-sm font-medium leading-6 text-gray-900">
          Goal Quantity
        </label>
        <div className="mt-2">
          <input
            {...register('quantity', { required: true, valueAsNumber: true })}
            type="number"
            name="quantity"
            id="quantity"
            className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Enter ideal block quantity for day"
            disabled={isSubmitting}
          />
          {errors.quantity && <span className="text-sm text-red-600">This field is required</span>}
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

export default DailyGoalCreate;
