'use client';

import React, { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useAtom } from 'jotai';
import { userAtom } from '../store/atoms';

type ComponentType<P = {}> = React.ComponentType<P>;

// Specify that P extends the props of a standard React component
export default function isAuth<P extends React.PropsWithChildren<{}>>(Component: ComponentType<P>): ComponentType<P> {
  return function IsAuth(props: P) {
    const [user] = useAtom(userAtom);

    useEffect(() => {
      if (!user.isAuthenticated) {
        redirect('/');
      }
    }, [user.isAuthenticated]);

    if (!user.isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}
