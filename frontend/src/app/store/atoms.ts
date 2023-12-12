import { DailyGoalType, StudyBlockType, StudyCategoryType, UserType } from '@/graphql/graphql-types';
import { atom } from 'jotai';

export const userAtom = atom<UserType | undefined>(undefined);
export const dailyGoalsAtom = atom<DailyGoalType[]>([]);
export const studyBlocksAtom = atom<StudyBlockType[]>([]);
export const studyCategoriesAtom = atom<StudyCategoryType[]>([]);
