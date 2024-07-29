'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createMutationErrorHandler } from '@utils/httpUtils';
import { User, UserUpdate, UsersService } from '@api';
import useToast from '@context/toasts/toast-context';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import debounce from 'lodash/debounce';

export default function UserForm() {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const handleMutationError = createMutationErrorHandler(addToast);

  const { data: user } = useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: () => UsersService.readCurrentUserUsersMeGet(),
  });

  const { register, reset, watch } = useForm<UserUpdate>();

  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user, reset]);

  const updateUserMutation = useMutation({
    mutationFn: (data: UserUpdate) => UsersService.updateCurrentUserUsersPatch(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['currentUser'], updatedUser);
      addToast({ type: 'success', content: 'User profile updated successfully.' });
    },
    onError: handleMutationError('update user profile'),
  });

  const debouncedUpdateFn = useMemo(
    () =>
      debounce((data: UserUpdate) => {
        const filteredData = Object.fromEntries(
          Object.entries(data).filter(([_, value]) => value != null && value !== ''),
        );
        updateUserMutation.mutate(filteredData as UserUpdate);
      }, 1500),
    [updateUserMutation],
  );

  useEffect(() => {
    const subscription = watch((value) => debouncedUpdateFn(value as UserUpdate));
    return () => subscription.unsubscribe();
  }, [watch, debouncedUpdateFn]);

  return (
    <form>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
        <div className="col-span-3">
          <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
            First Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="firstName"
              {...register('first_name')}
              className="block w-full rounded-md border-0 bg-white py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:ring-gray-700 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="col-span-3">
          <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
            Last Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="last_name"
              {...register('last_name')}
              className="block w-full rounded-md border-0 bg-white py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:ring-gray-700 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="col-span-3">
          <label
            htmlFor="date_of_birth"
            className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
          >
            Date of Birth
          </label>
          <div className="mt-2">
            <input
              type="date"
              id="date_of_birth"
              {...register('date_of_birth')}
              className="block w-full rounded-md border-0 bg-white py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:ring-gray-700 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="col-span-3">
          <label htmlFor="gender" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
            Gender
          </label>
          <div className="mt-2">
            <select
              id="gender"
              {...register('gender')}
              className="block w-full rounded-md border-0 bg-white py-2.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:ring-gray-700 sm:text-sm sm:leading-6"
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
              <option value="NOT_SPECIFIED">Not Specified</option>
            </select>
          </div>
        </div>

        <div className="col-span-full">
          <label htmlFor="bio" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
            Bio
          </label>
          <div className="mt-2">
            <textarea
              id="bio"
              {...register('bio')}
              className="block w-full rounded-md border-0 bg-white py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:ring-gray-700 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
