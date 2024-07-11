'use client';

import { useQuery } from '@tanstack/react-query';
import { StudyBlocksService, DailyGoalsService, StudyCategoriesService, UsersService } from '@api';
import Nav from '@app/components/nav';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
   useQuery({
    queryKey: ['studyCategories'],
    queryFn: () => StudyCategoriesService.readStudyCategoriesStudyCategoriesGet()
  });

  useQuery({
    queryKey: ['dailyGoals'],
    queryFn: () => DailyGoalsService.readDailyGoalsDailyGoalsGet()
  });

  useQuery({
    queryKey: ['studyBlocks'],
    queryFn: () => StudyBlocksService.readStudyBlocksStudyBlocksGet()
  }); 

  useQuery({
    queryKey: ['currentUser'],
    queryFn: () => UsersService.readCurrentUserUsersMeGet()
  }); 

  return (
    
    <main className="bg-gray-700 text-white">
      <Nav />
      {children}
    </main>
  );
};

export default RootLayout;
