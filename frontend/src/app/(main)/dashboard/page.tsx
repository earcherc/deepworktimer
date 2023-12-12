'use client';

import { dailyGoalsAtom } from '@app/store/atoms';
import { useUserDailyGoalsQuery } from '@/graphql/graphql-types';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react';

const Dashboard = () => {
  const [, setDailyGoals] = useAtom(dailyGoalsAtom);
  const [{ data, fetching, error }] = useUserDailyGoalsQuery();

  useEffect(() => {
    if (data && data.userDailyGoals) {
      console.log(data.userDailyGoals);
      setDailyGoals(data.userDailyGoals);
    }
  }, [data]);

  return (
    <div className="flex h-screen flex-1 flex-col justify-center px-6 py-12 text-white lg:px-8">
      {/* Render your daily goals here */}
      Hello
    </div>
  );
};

export default Dashboard;
