'use client';

import { userAtom } from '@/app/store/atoms';
import { UserInput, useUpdateCurrentUserMutation } from '@/graphql/graphql-types';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function DeleteAccountForm() {
  const [user, setUser] = useAtom(userAtom);
  const [updateUserResult, updateUser] = useUpdateCurrentUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserInput>({
    defaultValues: {
      email: '',
      username: '',
      bio: '',
    },
  });

  useEffect(() => {
    reset({
      email: user?.email || '',
      username: user?.username || '',
      bio: user?.bio || '',
    });
  }, [user, reset]);

  const onSubmit = async (data: UserInput) => {
    try {
      const result = await updateUser({ user: data });
      if (result.data) {
        setUser(result.data.updateCurrentUser);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <button
        type="submit"
        className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400"
      >
        Yes, delete my account
      </button>
    </form>
  );
}
