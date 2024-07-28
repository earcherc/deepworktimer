import { atom } from 'jotai';

export enum TimerMode {
  Countdown = 'Timer',
  OpenSession = 'Open',
}

export type ComponentName = 'dailyGoal' | 'category';

export const timerModeAtom = atom<TimerMode>(TimerMode.Countdown);

export const activeComponentsAtom = atom<ComponentName[]>([]);
