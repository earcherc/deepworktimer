'use client';

import { ApiError, AuthenticationService } from '@api';
import useToast from '@context/toasts/toast-context';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import classNames from 'classnames';

const RegistrationForm = () => {
  const { addToast } = useToast();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  const registrationMutation = useMutation({
    mutationFn: async (userData: { username: string; email: string; password: string }) => {
      const response = await AuthenticationService.registerAuthRegisterPost(userData);
      return response;
    },
    onSuccess: () => {
      router.push('/login');
      setErrorMessage(null);
    },
    onError: (error: unknown) => {
      let errorMessage = 'An error occurred while registering';
      if (error instanceof ApiError) {
        errorMessage = error.body?.detail || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setErrorMessage(errorMessage);
      addToast({ type: 'error', content: errorMessage });
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    registrationMutation.mutate({ username, email, password });
  };

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
            Username
          </label>
          <div className="mt-2">
            <input
              id="newUsername"
              name="newUsername"
              type="text"
              autoComplete="new-username"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
            Email
          </label>
          <div className="mt-2">
            <input
              id="newEmail"
              name="newEmail"
              type="email"
              autoComplete="new-email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
            Password
          </label>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <button
            disabled={!username || !email || !password || registrationMutation.isPending}
            type="submit"
            className={classNames(
              'flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
              {
                'cursor-not-allowed bg-indigo-300': !username || !email || !password || registrationMutation.isPending,
                'bg-indigo-600 hover:bg-indigo-500': username && email && password && !registrationMutation.isPending,
              },
            )}
          >
            {registrationMutation.isPending ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>
      {errorMessage && <div className="mt-2 text-red-500">{errorMessage}</div>}
    </>
  );
};

export default RegistrationForm;
