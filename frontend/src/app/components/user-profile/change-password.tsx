'use client';

import { ApiError, AuthenticationService } from '@api';
import useToast from '@context/toasts/toast-context';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import classNames from 'classnames';

type FormData = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};

export default function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<FormData>();
  const { addToast } = useToast();

  const changePasswordMutation = useMutation({
    mutationFn: (data: { current_password: string; new_password: string }) =>
      AuthenticationService.changePasswordAuthChangePasswordPost(data),
    onSuccess: () => {
      addToast({ type: 'success', content: 'Password updated successfully' });
      reset();
    },
    onError: (error: unknown) => {
      let errorMessage = 'An error occurred while changing password';
      if (error instanceof ApiError) {
        errorMessage = error.body?.detail || errorMessage;
      }
      addToast({ type: 'error', content: errorMessage });
    },
  });

  const onSubmit = async (data: FormData) => {
    if (data.new_password !== data.confirm_password) {
      addToast({ type: 'error', content: 'Passwords do not match' });
      return;
    }

    changePasswordMutation.mutate({
      current_password: data.current_password,
      new_password: data.new_password,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
        <div className="col-span-full">
          <label
            htmlFor="current-password"
            className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
          >
            Current password
          </label>
          <div className="mt-2">
            <input
              {...register('current_password', { required: 'Current password is required' })}
              id="current-password"
              type="password"
              autoComplete="current-password"
              className="block w-full rounded-md border-0 bg-white py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:ring-gray-700 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="col-span-full">
          <label
            htmlFor="new-password"
            className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
          >
            New password
          </label>
          <div className="mt-2">
            <input
              {...register('new_password', { required: 'New password is required' })}
              id="new-password"
              type="password"
              autoComplete="new-password"
              className="block w-full rounded-md border-0 bg-white py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:ring-gray-700 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="col-span-full">
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
          >
            Confirm password
          </label>
          <div className="mt-2">
            <input
              {...register('confirm_password', { required: 'Please confirm your new password' })}
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              className="block w-full rounded-md border-0 bg-white py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:ring-gray-700 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex">
        <button
          type="submit"
          disabled={!isDirty || changePasswordMutation.isPending}
          title="Modify your data before saving"
          className={classNames(
            'rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
            {
              'bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400':
                isDirty && !changePasswordMutation.isPending,
              'bg-gray-300 cursor-not-allowed': !isDirty || changePasswordMutation.isPending,
            },
          )}
        >
          {changePasswordMutation.isPending ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
