'use client';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useState } from 'react';
import useToast from '../context/toasts/toast-context';
import classNames from 'classnames';
import useAuth from '@app/context/auth/auth-context';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { addToast } = useToast();
  const { setUser } = useAuth();

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const { body, status } = await res.json();
    if (status == 200) {
      setUser(body.user);
      router.push('/dashboard');
    } else {
      setErrorMessage(body.detail);
      addToast({ type: 'error', content: body.detail });
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your Journal
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
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
                onInput={(e) => {
                  setUsername(e.currentTarget.value);
                  setErrorMessage(null);
                }}
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
                onInput={(e) => {
                  setPassword(e.currentTarget.value);
                  setErrorMessage(null);
                }}
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
                },
              )}
            >
              Sign in
            </button>
          </div>
        </form>
        {errorMessage && <div className="mt-2 text-red-500">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default LoginForm;
