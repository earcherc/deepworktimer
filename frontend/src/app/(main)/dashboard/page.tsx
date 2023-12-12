'use client';

import React from 'react';
import { useAtom } from 'jotai';
import { useQuery } from 'urql';

import { userAtom } from '@/app/store/atoms';

const Dashboard = () => {
  const [user] = useAtom(userAtom);
  const [result] = useQuery({
    query: `
      query GetUser($id: ID!) {
        getUser(id: $id) {
          id
          username
          email
        }
      }
    `,
    variables: { id: user.user?.id },
  });

  const { data, fetching, error } = result;

  console.log(data);

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return <div className="flex h-screen flex-1 flex-col justify-center px-6 py-12 text-white lg:px-8">Hello</div>;
};

export default Dashboard;
