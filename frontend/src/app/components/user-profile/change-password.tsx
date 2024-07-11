'use client';

import useToast from '@app/context/toasts/toast-context';
import { useForm } from 'react-hook-form';

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
    formState: { errors },
  } = useForm<FormData>();
  const { addToast } = useToast();

  const onSubmit = async (data: FormData) => {
    if (data.new_password !== data.confirm_password) {
      console.error('Passwords do not match');
      addToast({ type: 'error', content: 'Passwords do not match' });
      return;
    }

    try {
      const res = await fetch('http://localhost/api/auth/change-password', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: data.current_password,
          new_password: data.new_password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        addToast({ type: 'error', content: errorData.detail });
        return;
      }

      addToast({ type: 'success', content: 'Password updated successfully' });
      reset();
    } catch (error) {
      console.error('Password change error:', error);
      addToast({ type: 'error', content: 'An error occurred while changing password' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
        <div className="col-span-full">
          <label htmlFor="current-password" className="block text-sm font-medium leading-6 text-white">
            Current password
          </label>
          <div className="mt-2">
            <input
              {...register('current_password', { required: 'Current password is required' })}
              id="current-password"
              type="password"
              autoComplete="current-password"
              className="block w-full rounded-md border-0 bg-white/5 pl-2 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="col-span-full">
          <label htmlFor="new-password" className="block text-sm font-medium leading-6 text-white">
            New password
          </label>
          <div className="mt-2">
            <input
              {...register('new_password', { required: 'New password is required' })}
              id="new-password"
              type="password"
              autoComplete="new-password"
              className="block w-full rounded-md border-0 bg-white/5 pl-2 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="col-span-full">
          <label htmlFor="confirm-password" className="block text-sm font-medium leading-6 text-white">
            Confirm password
          </label>
          <div className="mt-2">
            <input
              {...register('confirm_password', { required: 'Please confirm your new password' })}
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              className="block w-full rounded-md border-0 bg-white/5 pl-2 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex">
        <button
          type="submit"
          className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Save
        </button>
      </div>
    </form>
  );
}
