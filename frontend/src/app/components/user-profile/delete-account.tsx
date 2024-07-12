'use client';

import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useModalContext } from '@app/context/modal/modal-context';
import { UsersService } from '@api';

export default function DeleteAccountForm() {
  const queryClient = useQueryClient();
  const Router = useRouter();
  const { showModal, hideModal } = useModalContext();

  const { handleSubmit } = useForm();

  const deleteUserMutation = useMutation({
    mutationFn: () => UsersService.deleteCurrentUserUsersDelete(),
    onSuccess: () => {
      hideModal();
      queryClient.setQueryData(['currentUser'], null);
      Router.push('/');
    },
    onError: (error: any) => {
      console.error('Error deleting user:', error);
    },
  });

  const onSubmit = () => {
    showModal({
      type: 'danger',
      title: 'Confirm Account Deletion',
      message: 'Are you sure you want to delete your account? This action cannot be undone.',
      buttons: [
        {
          text: 'Delete Account',
          onClick: () => deleteUserMutation.mutate(),
          isPrimary: true,
        },
        {
          text: 'Dismiss',
          onClick: hideModal,
        },
      ],
    });
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