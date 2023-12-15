import DailyGoal from './daily-goal';

export default function Sidebar() {
  return (
    <div className="h-100 flex w-96 flex-col">
      <div className="flex grow flex-col  overflow-y-auto bg-gray-700 px-6 pb-4">
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <DailyGoal></DailyGoal>
            </li>
            <li>
              <DailyGoal></DailyGoal>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
