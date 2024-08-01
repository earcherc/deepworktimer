import VerificationContent from '@components/auth/verification-content';
import { Suspense } from 'react';

export default function VerifyEmailPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Suspense fallback={<div>Loading...</div>}>
        <VerificationContent />
      </Suspense>
    </div>
  );
}
