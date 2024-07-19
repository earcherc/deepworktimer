'use client';

import Calendar from '@app/components/calendar/calendar';
import Sidebar from '@app/components/sidebar/sidebar';

const Dashboard = () => {
  return (
    <div className="flex bg-gray-700 h-full p-4" style={{ height: 'calc(100vh - 4rem)' }}>
      <Sidebar />
      <div className="flex flex-grow flex-col overflow-hidden pl-4">
        <Calendar />
      </div>
    </div>
  );
};

export default Dashboard;
