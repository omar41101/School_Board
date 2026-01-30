import { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { DashboardHeader } from '../layout/DashboardHeader';
import { DashboardSidebar } from '../layout/DashboardSidebar';
import { UserManagement } from '../admin/UserManagement';
import { StudentsManagement } from '../admin/StudentsManagement';
import { TeachersManagement } from '../admin/TeachersManagement';
import { ParentsManagement } from '../admin/ParentsManagement';
import { CoursesManagement } from '../admin/CoursesManagement';
import { AnalyticsPage } from '../admin/AnalyticsPage';
import { SettingsPage } from '../admin/SettingsPage';
import type { User } from '../../types';

interface AdminDashboardProps {
  view?: string;
}

export function AdminDashboard({ view: initialView = 'overview' }: AdminDashboardProps) {
  const { user } = useAppSelector((state) => state.auth);
  const [currentView, setCurrentView] = useState(initialView);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    // Logout handled by header component
  };

  const renderView = () => {
    switch (currentView) {
      case 'users':
        return <UserManagement />;
      case 'students':
        return <StudentsManagement />;
      case 'teachers':
        return <TeachersManagement />;
      case 'parents':
        return <ParentsManagement />;
      case 'courses':
        return <CoursesManagement />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <AnalyticsPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader user={user as User} onLogout={handleLogout} />
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
