'use client';

import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../store/atoms';
import { useRouter } from 'next/navigation';

type ComponentType<P = {}> = React.ComponentType<P>;

export default function isAuth<P extends React.PropsWithChildren<{}>>(Component: ComponentType<P>): ComponentType<P> {
  return function IsAuth(props: P) {
    const [user, setUser] = useAtom(userAtom);
    const router = useRouter();

    useEffect(() => {
      const validateSession = async () => {
        const sessionId = document.cookie.split('; ').find((row) => row.startsWith('session_id='));
        if (!sessionId) {
          setUser({ isAuthenticated: false });
          router.push('/login');
          return;
        }

        try {
          const response = await fetch('http://localhost:8000/auth/validate-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId.split('=')[1] }),
          });
          const data = await response.json();

          if (data.isValid) {
            setUser({ isAuthenticated: true });
          } else {
            setUser({ isAuthenticated: false });
            router.push('/login');
          }
        } catch (error) {
          console.error('Error validating session:', error);
          setUser({ isAuthenticated: false });
          router.push('/login');
        }
      };

      // Check authentication state only if it's undefined
      if (user.isAuthenticated === undefined) {
        validateSession();
      }
    }, [user.isAuthenticated, setUser, router]);

    // Conditional rendering based on authentication state
    if (user.isAuthenticated === undefined) {
      return null; // or a loading indicator
    } else if (!user.isAuthenticated) {
      return null; // User will be redirected to /login
    }

    return <Component {...props} />;
  };
}
