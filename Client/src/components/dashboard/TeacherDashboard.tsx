import { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { DashboardHeader } from '../layout/DashboardHeader';
import { DashboardSidebar } from '../layout/DashboardSidebar';
import { TeacherClassesPage } from '../teacher/TeacherClassesPage';
import { TeacherGradesPage } from '../teacher/TeacherGradesPage';
import { TeacherSchedulePage } from '../teacher/TeacherSchedulePage';
import { MessagesPage } from '../pages/MessagesPage';
import { EventsPage } from '../pages/EventsPage';
import type { User } from '../../types';

interface TeacherDashboardProps {
  view?: string;
}

export function TeacherDashboard({ view: initialView = 'overview' }: TeacherDashboardProps) {
  const { user } = useAppSelector((state) => state.auth);
  const [currentView, setCurrentView] = useState(initialView);

  if (!user) {
    return null;
  }

  const renderView = () => {
    switch (currentView) {
      case 'classes':
        return <TeacherClassesPage />;
      case 'grades':
        return <TeacherGradesPage />;
      case 'schedule':
        return <TeacherSchedulePage />;
      case 'messages':
        return <MessagesPage />;
      case 'events':
        return <EventsPage />;
      default:
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teacher Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome, {(user as User).firstName || (user as { firstName: string }).firstName}!
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader user={user as User} />
      <div className="flex">
        <DashboardSidebar
          role={(user as User).role || (user as { role: string }).role as 'admin' | 'teacher' | 'student' | 'parent' | 'direction'}
          currentView={currentView}
          onNavigate={setCurrentView}
        />
        <main className="flex-1 p-6 lg:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
