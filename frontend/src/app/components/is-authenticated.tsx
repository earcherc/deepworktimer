'use client';

import React, { useEffect, useState } from 'react';
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
        try {
          const response = await fetch('http://localhost/api/auth/validate-session', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          console.log('Session validation response:', data); // Add logging

          if (data.user) {
            setUser({ user: data.user });
          } else {
            console.log('Redirecting to login - No user data'); // Add logging
            setUser({ user: undefined });
            router.push('/login');
          }
        } catch (error) {
          console.error('Error validating session:', error);
          setUser({ user: undefined });
          router.push('/login');
        }
      };

      if (!user.user) {
        validateSession();
      }
    }, [router]);

    return <Component {...props} />;
  };
}
