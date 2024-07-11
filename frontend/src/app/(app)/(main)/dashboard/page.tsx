'use client';

import PomodoroTimer from '@app/components/timer/timer';
import Sidebar from '@app/components/sidebar/sidebar';
import Calendar from '@app/components/calendar/calendar';

const Dashboard = () => {
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
