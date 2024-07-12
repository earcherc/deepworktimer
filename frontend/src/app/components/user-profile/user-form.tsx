'use client';

import useToast from '@app/context/toasts/toast-context';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UsersService, User, ApiError } from '@api';
import { useEffect } from 'react';

export default function UserForm() {
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: () => UsersService.readCurrentUserUsersMeGet(),
  });

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<Partial<User>>();

  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user, reset]);

  const updateUserMutation = useMutation({
    mutationFn: (data: Partial<User>) => UsersService.updateCurrentUserUsersPatch(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['currentUser'], updatedUser);
      addToast({ type: 'success', content: 'User profile updated successfully.' });
    },
    onError: (error: unknown) => {
      let errorMessage = 'An error occurred while updating the profile';
      if (error instanceof ApiError) {
        errorMessage = error.body?.detail || errorMessage;
      }
      addToast({ type: 'error', content: errorMessage });
    },
  });


  const onSubmit = async (data: Partial<User>) => {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v != null && v !== '')
    );
    updateUserMutation.mutate(filteredData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
        <div className="col-span-3">
          <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-white">
            First Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="firstName"
              {...register('first_name')}
              className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="col-span-3">
          <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-white">
            Last Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="last_name"
              {...register('last_name')}
              className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="col-span-full">
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
            Email address
          </label>
          <div className="mt-2">
            <input
              id="email"
              {...register('email')}
              type="email"
              autoComplete="email"
              className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="col-span-full">
          <label htmlFor="username" className="block text-sm font-medium leading-6 text-white">
            Username
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="username"
              {...register('username')}
              autoComplete="username"
              className=".5 block w-full rounded-md border-0 bg-white/5 py-1 pl-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="col-span-3">
          <label htmlFor="date_of_birth" className="block text-sm font-medium leading-6 text-white">
            Date of Birth
          </label>
          <div className="mt-2">
            <input
              type="date"
              id="date_of_birth"
              {...register('date_of_birth')}
              className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="col-span-3">
          <label htmlFor="gender" className="block text-sm font-medium leading-6 text-white">
            Gender
          </label>
          <div className="mt-2">
            <select
              id="gender"
              {...register('gender')}
              className="block w-full rounded-md border-0 bg-white/5 py-2.5 pl-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
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
          <label htmlFor="bio" className="block text-sm font-medium leading-6 text-white">
            Bio
          </label>
          <div className="mt-2">
            <textarea
              id="bio"
              {...register('bio')}
              className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="col-span-3">
          <label htmlFor="job_title" className="block text-sm font-medium leading-6 text-white">
            Job Title
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="job_title"
              {...register('job_title')}
              className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="col-span-3">
          <label htmlFor="personal_title" className="block text-sm font-medium leading-6 text-white">
            Personal Title
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="personal_title"
              {...register('personal_title')}
              className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="col-span-3">
          <label htmlFor="latitude" className="block text-sm font-medium leading-6 text-white">
            Latitude
          </label>
          <div className="mt-2">
            <input
              type="number"
              id="latitude"
              {...register('latitude')}
              className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="col-span-3">
          <label htmlFor="longitude" className="block text-sm font-medium leading-6 text-white">
            Longitude
          </label>
          <div className="mt-2">
            <input
              type="number"
              id="longitude"
              {...register('longitude')}
              className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="col-span-3">
          <label htmlFor="timezone" className="block text-sm font-medium leading-6 text-white">
            Timezone
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="timezone"
              {...register('timezone')}
              className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="col-span-3">
          <label htmlFor="language" className="block text-sm font-medium leading-6 text-white">
            Language
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="language"
              {...register('language')}
              className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="col-span-full">
          <label htmlFor="status" className="block text-sm font-medium leading-6 text-white">
            Status
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="status"
              {...register('status')}
              className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
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