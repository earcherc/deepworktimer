import StudyCategoryComponent from '../study-category/study-category';
import DailyGoalComponent from '../daily-goal/daily-goal';

export default function Sidebar() {
  return (
    <div className="h-100 flex w-72 flex-col ">
      <div className="flex grow flex-col overflow-y-auto overflow-x-hidden">
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <DailyGoalComponent />
            </li>
            <li>
              <StudyCategoryComponent />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
