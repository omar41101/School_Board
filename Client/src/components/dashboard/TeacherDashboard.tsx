import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { DashboardSidebar } from '../layout/DashboardSidebar';
import { DashboardHeader } from '../layout/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { CoursesPage } from '../pages/CoursesPage';
import { MessagesPage } from '../pages/MessagesPage';
import { TeacherSchedulePage } from '../teacher/TeacherSchedulePage';
import { TeacherGradesPage } from '../teacher/TeacherGradesPage';
import { TeacherClassesPage } from '../teacher/TeacherClassesPage';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Clock,
  CheckCircle,
  AlertCircle,
  Award,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchTeacherData } from '../../store/slices/teacherSlice';

interface TeacherDashboardProps {
  currentUser: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: 'teacher';
  };
  onNavigate: (path: string) => void;
  currentView: string;
  onLogout?: () => void;
}

export function TeacherDashboard({ currentUser, onNavigate, currentView, onLogout }: TeacherDashboardProps) {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { teacherData, courses, assignments, students, grades, loading, error } = useAppSelector((state) => state.teacher);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchTeacherData(user._id));
    }
  }, [user?._id, dispatch]);

  const getTodayClasses = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return courses
      .flatMap(course => 
        (course.schedule || [])
          .filter((s: any) => s.day === today)
          .map((s: any) => ({
            class: course.name,
            subject: course.subject || course.name,
            time: s.startTime,
            room: s.room || 'TBA',
            students: course.enrolledStudents?.length || 0
          }))
      )
      .slice(0, 5);
  };

  const getRecentGrades = () => {
    const assignmentStats = assignments.map(assignment => {
      const assignmentId = typeof assignment._id === 'string' ? assignment._id : (assignment._id as string);
      const assignmentGrades = grades.filter(g => {
        const ref = g.assignment as any;
        const refId = typeof ref === 'string' ? ref : ref?._id;
        return refId === assignmentId;
      });
      const submittedCount = assignmentGrades.length;
      const avgScore = submittedCount > 0
        ? Math.round(assignmentGrades.reduce((sum, g) => sum + (g.percentage || 0), 0) / submittedCount)
        : 0;

      const courseRef: any = assignment.course;
      const courseId = typeof courseRef === 'string' ? courseRef : courseRef?._id;
      const courseName = typeof courseRef === 'object' && courseRef?.name
        ? courseRef.name
        : courses.find(c => c._id === courseId)?.name || 'Course';

      return {
        class: courseName,
        assignment: (assignment as any).title || 'Assignment',
        submitted: submittedCount,
        graded: submittedCount,
        avgScore
      };
    }).slice(0, 5);

    return assignmentStats;
  };

  const getPendingTasks = () => {
    const tasks: any[] = [];
    assignments.forEach(assignment => {
      const assignmentId = typeof assignment._id === 'string' ? assignment._id : (assignment._id as string);
      const assignmentGrades = grades.filter(g => {
        const ref = g.assignment as any;
        const refId = typeof ref === 'string' ? ref : ref?._id;
        return refId === assignmentId;
      });
      const courseRef: any = assignment.course;
      const courseId = typeof courseRef === 'string' ? courseRef : courseRef?._id;
      const courseName = typeof courseRef === 'object' && courseRef?.name
        ? courseRef.name
        : courses.find(c => c._id === courseId)?.name || 'Course';
      const enrolledCount = courses.find(c => c._id === courseId)?.enrolledStudents?.length || 0;

      const dueDateObj = assignment.dueDate ? new Date(assignment.dueDate) : null;
      if (assignmentGrades.length < enrolledCount) {
        tasks.push({
          task: `Grade ${(assignment as any).title || 'Assignment'}`,
          class: courseName,
          dueDate: dueDateObj ? dueDateObj.toLocaleDateString() : 'N/A',
          priority: dueDateObj ? (dueDateObj < new Date() ? 'high' : 'medium') : 'medium'
        });
      }
    });
    return tasks.slice(0, 5);
  };

  const getStudentProgress = () => {
    return students.map(student => {
      const studentId = student._id;
      const studentGrades = grades.filter(g => {
        const ref = g.student as any;
        const refId = typeof ref === 'string' ? ref : ref?._id;
        return refId === studentId;
      });
      const avgGrade = studentGrades.length > 0
        ? Math.round(studentGrades.reduce((sum, g) => sum + (g.percentage || 0), 0) / studentGrades.length)
        : 0;
      const userObj: any = (student as any).user;
      const name = userObj ? `${userObj.firstName || ''} ${userObj.lastName || ''}`.trim() || 'Student' : 'Student';
      return {
        name,
        class: (student as any).currentClass || 'N/A',
        grade: avgGrade,
        trend: avgGrade >= 80 ? 'up' : avgGrade >= 60 ? 'stable' : 'down',
        lastActivity: 'Recent'
      };
    }).slice(0, 4);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-[#1B2B3A]">
        <DashboardSidebar 
          userRole="teacher"
          currentPath={`/${currentView}`}
          onNavigate={onNavigate}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader
            userRole="teacher"
            userName={currentUser.name}
            userAvatar={currentUser.avatar}
            onLogout={onLogout}
          />
          <main className="flex-1 overflow-auto p-6 flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#3E92CC]" />
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-[#1B2B3A]">
        <DashboardSidebar 
          userRole="teacher"
          currentPath={`/${currentView}`}
          onNavigate={onNavigate}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader
            userRole="teacher"
            userName={currentUser.name}
            userAvatar={currentUser.avatar}
            onLogout={onLogout}
          />
          <main className="flex-1 overflow-auto p-6 flex flex-col items-center justify-center space-y-4">
            <AlertCircle className="h-16 w-16 text-red-500" />
            <p className="text-red-600 text-lg">{error}</p>
            <Button onClick={() => user?._id && dispatch(fetchTeacherData(user._id))} variant="outline">Retry</Button>
          </main>
        </div>
      </div>
    );
  }

  const todayClasses = getTodayClasses();
  const recentGrades = getRecentGrades();
  const pendingTasks = getPendingTasks();
  const studentProgress = getStudentProgress();

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
          <h1 className="text-2xl font-bold mb-2">Welcome, {currentUser.name}!</h1>
          <p className="text-white/80 mb-4">Ready to inspire and educate your students today?</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold">{courses.length}</div>
              <div className="text-sm text-white/70">Classes</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{students.length}</div>
              <div className="text-sm text-white/70">Students</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{todayClasses.length}</div>
              <div className="text-sm text-white/70">Today's Classes</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{pendingTasks.length}</div>
              <div className="text-sm text-white/70">Pending Tasks</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <BookOpen className="h-5 w-5 text-[#3E92CC]" />
                <Badge className="bg-[#3E92CC]">Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">{courses.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Courses</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">{students.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">{grades.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Grades Entered</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">{pendingTasks.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Tasks</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-[#3E92CC]" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayClasses.length > 0 ? (
                <div className="space-y-3">
                  {todayClasses.map((cls, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{cls.class}</p>
                        <p className="text-sm text-gray-600">{cls.subject} - {cls.room}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{cls.time}</p>
                        <p className="text-xs text-gray-500">{cls.students} students</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No classes scheduled for today</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Grading */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-[#3E92CC]" />
                Recent Grading
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentGrades.length > 0 ? (
                <div className="space-y-3">
                  {recentGrades.map((grade, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{grade.class}</p>
                          <p className="text-sm text-gray-600">{grade.assignment}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Avg: {grade.avgScore}%</Badge>
                      </div>
                      <Progress value={(grade.graded / grade.submitted) * 100} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">{grade.graded}/{grade.submitted} graded</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent grading activity</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-[#3E92CC]" />
                Pending Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingTasks.length > 0 ? (
                <div className="space-y-3">
                  {pendingTasks.map((task, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{task.task}</p>
                        <p className="text-sm text-gray-600">{task.class}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{task.dueDate}</p>
                        <Badge className={
                          task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No pending tasks</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Student Progress */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-[#3E92CC]" />
                Student Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              {studentProgress.length > 0 ? (
                <div className="space-y-3">
                  {studentProgress.map((student, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.class}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{student.grade}%</p>
                        <Badge className={
                          student.trend === 'up' ? 'bg-green-100 text-green-800' :
                          student.trend === 'down' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {student.trend}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No student data available</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'my-classes':
        return <TeacherClassesPage />;
      case 'grades':
        return <TeacherGradesPage />;
      case 'schedule':
        return <TeacherSchedulePage />;
      case 'parent-chat':
      case 'messages':
        return <MessagesPage />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#1B2B3A]">
      <DashboardSidebar 
        userRole="teacher"
        currentPath={`/${currentView}`}
        onNavigate={onNavigate}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          userRole="teacher"
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
