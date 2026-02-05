import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { initializeAuth } from './store/slices/authSlice.v2';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './components/auth/LoginPage';
import { LandingPage } from './components/landing/LandingPage';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { ParentDashboard } from './components/dashboard/ParentDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { Toaster } from './components/ui/sonner';
import { StudentDemoChat } from './components/student/StudentDemoChat';
import type { User } from './types';

function App() {
  const dispatch = useAppDispatch();
  const { isInitialized, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isInitialized) {
    dispatch(initializeAuth());
    }
  }, [dispatch, isInitialized]);

  return (
    <>
    <Toaster position="top-right" richColors closeButton />
    <StudentDemoChat visible={(user as User)?.role === 'student'} />
    <Router>
    <Routes>
      {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Student Routes */}
        <Route
          element={<ProtectedRoute allowedRoles={['student']} />}
        >
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/grades" element={<StudentDashboard view="grades" />} />
          <Route path="/student/homework" element={<StudentDashboard view="homework" />} />
          <Route path="/student/schedule" element={<StudentDashboard view="schedule" />} />
          <Route path="/student/cantine" element={<StudentDashboard view="cantine" />} />
        </Route>

        {/* Protected Teacher Routes */}
        <Route
          element={<ProtectedRoute allowedRoles={['teacher']} />}
        >
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/classes" element={<TeacherDashboard view="classes" />} />
          <Route path="/teacher/grades" element={<TeacherDashboard view="grades" />} />
          <Route path="/teacher/schedule" element={<TeacherDashboard view="schedule" />} />
        </Route>

        {/* Protected Parent Routes */}
        <Route
          element={<ProtectedRoute allowedRoles={['parent']} />}
        >
          <Route path="/parent/dashboard" element={<ParentDashboard />} />
          <Route path="/parent/progress" element={<ParentDashboard view="progress" />} />
          <Route path="/parent/communication" element={<ParentDashboard view="communication" />} />
        </Route>

        {/* Protected Admin Routes */}
      <Route 
          element={<ProtectedRoute allowedRoles={['admin', 'direction']} />}
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminDashboard view="users" />} />
          <Route path="/admin/students" element={<AdminDashboard view="students" />} />
          <Route path="/admin/teachers" element={<AdminDashboard view="teachers" />} />
          <Route path="/admin/parents" element={<AdminDashboard view="parents" />} />
          <Route path="/admin/courses" element={<AdminDashboard view="courses" />} />
          <Route path="/admin/planning" element={<AdminDashboard view="planning" />} />
          <Route path="/admin/analytics" element={<AdminDashboard view="analytics" />} />
          <Route path="/admin/settings" element={<AdminDashboard view="settings" />} />
        </Route>

        {/* Common Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/courses" element={<StudentDashboard view="courses" />} />
          <Route path="/events" element={<StudentDashboard view="events" />} />
          <Route path="/messages" element={<StudentDashboard view="messages" />} />
          <Route path="/payments" element={<StudentDashboard view="payments" />} />
          <Route path="/profile" element={<StudentDashboard view="profile" />} />
        </Route>

        {/* Default redirect based on role */}
      <Route
          path="/dashboard"
        element={
            <ProtectedRoute>
              <NavigateToRoleDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Router>
    </>
  );
}

function NavigateToRoleDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  
  if (!user) return <Navigate to="/login" replace />;

  const roleRoutes: Record<User['role'], string> = {
    admin: '/admin/dashboard',
    direction: '/admin/dashboard',
    teacher: '/teacher/dashboard',
    student: '/student/dashboard',
    parent: '/parent/dashboard',
  };

  return <Navigate to={roleRoutes[user.role]} replace />;
}

export default App;
 