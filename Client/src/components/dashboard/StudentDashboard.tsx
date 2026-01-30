import { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { DashboardHeader } from '../layout/DashboardHeader';
import { DashboardSidebar } from '../layout/DashboardSidebar';
import { StudentGradesPage } from '../student/StudentGradesPage';
import { StudentHomeworkPage } from '../student/StudentHomeworkPage';
import { StudentSchedulePage } from '../student/StudentSchedulePage';
import { StudentCantine } from '../student/StudentCantine';
import { MessagesPage } from '../pages/MessagesPage';
import { EventsPage } from '../pages/EventsPage';
import { PaymentsPage } from '../pages/PaymentsPage';
import {
  useGetStudentMeQuery,
  useGetGradesQuery,
  useGetAssignmentsQuery,
  useGetCoursesQuery,
} from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Award,
  Target
} from 'lucide-react';
import type { User } from '../../types';

interface StudentDashboardProps {
  view?: string;
}

export function StudentDashboard({ view: initialView = 'overview' }: StudentDashboardProps) {
  const { user } = useAppSelector((state) => state.auth);
  const [currentView, setCurrentView] = useState(initialView);

  const { data: studentMeData } = useGetStudentMeQuery(undefined, {
    skip: (user as User)?.role !== 'student',
  });
  const studentId = studentMeData?.data?.student?.id;

  const { data: gradesData } = useGetGradesQuery(
    { student: studentId! },
    { skip: !studentId },
  );
  const { data: coursesData } = useGetCoursesQuery(
    { student: studentId! },
    { skip: !studentId },
  );
  const courseIds = (coursesData?.data?.courses || []).map((c) => c.id).join(',');
  const { data: assignmentsData } = useGetAssignmentsQuery(
    courseIds ? { courseIds } : undefined!,
    { skip: !courseIds },
  );

  const grades = gradesData?.data?.grades || [];
  const assignments = assignmentsData?.data?.assignments || [];
  const courses = coursesData?.data?.courses || [];

  if (!user) {
    return null;
  }

  const calculateOverallGrade = () => {
    if (grades.length === 0) return 0;
    const totalPercentage = grades.reduce((acc: number, g) => acc + (g.percentage || 0), 0);
    return Math.round((totalPercentage / grades.length) * 10) / 10;
  };

  const overallGrade = calculateOverallGrade();

  const renderView = () => {
    switch (currentView) {
      case 'grades':
        return <StudentGradesPage />;
      case 'homework':
        return <StudentHomeworkPage />;
      case 'schedule':
        return <StudentSchedulePage />;
      case 'cantine':
        return <StudentCantine />;
      case 'messages':
        return <MessagesPage />;
      case 'events':
        return <EventsPage />;
      case 'payments':
        return <PaymentsPage />;
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overall Grade</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overallGrade}%</div>
                  <Progress value={overallGrade} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{courses.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Active courses</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Assignments</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{assignments.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Total assignments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recent Grades</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{grades.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Total grades</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Grades</CardTitle>
                </CardHeader>
                <CardContent>
                  {grades.slice(0, 5).map((grade) => (
                    <div key={grade.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{grade.subject}</p>
                        <p className="text-sm text-muted-foreground">{grade.examType}</p>
                      </div>
                      <Badge variant={grade.percentage && grade.percentage >= 70 ? 'default' : 'secondary'}>
                        {grade.percentage?.toFixed(1)}%
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                  {assignments.slice(0, 5).map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{assignment.title}</p>
                        <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                      </div>
                      <Badge variant="outline">
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
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
