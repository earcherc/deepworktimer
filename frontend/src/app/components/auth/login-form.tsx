'use client';

import { ApiError, AuthenticationService, ResendVerificationEmailRequest } from '@api';
import { handleGoogleLogin, loadGoogleSignInAPI } from './utils';
import { FormEvent, useEffect, useState } from 'react';
import useToast from '@context/toasts/toast-context';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';

const LoginForm = () => {
  const { addToast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadGoogleSignInAPI()
      .then(() => {
        console.log('Google API loaded successfully');
      })
      .catch((error) => {
        console.error('Failed to load Google API:', error);
      });
  }, []);

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

  const handleGithubLogin = async () => {
    setIsLoading(true);
    try {
      window.location.href = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/github-login`;
    } catch (error) {
      addToast({ type: 'error', content: 'Failed to initiate GitHub login' });
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleButtonClick = async () => {
    setIsLoading(true);
    try {
      const accessToken = await handleGoogleLogin();
      const response = await AuthenticationService.googleLoginAuthGoogleLoginPost(accessToken);
      if (response) {
        addToast({ type: 'success', content: 'Successfully logged in with Google' });
        router.push('/dashboard');
      } else {
        throw new Error('Google login failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      addToast({ type: 'error', content: 'Failed to login with Google' });
    } finally {
      setIsLoading(false);
    }
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
            disabled={!username || !password || isLoading}
            type="submit"
            className={classNames(
              'flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600',
              {
                'cursor-not-allowed bg-blue-300': !username || !password || isLoading,
                'bg-blue-600 hover:bg-blue-500': username && password && !isLoading,
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

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div>
            <button
              onClick={handleGithubLogin}
              disabled={isLoading}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Sign in with GitHub</span>
              <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div>
            <button
              onClick={onGoogleButtonClick}
              disabled={isLoading}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Sign in with Google</span>
              <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
