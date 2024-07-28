import { atom } from 'jotai';

export enum TimerMode {
  Countdown = 'Timer',
  OpenSession = 'Open',
}

export const timerModeAtom = atom<TimerMode>(TimerMode.Countdown);

export type ComponentName = 'dailyGoal' | 'category';

export const visibleComponentsAtom = atom<ComponentName[]>([]);
