import { atom } from 'jotai';

export enum TimerMode {
  Countdown = 'Timer',
  OpenSession = 'Open',
}

export const timerModeAtom = atom<TimerMode>(TimerMode.Countdown);
