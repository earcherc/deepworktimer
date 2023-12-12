import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: any; output: any };
};

export type CombinedMutation = {
  __typename?: 'CombinedMutation';
  createDailyGoal: DailyGoalType;
  createStudyBlock: StudyBlockType;
  createStudyCategory: StudyCategoryType;
  deleteDailyGoal: Scalars['Boolean']['output'];
  deleteStudyBlock: Scalars['Boolean']['output'];
  deleteStudyCategory: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  updateDailyGoal: DailyGoalType;
  updateStudyBlock: StudyBlockType;
  updateStudyCategory: StudyCategoryType;
  updateUser: UserType;
};

export type CombinedMutationCreateDailyGoalArgs = {
  dailyGoal: DailyGoalInput;
};

export type CombinedMutationCreateStudyBlockArgs = {
  studyBlock: StudyBlockInput;
};

export type CombinedMutationCreateStudyCategoryArgs = {
  studyCategory: StudyCategoryInput;
};

export type CombinedMutationDeleteDailyGoalArgs = {
  id: Scalars['Int']['input'];
};

export type CombinedMutationDeleteStudyBlockArgs = {
  id: Scalars['Int']['input'];
};

export type CombinedMutationDeleteStudyCategoryArgs = {
  id: Scalars['Int']['input'];
};

export type CombinedMutationDeleteUserArgs = {
  id: Scalars['Int']['input'];
};

export type CombinedMutationUpdateDailyGoalArgs = {
  dailyGoal: DailyGoalInput;
  id: Scalars['Int']['input'];
};

export type CombinedMutationUpdateStudyBlockArgs = {
  id: Scalars['Int']['input'];
  studyBlock: StudyBlockInput;
};

export type CombinedMutationUpdateStudyCategoryArgs = {
  id: Scalars['Int']['input'];
  studyCategory: StudyCategoryInput;
};

export type CombinedMutationUpdateUserArgs = {
  id: Scalars['Int']['input'];
  user: UserInput;
};

export type DailyGoalInput = {
  blockSize: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
};

export type DailyGoalType = {
  __typename?: 'DailyGoalType';
  blockSize: Scalars['Int']['output'];
  id?: Maybe<Scalars['Int']['output']>;
  quantity: Scalars['Int']['output'];
  userId: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  getDailyGoal?: Maybe<DailyGoalType>;
  getStudyBlock?: Maybe<StudyBlockType>;
  getStudyCategory?: Maybe<StudyCategoryType>;
  getUser?: Maybe<UserType>;
};

export type QueryGetDailyGoalArgs = {
  id: Scalars['ID']['input'];
};

export type QueryGetStudyBlockArgs = {
  id: Scalars['ID']['input'];
};

export type QueryGetStudyCategoryArgs = {
  id: Scalars['ID']['input'];
};

export type StudyBlockInput = {
  dailyGoalId: Scalars['Int']['input'];
  end: Scalars['DateTime']['input'];
  rating: Scalars['Float']['input'];
  start: Scalars['DateTime']['input'];
  studyCategoryId: Scalars['Int']['input'];
  title: Scalars['String']['input'];
  userId: Scalars['Int']['input'];
};

export type StudyBlockType = {
  __typename?: 'StudyBlockType';
  dailyGoalId: Scalars['Int']['output'];
  end: Scalars['DateTime']['output'];
  id?: Maybe<Scalars['Int']['output']>;
  rating: Scalars['Float']['output'];
  start: Scalars['DateTime']['output'];
  studyCategoryId: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  userId: Scalars['Int']['output'];
};

export type StudyCategoryInput = {
  title: Scalars['String']['input'];
};

export type StudyCategoryType = {
  __typename?: 'StudyCategoryType';
  id?: Maybe<Scalars['Int']['output']>;
  title: Scalars['String']['output'];
};

export type UserInput = {
  bio?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type UserType = {
  __typename?: 'UserType';
  bio?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  hashedPassword: Scalars['String']['output'];
  id?: Maybe<Scalars['Int']['output']>;
  username: Scalars['String']['output'];
};

export type GetUserQueryVariables = Exact<{ [key: string]: never }>;

export type GetUserQuery = {
  __typename?: 'Query';
  getUser?: {
    __typename?: 'UserType';
    id?: number | null;
    username: string;
    email: string;
    bio?: string | null;
  } | null;
};

export const GetUserDocument = gql`
  query GetUser {
    getUser {
      id
      username
      email
      bio
    }
  }
`;

export function useGetUserQuery(options?: Omit<Urql.UseQueryArgs<GetUserQueryVariables>, 'query'>) {
  return Urql.useQuery<GetUserQuery, GetUserQueryVariables>({ query: GetUserDocument, ...options });
}
