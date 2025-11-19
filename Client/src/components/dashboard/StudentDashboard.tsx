import { useState, useEffect } from 'react';
import { DashboardSidebar } from '../layout/DashboardSidebar';
import { DashboardHeader } from '../layout/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { motion } from 'motion/react';
import { StudentGrades } from '../student/StudentGrades';
import { StudentHomework } from '../student/StudentHomework';
import { StudentSchedule } from '../student/StudentSchedule';
import { StudentCantine } from '../student/StudentCantine';
import { MessagesPage } from '../pages/MessagesPage';
import { EventsPage } from '../pages/EventsPage';
import { PaymentsPage } from '../pages/PaymentsPage';
import { useAuth } from '../../contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchStudentData } from '../../store/slices/studentSlice';
import { 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Award,
  Target,
  FileText,
  Loader2
} from 'lucide-react';
import { StudentSchedulePage } from '../student/StudentSchedulePage';

interface StudentDashboardProps {
  currentUser: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: 'student';
  };
  onNavigate: (path: string) => void;
  currentView: string;
  onLogout?: () => void;
}

export function StudentDashboard({ currentUser, onNavigate, currentView, onLogout }: StudentDashboardProps) {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { studentData, courses, grades, assignments, attendance, loading, error } = useAppSelector((state) => state.student);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchStudentData(user._id));
    }
  }, [user?._id, dispatch]);

  // Calculate statistics
  const calculateOverallGrade = () => {
    if (grades.length === 0) return 0;
    const avg = grades.reduce((acc, g) => acc + (g.percentage || 0), 0) / grades.length;
    return Math.round(avg * 10) / 10;
  };

  const calculateAttendanceRate = () => {
    if (attendance.length === 0) return 0;
    const presentCount = attendance.filter(a => a.status === 'present' || a.status === 'late').length;
    return Math.round((presentCount / attendance.length) * 100);
  };

  const getUpcomingClasses = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return courses.flatMap(course => {
      const scheduleItems = course.schedule || [];
      return scheduleItems
        .filter((s: any) => s.day === today)
        .map((s: any) => {
          const teacherObj = typeof course.teacher === 'string' ? null : course.teacher as any;
          const teacherName = teacherObj?.user
            ? `${teacherObj.user.firstName || ''} ${teacherObj.user.lastName || ''}`.trim() || 'TBA'
            : 'TBA';
          return {
            subject: (course as any).name || 'Course',
            time: s.startTime,
            room: s.room || 'TBA',
            teacher: teacherName
          };
        });
    }).slice(0, 3);
  };

  const getRecentGrades = () => {
    return grades
      .sort((a, b) => (b.examDate ? new Date(b.examDate).getTime() : 0) - (a.examDate ? new Date(a.examDate).getTime() : 0))
      .slice(0, 4)
      .map(g => {
        const examType = g.examType ? g.examType.charAt(0).toUpperCase() + g.examType.slice(1) : 'Assessment';
        return {
          subject: (g as any).subject || 'Subject',
          assignment: `${examType} Exam`,
          grade: g.percentage ?? (g as any).grade ?? 0,
          date: g.examDate ? new Date(g.examDate).toLocaleDateString() : 'N/A'
        };
      });
  };

  const getPendingAssignments = () => {
    return assignments
      .filter(a => !!a.dueDate && new Date(a.dueDate) > new Date())
      .sort((a, b) => (a.dueDate ? new Date(a.dueDate).getTime() : 0) - (b.dueDate ? new Date(b.dueDate).getTime() : 0))
      .slice(0, 3)
      .map(a => ({
        subject: (a as any).subject || 'Subject',
        task: (a as any).title || 'Assignment',
        due: a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'N/A',
        status: 'pending'
      }));
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-[#1B2B3A]">
        <DashboardSidebar 
          userRole="student"
          currentPath={`/${currentView}`}
          onNavigate={onNavigate}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader
            userRole="student"
            userName={currentUser.name}
            userAvatar={currentUser.avatar}
            onLogout={onLogout}
          />
          
          <main className="flex-1 overflow-auto p-6 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-[#3E92CC] mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-[#1B2B3A]">
        <DashboardSidebar 
          userRole="student"
          currentPath={`/${currentView}`}
          onNavigate={onNavigate}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader
            userRole="student"
            userName={currentUser.name}
            userAvatar={currentUser.avatar}
            onLogout={onLogout}
          />
          
          <main className="flex-1 overflow-auto p-6 flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Failed to Load Data</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
              <Button onClick={() => user?._id && dispatch(fetchStudentData(user._id))} className="bg-[#3E92CC]">
                Try Again
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const upcomingClasses = getUpcomingClasses();
  const recentGrades = getRecentGrades();
  const homework = getPendingAssignments();
  const overallGrade = calculateOverallGrade();
  const attendanceRate = calculateAttendanceRate();

  const renderDashboard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#0D1B2A] to-[#3E92CC] rounded-2xl p-6 text-white">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl font-bold mb-2">Welcome back, {currentUser.name}!</h1>
          <p className="text-white/80 mb-4">Ready to continue your learning journey?</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold">{studentData?.level || 'N/A'}</div>
              <div className="text-sm text-white/70">Current Grade</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{overallGrade}%</div>
              <div className="text-sm text-white/70">Overall Grade</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{attendanceRate}%</div>
              <div className="text-sm text-white/70">Attendance</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{courses.length}</div>
              <div className="text-sm text-white/70">Active Courses</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-[#3E92CC]" />
                Academic Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Overall Performance</span>
                  <span className="font-semibold">{overallGrade}%</span>
                </div>
                <Progress value={overallGrade} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Target: 90%</span>
                  <span>{grades.length} grades recorded</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 h-5 w-5 text-[#3E92CC]" />
                Attendance Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">This Semester</span>
                  <span className="font-semibold">{attendanceRate}%</span>
                </div>
                <Progress value={attendanceRate} className="h-2" />
                <div className="text-xs text-gray-500">
                  {attendanceRate >= 90 ? 'Excellent attendance record!' : 
                   attendanceRate >= 75 ? 'Good attendance!' : 
                   'Please improve attendance'}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Award className="mr-2 h-5 w-5 text-[#3E92CC]" />
                Course Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#0D1B2A] mb-2">{courses.length}</div>
                <div className="text-sm text-gray-600">Active Courses</div>
                <Badge variant="secondary" className="mt-2 bg-[#3E92CC] text-white">
                  {assignments.filter(a => a.dueDate && new Date(a.dueDate) > new Date()).length} Pending
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-[#3E92CC]" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingClasses.length > 0 ? (
                  upcomingClasses.map((class_, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="w-12 h-12 bg-[#3E92CC] rounded-lg flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#0D1B2A] dark:text-white">{class_.subject}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{class_.teacher}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{class_.time}</div>
                        <div className="text-xs text-gray-500">{class_.room}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No classes scheduled for today</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Grades */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-[#3E92CC]" />
                Recent Grades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentGrades.length > 0 ? (
                  recentGrades.map((grade, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-[#0D1B2A] dark:text-white">{grade.subject}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{grade.assignment}</p>
                        <p className="text-xs text-gray-500">{grade.date}</p>
                      </div>
                      <div className={`text-xl font-bold ${(() => {
                        const gv = grade.grade ?? 0;
                        if (gv >= 90) return 'text-green-600';
                        if (gv >= 80) return 'text-blue-600';
                        if (gv >= 70) return 'text-yellow-600';
                        return 'text-red-600';
                      })()}`}>\n                        {Math.round((grade.grade ?? 0))}%
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No grades available yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Homework & Assignments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-[#3E92CC]" />
              Homework & Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {homework.length > 0 ? (
                homework.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        task.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                      <div>
                        <h4 className="font-semibold text-[#0D1B2A] dark:text-white">{task.subject}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{task.task}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">Due: {task.due}</div>
                      <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                        {task.status === 'completed' ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <AlertCircle className="w-3 h-3 mr-1" />
                        )}
                        {task.status === 'completed' ? 'Completed' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No pending assignments</p>
                  <p className="text-sm">Great job staying on top of your work!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'grades':
        return <StudentGrades />;
      case 'homework':
        return <StudentHomework />;
      case 'schedule':
        return <StudentSchedulePage />;
      case 'payments':
        return <PaymentsPage />;
      case 'events':
        return <EventsPage />;
      case 'messages':
        return <MessagesPage />;
      case 'cantine':
        return <StudentCantine />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#1B2B3A]">
      <DashboardSidebar 
        userRole="student"
        currentPath={`/${currentView}`}
        onNavigate={onNavigate}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          userRole="student"
          userName={currentUser.name}
          userAvatar={currentUser.avatar}
          onLogout={onLogout}
        />
        
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}