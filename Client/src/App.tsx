 import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { initializeAuth, logoutUser } from './store/slices/authSlice.v2';
import { LandingPage } from './components/landing/LandingPage';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { ParentDashboard } from './components/dashboard/ParentDashboard';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading, isInitialized } = useAppSelector((state) => state.auth);
  const [currentView, setCurrentView] = useState('overview');

  // Initialize authentication on mount
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Handle authentication success
  const handleAuthSuccess = () => {
    navigate('/dashboard');
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logoutUser());
    setCurrentView('overview');
    navigate('/');
  };

  // Handle navigation
  const handleNavigate = (path: string) => {
    setCurrentView(path.replace('/', '') || 'overview');
  };

  // Show loading spinner during initialization
  if (!isInitialized || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0D1B2A]">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-[#3E92CC] mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LandingPage onAuthSuccess={handleAuthSuccess} />
          )
        } 
      />

      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard/*"
        element={
          !isAuthenticated ? (
            <Navigate to="/" replace />
          ) : user?.role === 'student' ? (
            <StudentDashboard
              currentUser={{
                id: user._id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                avatar: '',
                role: 'student'
              }}
              onNavigate={handleNavigate}
              currentView={currentView}
              onLogout={handleLogout}
            />
          ) : user?.role === 'teacher' ? (
            <TeacherDashboard
              currentUser={{
                id: user._id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                avatar: '',
                role: 'teacher'
              }}
              onNavigate={handleNavigate}
              currentView={currentView}
              onLogout={handleLogout}
            />
          ) : user?.role === 'parent' ? (
            <ParentDashboard
              currentUser={{
                id: user._id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                avatar: '',
                role: 'parent'
              }}
              onNavigate={handleNavigate}
              currentView={currentView}
              onLogout={handleLogout}
            />
          ) : user?.role === 'admin' || user?.role === 'direction' ? (
            <TeacherDashboard
              currentUser={{
                id: user._id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                avatar: '',
                role: 'teacher'
              }}
              onNavigate={handleNavigate}
              currentView={currentView}
              onLogout={handleLogout}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

 