import { atom } from 'jotai';

export const userAtom = atom<UserStore>({
  isAuthenticated: false,
  user: undefined,
});
