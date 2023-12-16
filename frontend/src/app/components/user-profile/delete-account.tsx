'use client';

import { userAtom } from '@app/store/atoms';
import { useAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { useDeleteCurrentUserMutation } from '@/graphql/graphql-types';
import { useRouter } from 'next/navigation';
import { useModalContext } from '@/app/context/modal/modal-context';

export default function DeleteAccountForm() {
  const [, setUser] = useAtom(userAtom);
  const [, deleteUser] = useDeleteCurrentUserMutation();
  const Router = useRouter();
  const { showModal, hideModal } = useModalContext();

  const { handleSubmit } = useForm();

  const handleDelete = async () => {
    try {
      const result = await deleteUser({});
      if (result.data && result.data.deleteCurrentUser) {
        hideModal();
        Router.push('/');
        setUser(undefined);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const onSubmit = () => {
    showModal({
      type: 'danger',
      title: 'Confirm Account Deletion',
      message: 'Are you sure you want to delete your account? This action cannot be undone.',
      buttons: [
        {
          text: 'Delete Account',
          onClick: handleDelete,
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
