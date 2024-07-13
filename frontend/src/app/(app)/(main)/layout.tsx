'use client';

import { DailyGoalsService, StudyBlocksService, StudyCategoriesService, UsersService } from '@api';
import { useQuery } from '@tanstack/react-query';
import Nav from '@app/components/nav';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  useQuery({
    queryKey: ['currentUser'],
    queryFn: () => UsersService.readCurrentUserUsersMeGet(),
  });

  useQuery({
    queryKey: ['studyCategories'],
    queryFn: () => StudyCategoriesService.readStudyCategoriesStudyCategoriesGet(),
  });

  useQuery({
    queryKey: ['dailyGoals'],
    queryFn: () => DailyGoalsService.readDailyGoalsDailyGoalsGet(),
  });

  useQuery({
    queryKey: ['studyBlocks'],
    queryFn: () => StudyBlocksService.readStudyBlocksStudyBlocksGet(),
  });

  return (
    <main className="bg-gray-700 text-white">
      <Nav />
      {children}
    </main>
  );
};

export default RootLayout;
