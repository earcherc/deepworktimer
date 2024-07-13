'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError, DailyGoalCreate, DailyGoalsService } from '@api';
import { useModalContext } from '@app/context/modal/modal-context';
import useToast from '@app/context/toasts/toast-context';
import { useForm } from 'react-hook-form';

const DailyGoalCreateComponent = () => {
  const { addToast } = useToast();
  const { hideModal } = useModalContext();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DailyGoalCreate>({
    defaultValues: {
      block_size: 60,
      quantity: 2,
    },
  });

  const createDailyGoalMutation = useMutation({
    mutationFn: (formData: DailyGoalCreate) =>
      DailyGoalsService.createDailyGoalDailyGoalsPost({
        quantity: formData.quantity,
        block_size: formData.block_size,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyGoals'] });
      reset();
      hideModal();
    },
    onError: (error: unknown) => {
      let errorMessage = 'Failed to create daily goal';
      if (error instanceof ApiError) {
        errorMessage = error.body?.detail || errorMessage;
      }
      addToast({ type: 'error', content: errorMessage });
    },
  });

  const onSubmit = (formData: DailyGoalCreate) => {
    createDailyGoalMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="blockSize" className="block text-left text-sm font-medium leading-6 text-gray-900">
          Study Cycle Duration (minutes)
        </label>
        <div className="mt-2">
          <input
            {...register('block_size', { required: true, valueAsNumber: true })}
            type="number"
            name="block_size"
            id="block_size"
            className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Enter study block duration (minutes)"
            disabled={createDailyGoalMutation.isPending}
          />
          {errors.block_size && <span className="text-sm text-red-600">This field is required</span>}
        </div>
      </div>

      <div>
        <label htmlFor="quantity" className="block text-left text-sm font-medium leading-6 text-gray-900">
          Study Cycle Count
        </label>
        <div className="mt-2">
          <input
            {...register('quantity', { required: true, valueAsNumber: true })}
            type="number"
            name="quantity"
            id="quantity"
            className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Enter ideal block quantity for day"
            disabled={createDailyGoalMutation.isPending}
          />
          {errors.quantity && <span className="text-sm text-red-600">This field is required</span>}
        </div>
      </div>

      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        <button
          type="submit"
          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
          disabled={createDailyGoalMutation.isPending}
        >
          {createDailyGoalMutation.isPending ? 'Creating...' : 'Create'}
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

export default DailyGoalCreateComponent;
