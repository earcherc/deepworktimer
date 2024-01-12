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
  Date: { input: any; output: any };
  DateTime: { input: any; output: any };
};

export type CombinedMutation = {
  __typename?: 'CombinedMutation';
  createDailyGoal: DailyGoalType;
  createStudyBlock: StudyBlockType;
  createStudyCategory: StudyCategoryType;
  deleteCurrentUser: Scalars['Boolean']['output'];
  deleteDailyGoal: Scalars['Boolean']['output'];
  deleteStudyBlock: Scalars['Boolean']['output'];
  deleteStudyCategory: Scalars['Boolean']['output'];
  updateCurrentUser: UserType;
  updateDailyGoal: DailyGoalType;
  updateStudyBlock: StudyBlockType;
  updateStudyCategory: StudyCategoryType;
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

export type CombinedMutationUpdateCurrentUserArgs = {
  user: UserInput;
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

export type DailyGoalInput = {
  blockSize?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
};

export type DailyGoalType = {
  __typename?: 'DailyGoalType';
  blockSize: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  id?: Maybe<Scalars['Int']['output']>;
  isActive: Scalars['Boolean']['output'];
  quantity: Scalars['Int']['output'];
  userId: Scalars['Int']['output'];
};

export enum Gender {
  FEMALE = 'FEMALE',
  MALE = 'MALE',
  NOT_SPECIFIED = 'NOT_SPECIFIED',
  OTHER = 'OTHER',
}

export type Query = {
  __typename?: 'Query';
  currentUser?: Maybe<UserType>;
  userDailyGoals: Array<DailyGoalType>;
  userStudyBlocks: Array<StudyBlockType>;
  userStudyCategories: Array<StudyCategoryType>;
};

export type StudyBlockInput = {
  dailyGoalId?: InputMaybe<Scalars['Int']['input']>;
  end?: InputMaybe<Scalars['String']['input']>;
  isCountdown?: InputMaybe<Scalars['Boolean']['input']>;
  rating?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
  studyCategoryId?: InputMaybe<Scalars['Int']['input']>;
};

export type StudyBlockType = {
  __typename?: 'StudyBlockType';
  dailyGoalId: Scalars['Int']['output'];
  end?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  isCountdown: Scalars['Boolean']['output'];
  rating?: Maybe<Scalars['Float']['output']>;
  start: Scalars['DateTime']['output'];
  studyCategoryId: Scalars['Int']['output'];
  userId: Scalars['Int']['output'];
};

export type StudyCategoryInput = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type StudyCategoryType = {
  __typename?: 'StudyCategoryType';
  id?: Maybe<Scalars['Int']['output']>;
  isActive: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  userId: Scalars['Int']['output'];
};

export type UserInput = {
  bio?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Gender>;
  jobTitle?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  personalTitle?: InputMaybe<Scalars['String']['input']>;
  profilePhotoUrl?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type UserType = {
  __typename?: 'UserType';
  bio?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  dateOfBirth?: Maybe<Scalars['Date']['output']>;
  email: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Gender>;
  id?: Maybe<Scalars['Int']['output']>;
  jobTitle?: Maybe<Scalars['String']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  personalTitle?: Maybe<Scalars['String']['output']>;
  profilePhotoUrl?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  timezone?: Maybe<Scalars['String']['output']>;
  username: Scalars['String']['output'];
};

export type CreateDailyGoalMutationVariables = Exact<{
  dailyGoal: DailyGoalInput;
}>;

export type CreateDailyGoalMutation = {
  __typename?: 'CombinedMutation';
  createDailyGoal: {
    __typename?: 'DailyGoalType';
    id?: number | null;
    quantity: number;
    blockSize: number;
    createdAt: any;
    isActive: boolean;
    userId: number;
  };
};

export type UpdateDailyGoalMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  dailyGoal: DailyGoalInput;
}>;

export type UpdateDailyGoalMutation = {
  __typename?: 'CombinedMutation';
  updateDailyGoal: {
    __typename?: 'DailyGoalType';
    id?: number | null;
    quantity: number;
    blockSize: number;
    createdAt: any;
    isActive: boolean;
    userId: number;
  };
};

export type DeleteDailyGoalMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;

export type DeleteDailyGoalMutation = { __typename?: 'CombinedMutation'; deleteDailyGoal: boolean };

export type CreateStudyBlockMutationVariables = Exact<{
  studyBlock: StudyBlockInput;
}>;

export type CreateStudyBlockMutation = {
  __typename?: 'CombinedMutation';
  createStudyBlock: {
    __typename?: 'StudyBlockType';
    id?: number | null;
    start: any;
    end?: any | null;
    rating?: number | null;
    isCountdown: boolean;
    userId: number;
    dailyGoalId: number;
    studyCategoryId: number;
  };
};

export type UpdateStudyBlockMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  studyBlock: StudyBlockInput;
}>;

export type UpdateStudyBlockMutation = {
  __typename?: 'CombinedMutation';
  updateStudyBlock: {
    __typename?: 'StudyBlockType';
    id?: number | null;
    start: any;
    end?: any | null;
    rating?: number | null;
    isCountdown: boolean;
    userId: number;
    dailyGoalId: number;
    studyCategoryId: number;
  };
};

export type DeleteStudyBlockMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;

export type DeleteStudyBlockMutation = { __typename?: 'CombinedMutation'; deleteStudyBlock: boolean };

export type CreateStudyCategoryMutationVariables = Exact<{
  studyCategory: StudyCategoryInput;
}>;

export type CreateStudyCategoryMutation = {
  __typename?: 'CombinedMutation';
  createStudyCategory: {
    __typename?: 'StudyCategoryType';
    id?: number | null;
    title: string;
    isActive: boolean;
    userId: number;
  };
};

export type UpdateStudyCategoryMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  studyCategory: StudyCategoryInput;
}>;

export type UpdateStudyCategoryMutation = {
  __typename?: 'CombinedMutation';
  updateStudyCategory: {
    __typename?: 'StudyCategoryType';
    id?: number | null;
    title: string;
    isActive: boolean;
    userId: number;
  };
};

export type DeleteStudyCategoryMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;

export type DeleteStudyCategoryMutation = { __typename?: 'CombinedMutation'; deleteStudyCategory: boolean };

export type UpdateCurrentUserMutationVariables = Exact<{
  user: UserInput;
}>;

export type UpdateCurrentUserMutation = {
  __typename?: 'CombinedMutation';
  updateCurrentUser: {
    __typename?: 'UserType';
    id?: number | null;
    username: string;
    email: string;
    bio?: string | null;
    jobTitle?: string | null;
    personalTitle?: string | null;
    dateOfBirth?: any | null;
    latitude?: number | null;
    longitude?: number | null;
    firstName?: string | null;
    lastName?: string | null;
    gender?: Gender | null;
    profilePhotoUrl?: string | null;
    timezone?: string | null;
    language?: string | null;
    status?: string | null;
    createdAt: any;
  };
};

export type DeleteCurrentUserMutationVariables = Exact<{ [key: string]: never }>;

export type DeleteCurrentUserMutation = { __typename?: 'CombinedMutation'; deleteCurrentUser: boolean };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never }>;

export type CurrentUserQuery = {
  __typename?: 'Query';
  currentUser?: {
    __typename?: 'UserType';
    id?: number | null;
    username: string;
    email: string;
    bio?: string | null;
    jobTitle?: string | null;
    personalTitle?: string | null;
    dateOfBirth?: any | null;
    latitude?: number | null;
    longitude?: number | null;
    firstName?: string | null;
    lastName?: string | null;
    gender?: Gender | null;
    profilePhotoUrl?: string | null;
    timezone?: string | null;
    language?: string | null;
    status?: string | null;
    createdAt: any;
  } | null;
};

export type UserDailyGoalsQueryVariables = Exact<{ [key: string]: never }>;

export type UserDailyGoalsQuery = {
  __typename?: 'Query';
  userDailyGoals: Array<{
    __typename?: 'DailyGoalType';
    id?: number | null;
    quantity: number;
    blockSize: number;
    createdAt: any;
    isActive: boolean;
    userId: number;
  }>;
};

export type UserStudyBlocksQueryVariables = Exact<{ [key: string]: never }>;

export type UserStudyBlocksQuery = {
  __typename?: 'Query';
  userStudyBlocks: Array<{
    __typename?: 'StudyBlockType';
    id?: number | null;
    start: any;
    end?: any | null;
    rating?: number | null;
    isCountdown: boolean;
    studyCategoryId: number;
    dailyGoalId: number;
    userId: number;
  }>;
};

export type UserStudyCategoriesQueryVariables = Exact<{ [key: string]: never }>;

export type UserStudyCategoriesQuery = {
  __typename?: 'Query';
  userStudyCategories: Array<{
    __typename?: 'StudyCategoryType';
    id?: number | null;
    title: string;
    isActive: boolean;
    userId: number;
  }>;
};

export const CreateDailyGoalDocument = gql`
  mutation CreateDailyGoal($dailyGoal: DailyGoalInput!) {
    createDailyGoal(dailyGoal: $dailyGoal) {
      id
      quantity
      blockSize
      createdAt
      isActive
      userId
    }
  }
`;

export function useCreateDailyGoalMutation() {
  return Urql.useMutation<CreateDailyGoalMutation, CreateDailyGoalMutationVariables>(CreateDailyGoalDocument);
}
export const UpdateDailyGoalDocument = gql`
  mutation UpdateDailyGoal($id: Int!, $dailyGoal: DailyGoalInput!) {
    updateDailyGoal(id: $id, dailyGoal: $dailyGoal) {
      id
      quantity
      blockSize
      createdAt
      isActive
      userId
    }
  }
`;

export function useUpdateDailyGoalMutation() {
  return Urql.useMutation<UpdateDailyGoalMutation, UpdateDailyGoalMutationVariables>(UpdateDailyGoalDocument);
}
export const DeleteDailyGoalDocument = gql`
  mutation DeleteDailyGoal($id: Int!) {
    deleteDailyGoal(id: $id)
  }
`;

export function useDeleteDailyGoalMutation() {
  return Urql.useMutation<DeleteDailyGoalMutation, DeleteDailyGoalMutationVariables>(DeleteDailyGoalDocument);
}
export const CreateStudyBlockDocument = gql`
  mutation CreateStudyBlock($studyBlock: StudyBlockInput!) {
    createStudyBlock(studyBlock: $studyBlock) {
      id
      start
      end
      rating
      isCountdown
      userId
      dailyGoalId
      studyCategoryId
    }
  }
`;

export function useCreateStudyBlockMutation() {
  return Urql.useMutation<CreateStudyBlockMutation, CreateStudyBlockMutationVariables>(CreateStudyBlockDocument);
}
export const UpdateStudyBlockDocument = gql`
  mutation UpdateStudyBlock($id: Int!, $studyBlock: StudyBlockInput!) {
    updateStudyBlock(id: $id, studyBlock: $studyBlock) {
      id
      start
      end
      rating
      isCountdown
      userId
      dailyGoalId
      studyCategoryId
    }
  }
`;

export function useUpdateStudyBlockMutation() {
  return Urql.useMutation<UpdateStudyBlockMutation, UpdateStudyBlockMutationVariables>(UpdateStudyBlockDocument);
}
export const DeleteStudyBlockDocument = gql`
  mutation DeleteStudyBlock($id: Int!) {
    deleteStudyBlock(id: $id)
  }
`;

export function useDeleteStudyBlockMutation() {
  return Urql.useMutation<DeleteStudyBlockMutation, DeleteStudyBlockMutationVariables>(DeleteStudyBlockDocument);
}
export const CreateStudyCategoryDocument = gql`
  mutation CreateStudyCategory($studyCategory: StudyCategoryInput!) {
    createStudyCategory(studyCategory: $studyCategory) {
      id
      title
      isActive
      userId
    }
  }
`;

export function useCreateStudyCategoryMutation() {
  return Urql.useMutation<CreateStudyCategoryMutation, CreateStudyCategoryMutationVariables>(
    CreateStudyCategoryDocument,
  );
}
export const UpdateStudyCategoryDocument = gql`
  mutation UpdateStudyCategory($id: Int!, $studyCategory: StudyCategoryInput!) {
    updateStudyCategory(id: $id, studyCategory: $studyCategory) {
      id
      title
      isActive
      userId
    }
  }
`;

export function useUpdateStudyCategoryMutation() {
  return Urql.useMutation<UpdateStudyCategoryMutation, UpdateStudyCategoryMutationVariables>(
    UpdateStudyCategoryDocument,
  );
}
export const DeleteStudyCategoryDocument = gql`
  mutation DeleteStudyCategory($id: Int!) {
    deleteStudyCategory(id: $id)
  }
`;

export function useDeleteStudyCategoryMutation() {
  return Urql.useMutation<DeleteStudyCategoryMutation, DeleteStudyCategoryMutationVariables>(
    DeleteStudyCategoryDocument,
  );
}
export const UpdateCurrentUserDocument = gql`
  mutation UpdateCurrentUser($user: UserInput!) {
    updateCurrentUser(user: $user) {
      id
      username
      email
      bio
      jobTitle
      personalTitle
      dateOfBirth
      latitude
      longitude
      firstName
      lastName
      gender
      profilePhotoUrl
      timezone
      language
      status
      createdAt
    }
  }
`;

export function useUpdateCurrentUserMutation() {
  return Urql.useMutation<UpdateCurrentUserMutation, UpdateCurrentUserMutationVariables>(UpdateCurrentUserDocument);
}
export const DeleteCurrentUserDocument = gql`
  mutation DeleteCurrentUser {
    deleteCurrentUser
  }
`;

export function useDeleteCurrentUserMutation() {
  return Urql.useMutation<DeleteCurrentUserMutation, DeleteCurrentUserMutationVariables>(DeleteCurrentUserDocument);
}
export const CurrentUserDocument = gql`
  query CurrentUser {
    currentUser {
      id
      username
      email
      bio
      jobTitle
      personalTitle
      dateOfBirth
      latitude
      longitude
      firstName
      lastName
      gender
      profilePhotoUrl
      timezone
      language
      status
      createdAt
    }
  }
`;

export function useCurrentUserQuery(options?: Omit<Urql.UseQueryArgs<CurrentUserQueryVariables>, 'query'>) {
  return Urql.useQuery<CurrentUserQuery, CurrentUserQueryVariables>({ query: CurrentUserDocument, ...options });
}
export const UserDailyGoalsDocument = gql`
  query UserDailyGoals {
    userDailyGoals {
      id
      quantity
      blockSize
      createdAt
      isActive
      userId
    }
  }
`;

export function useUserDailyGoalsQuery(options?: Omit<Urql.UseQueryArgs<UserDailyGoalsQueryVariables>, 'query'>) {
  return Urql.useQuery<UserDailyGoalsQuery, UserDailyGoalsQueryVariables>({
    query: UserDailyGoalsDocument,
    ...options,
  });
}
export const UserStudyBlocksDocument = gql`
  query UserStudyBlocks {
    userStudyBlocks {
      id
      start
      end
      rating
      isCountdown
      studyCategoryId
      dailyGoalId
      userId
    }
  }
`;

export function useUserStudyBlocksQuery(options?: Omit<Urql.UseQueryArgs<UserStudyBlocksQueryVariables>, 'query'>) {
  return Urql.useQuery<UserStudyBlocksQuery, UserStudyBlocksQueryVariables>({
    query: UserStudyBlocksDocument,
    ...options,
  });
}
export const UserStudyCategoriesDocument = gql`
  query UserStudyCategories {
    userStudyCategories {
      id
      title
      isActive
      userId
    }
  }
`;

export function useUserStudyCategoriesQuery(
  options?: Omit<Urql.UseQueryArgs<UserStudyCategoriesQueryVariables>, 'query'>,
) {
  return Urql.useQuery<UserStudyCategoriesQuery, UserStudyCategoriesQueryVariables>({
    query: UserStudyCategoriesDocument,
    ...options,
  });
}
