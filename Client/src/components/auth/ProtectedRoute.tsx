import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { Loader2 } from 'lucide-react';
import type { User } from '../../types';

interface ProtectedRouteProps {
  allowedRoles?: Array<'admin' | 'student' | 'teacher' | 'parent' | 'direction'>;
  children?: React.ReactNode;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const location = useLocation();
  const { user, isAuthenticated, loading, isInitialized } = useAppSelector((state) => state.auth);

  // Show loading while checking auth
  if (!isInitialized || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0D1B2A]">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-[#3E92CC] mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Get user role (handle both User type and authService User type)
  const userRole = (user as User).role || (user as { role: string }).role;
  const userRoleString = typeof userRole === 'string' ? userRole : 'student';

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(userRoleString as 'admin' | 'student' | 'teacher' | 'parent' | 'direction')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4 p-8">
          <div className="text-6xl">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-[#3E92CC] text-white rounded-lg hover:bg-[#2d6fa3] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
}
