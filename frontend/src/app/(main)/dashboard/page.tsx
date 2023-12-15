'use client';

import { dailyGoalsAtom } from '@app/store/atoms';
import { useUserDailyGoalsQuery } from '@/graphql/graphql-types';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import PomodoroTimer from '@/app/components/timer/timer';
import Sidebar from '@/app/components/sidebar/sidebar';

const Dashboard = () => {
  const [, setDailyGoals] = useAtom(dailyGoalsAtom);
  const [{ data, fetching, error }] = useUserDailyGoalsQuery();

  useEffect(() => {
    if (data && data.userDailyGoals) {
      setDailyGoals(data.userDailyGoals);
    }
  }, [data]);

  return (
    <div className="flex">
      <Sidebar></Sidebar>
      <PomodoroTimer></PomodoroTimer>
    </div>
  );
};

export default Dashboard;
