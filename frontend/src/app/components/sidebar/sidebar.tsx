import StudyCategory from '../study-category/study-category';
import DailyGoal from '../daily-goal/daily-goal';

export default function Sidebar() {
  return (
    <div className="h-100 flex w-96 flex-col ">
      <div className="flex grow flex-col overflow-y-auto overflow-x-hidden">
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <DailyGoal></DailyGoal>
            </li>
            <li>
              <StudyCategory></StudyCategory>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
