'use client';

import { useRouter } from 'next/navigation';
import { useState, createContext, useEffect } from 'react';

export const AuthContext = createContext<AuthContext | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isDisabled, setIsDisabled] = useState<boolean | null>(null);

  const router = useRouter();

  const setUser = ({ username, userId, isDisabled }: TokenData) => {
    setUsername(username);
    setUserId(userId);
    setIsDisabled(isDisabled);
    setIsAuthenticated(true);
  };

  const clearUser = () => {
    setIsAuthenticated(false);
    setUsername(null);
    setUserId(null);
    setIsDisabled(null);
  };

  const logout = async () => {
    router.push('/');
    await fetch('/api/logout', { method: 'GET' });
    clearUser();
  };

  const isValidUser = (user: TokenData): user is TokenData => {
    return (
      user &&
      typeof user.username === 'string' &&
      typeof user.userId === 'number' &&
      typeof user.isDisabled === 'boolean'
    );
  };

  useEffect(() => {
    const userCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('user='))
      ?.split('=')[1];

    if (userCookie) {
      const user = JSON.parse(decodeURIComponent(userCookie));
      if (isValidUser(user)) {
        setUser(user);
      } else {
        console.error('Invalid user data in cookie:', user);
        clearUser();
      }
    } else {
      clearUser();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, userId, isDisabled, setUser, clearUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
