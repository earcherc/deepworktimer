import { UserGroupIcon } from '@heroicons/react/20/solid';
import { atom } from 'jotai';

export const userAtom = atom<UserStore>({
  isAuthenticated: false,
  user: undefined,
});
