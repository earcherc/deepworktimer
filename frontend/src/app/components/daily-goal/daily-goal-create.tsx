'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useModalContext } from '@context/modal/modal-context';
import { Controller, useForm } from 'react-hook-form';
import useToast from '@context/toasts/toast-context';
import { ApiError, DailyGoalsService } from '@api';

interface FormData {
  hours: number;
  minutes: number;
}

const DailyGoalCreateComponent = () => {
  const { addToast } = useToast();
  const { hideModal } = useModalContext();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    defaultValues: {
      hours: 2,
      minutes: 0,
    },
    mode: 'onChange',
  });

  const createDailyGoalMutation = useMutation({
    mutationFn: (formData: FormData) =>
      DailyGoalsService.createDailyGoalDailyGoalsPost({
        total_minutes: formData.hours * 60 + formData.minutes,
        is_selected: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyGoals'] });
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

  const onSubmit = (data: FormData) => {
    createDailyGoalMutation.mutate(data);
  };

  const validateTotalTime = (hours: number, minutes: number) => {
    return (hours || 0) * 60 + (minutes || 0) > 0 || 'Total time must be at least 1 minute';
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-center space-x-12">
        <Controller
          name="hours"
          control={control}
          rules={{
            required: 'Hours are required',
            min: { value: 0, message: 'Hours must be at least 0' },
            max: { value: 24, message: 'Hours must be at most 24' },
            validate: (value, formValues) => validateTotalTime(value, formValues.minutes),
          }}
          render={({ field }) => (
            <div className="w-16">
              <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                Hours
              </label>
              <input
                type="number"
                {...field}
                onChange={(e) => {
                  field.onChange(e.target.value === '' ? '' : Number(e.target.value));
                  trigger('minutes');
                }}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
          )}
        />
        <Controller
          name="minutes"
          control={control}
          rules={{
            required: 'Minutes are required',
            min: { value: 0, message: 'Minutes must be at least 0' },
            max: { value: 59, message: 'Minutes must be at most 59' },
            validate: (value, formValues) => validateTotalTime(formValues.hours, value),
          }}
          render={({ field }) => (
            <div className="w-16">
              <label htmlFor="minutes" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                Minutes
              </label>
              <input
                type="number"
                {...field}
                onChange={(e) => {
                  field.onChange(e.target.value === '' ? '' : Number(e.target.value));
                  trigger('hours');
                }}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
          )}
        />
      </div>

      {(errors.hours || errors.minutes) && (
        <p className="text-red-500 text-sm text-center mt-2">
          {errors.hours?.message || errors.minutes?.message || 'Invalid input'}
        </p>
      )}

      <div className="mt-5 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        <button
          type="button"
          className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1"
          onClick={hideModal}
        >
          Dismiss
        </button>
        <button
          type="submit"
          className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2"
          disabled={createDailyGoalMutation.isPending}
        >
          {createDailyGoalMutation.isPending ? 'Creating...' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default DailyGoalCreateComponent;
