import { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { DashboardHeader } from '../layout/DashboardHeader';
import { DashboardSidebar } from '../layout/DashboardSidebar';
import { ParentChildProgressPage } from '../parent/ParentChildProgressPage';
import { ParentCommunicationPage } from '../parent/ParentCommunicationPage';
import { PaymentsPage } from '../pages/PaymentsPage';
import { EventsPage } from '../pages/EventsPage';
import type { User } from '../../types';

interface ParentDashboardProps {
  view?: string;
}

export function ParentDashboard({ view: initialView = 'overview' }: ParentDashboardProps) {
  const { user } = useAppSelector((state) => state.auth);
  const [currentView, setCurrentView] = useState(initialView);

  if (!user) {
    return null;
  }

  const renderView = () => {
    switch (currentView) {
      case 'progress':
        return <ParentChildProgressPage />;
      case 'communication':
        return <ParentCommunicationPage />;
      case 'payments':
        return <PaymentsPage />;
      case 'events':
        return <EventsPage />;
      default:
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Parent Dashboard</h1>
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
