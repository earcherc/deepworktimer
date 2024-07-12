'use client';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useState } from 'react';
import useToast from '../context/toasts/toast-context';
import classNames from 'classnames';
import { useMutation } from '@tanstack/react-query';
import { ApiError, AuthenticationService } from '@api';

const LoginForm = () => {
  const { addToast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await AuthenticationService.loginAuthLoginPost(credentials);
      return response;
    },
    onSuccess: () => {
      router.push('/dashboard');
    setErrorMessage(null);
    },
    onError: (error: unknown) => {
      let errorMessage = 'An error occurred while logging in';
      if (error instanceof ApiError) {
        errorMessage = error.body?.detail || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setErrorMessage(errorMessage); // Store the error message
      addToast({ type: 'error', content: errorMessage });
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
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
              id="username"
              name="username"
              type="username"
              autoComplete="username"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              Password
            </label>
          </div>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <button
            disabled={!username || !password}
            type="submit"
            className={classNames(
              'flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
              {
                'cursor-not-allowed bg-indigo-300': !username || !password,
                'bg-indigo-600 hover:bg-indigo-500': username && password,
              }
            )}
          >
            Sign in
          </button>
        </div>
      </form>
      {errorMessage && (
        <div className="mt-2 text-red-500">{errorMessage}</div>
      )}
    </>
  );
};

export default LoginForm;
