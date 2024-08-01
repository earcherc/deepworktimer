'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ApiError, AuthenticationService } from '@api';
import { useEffect, useState } from 'react';

export default function VerifyEmailPage() {
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setVerificationStatus('error');
        setErrorMessage('No verification token provided');
        return;
      }

      try {
        await AuthenticationService.verifyEmailAuthVerifyEmailPost({ token });
        setVerificationStatus('success');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } catch (error) {
        setVerificationStatus('error');
        if (error instanceof ApiError) {
          setErrorMessage(error.body?.detail || 'An error occurred during email verification');
        } else {
          setErrorMessage('An unexpected error occurred');
        }
      }
    };

    verifyEmail();
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg">
        {verificationStatus === 'loading' && <p className="text-xl text-gray-600">Verifying your email...</p>}
        {verificationStatus === 'success' && (
          <div>
            <p className="text-xl text-green-600 mb-4">Your email has been successfully verified!</p>
            <p className="text-gray-600">Redirecting you to the login page...</p>
          </div>
        )}
        {verificationStatus === 'error' && (
          <div>
            <p className="text-xl text-red-600 mb-4">Email verification failed</p>
            <p className="text-gray-600">{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
