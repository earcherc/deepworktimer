'use client';

import React, { FormEvent, useState } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import useToast from '../context/toasts/toast-context';

const RegistrationForm = () => {
  const { addToast } = useToast();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setErrorMessage(errorData.detail);
        addToast({ type: 'error', content: errorData.detail });
        return;
      }

      const userData = await res.json();

      router.push('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage('An error occurred while registering.');
      addToast({ type: 'error', content: 'An error occurred while registering.' });
    }
  };

  return (
    <>
      {errorMessage && <div className="mt-2 text-red-500">{errorMessage}</div>}
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
              onInput={(e) => {
                setEmail(e.currentTarget.value);
                setErrorMessage(null);
              }}
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
            disabled={!username || !email || !password}
            type="submit"
            className={classNames(
              'flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
              {
                'cursor-not-allowed bg-indigo-300': !username || !email || !password,
                'bg-indigo-600 hover:bg-indigo-500': username && email && password,
              },
            )}
          >
            Register
          </button>
        </div>
      </form>
    </>
  );
};

export default RegistrationForm;
