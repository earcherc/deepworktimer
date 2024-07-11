'use client';

import { dailyGoalsAtom } from '@app/store/atoms';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DefaultService } from '@api/services/DefaultService';
import { DailyGoal } from '@api/models/DailyGoal';
import PomodoroTimer from '@app/components/timer/timer';
import Sidebar from '@app/components/sidebar/sidebar';
import Calendar from '@app/components/calendar/calendar';

const Dashboard = () => {
  const [, setDailyGoals] = useAtom(dailyGoalsAtom);
  const { data, isLoading, error } = useQuery<DailyGoal[]>({
    queryKey: ['dailyGoals'],
    queryFn: () => DefaultService.readDailyGoalsDailyGoalsGet(),
  });

  useEffect(() => {
    if (data) {
      setDailyGoals(data);
    }
  }, [data, setDailyGoals]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{(error as Error).message}</div>;

  return (
    <div className="flex h-full p-4" style={{ height: 'calc(100vh - 4rem)' }}>
      <Sidebar />
      <div className="flex flex-grow flex-col overflow-hidden pl-4">
        <PomodoroTimer />
        <div className="mb-4" />
        <Calendar />
      </div>
    </div>
  );
};

export default Dashboard;