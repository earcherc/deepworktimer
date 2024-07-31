'use client';

import { ApiError, AuthenticationService, ResendVerificationEmailRequest } from '@api';
import useToast from '@context/toasts/toast-context';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import SocialLogins from './social-logins';
import classNames from 'classnames';

const LoginForm = () => {
  const { addToast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showResendVerification, setShowResendVerification] = useState(false);
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
        if (errorMessage === 'Email not verified') {
          setShowResendVerification(true);
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setErrorMessage(errorMessage);
      addToast({ type: 'error', content: errorMessage });
    },
  });

  const resendVerificationMutation = useMutation({
    mutationFn: async (email: string) => {
      const request: ResendVerificationEmailRequest = { email };
      return AuthenticationService.resendVerificationEmailAuthResendVerificationEmailPost(request);
    },
    onSuccess: () => {
      addToast({ type: 'success', content: 'Verification email sent. Please check your inbox.' });
      setShowResendVerification(false);
    },
    onError: (error: unknown) => {
      let errorMessage = 'Failed to resend verification email';
      if (error instanceof ApiError) {
        errorMessage = error.body?.detail || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      addToast({ type: 'error', content: errorMessage });
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  const handleResendVerification = () => {
    resendVerificationMutation.mutate(username);
  };

  return (
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
              onChange={(e) => setUsername(e.target.value)}
              required
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <button
            disabled={!username || !password || loginMutation.isPending}
            type="submit"
            className={classNames(
              'flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600',
              {
                'cursor-not-allowed bg-blue-300': !username || !password || loginMutation.isPending,
                'bg-blue-600 hover:bg-blue-500': username && password && !loginMutation.isPending,
              },
            )}
          >
            Sign in
          </button>
        </div>
      </form>

      {errorMessage && <div className="mt-2 text-red-500">{errorMessage}</div>}

      {showResendVerification && (
        <div className="mt-4">
          <p>Your email is not verified. Would you like to resend the verification email?</p>
          <button onClick={handleResendVerification} className="mt-2 text-blue-600 hover:text-blue-800">
            Resend Verification Email
          </button>
        </div>
      )}

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <SocialLogins />
      </div>
    </div>
  );
};

export default LoginForm;
