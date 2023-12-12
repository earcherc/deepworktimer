import { atom } from 'jotai';

export const userAtom = atom<UserStore>({
  user: undefined,
});
