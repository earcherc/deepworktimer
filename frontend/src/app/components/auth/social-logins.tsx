'use client';

import useToast from '@context/toasts/toast-context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SocialLogins = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  const handleGithubLogin = async () => {
    setIsLoading(true);
    try {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/github-login`;
    } catch (error) {
      addToast({ type: 'error', content: 'Failed to initiate GitHub login' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Load the Google Sign-In API
      await loadGoogleSignInAPI();

      // Initialize Google Sign-In
      const auth2 = gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn();

      // Get the ID token
      const idToken = googleUser.getAuthResponse().id_token;

      // Send the token to your backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_token: idToken }),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        throw new Error('Google login failed');
      }
    } catch (error) {
      addToast({ type: 'error', content: 'Failed to login with Google' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
          onClick={handleGoogleLogin}
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
  );
};

export default SocialLogins;

// Helper function to load Google Sign-In API
function loadGoogleSignInAPI(): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';
    script.onload = () => {
      gapi.load('auth2', () => {
        gapi.auth2
          .init({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          })
          .then(() => resolve(), reject);
      });
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });
}
