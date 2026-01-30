import { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import {
  useGetStudentMeQuery,
  useGetGradesQuery,
  useGetCoursesQuery,
} from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import {
  TrendingUp,
  TrendingDown,
  Award,
  BookOpen,
  Calendar,
  Target,
  BarChart3,
  FileText,
  Clock,
  CheckCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import type { Grade } from '../../types';

export function StudentGradesPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [selectedTerm, setSelectedTerm] = useState('current');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const { data: studentMeData } = useGetStudentMeQuery(undefined, {
    skip: (user as { role?: string })?.role !== 'student',
  });
  const studentId = studentMeData?.data?.student?.id;

  const { data: gradesData, isLoading: gradesLoading, error: gradesError } = useGetGradesQuery(
    { student: studentId! },
    { skip: !studentId },
  );
  const { data: coursesData } = useGetCoursesQuery(
    { student: studentId! },
    { skip: !studentId },
  );

  const grades = (gradesData?.data?.grades || []) as Grade[];
  const courses = coursesData?.data?.courses || [];

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'graded':
        return 'bg-green-100 text-green-800';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exam':
        return 'bg-red-100 text-red-800';
      case 'project':
        return 'bg-purple-100 text-purple-800';
      case 'quiz':
        return 'bg-blue-100 text-blue-800';
      case 'homework':
      case 'assignment':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <div className="w-4 h-1 bg-gray-400 rounded" />;
    }
  };

  const subjects = [...new Set(grades.map((g) => g.subject))];
  const subjectGrades = subjects.map((subject) => {
    const subjectGradesList = grades.filter((g) => g.subject === subject);
    const avg =
      subjectGradesList.length > 0
        ? subjectGradesList.reduce((acc, g) => acc + (Number(g.percentage) || 0), 0) /
          subjectGradesList.length
        : 0;
    return {
      subject,
      teacher:
        subjectGradesList[0]?.teacher?.user?.firstName && subjectGradesList[0]?.teacher?.user?.lastName
          ? `${subjectGradesList[0].teacher.user.firstName} ${subjectGradesList[0].teacher.user.lastName}`
          : 'Teacher',
      currentGrade: Math.round(avg * 10) / 10,
      targetGrade: 90,
      trend: 'stable' as const,
      assignments: subjectGradesList.length,
      nextAssignment: subjectGradesList[0]?.examDate
        ? new Date(subjectGradesList[0].examDate).toLocaleDateString()
        : 'TBD',
      color: 'bg-blue-500',
    };
  });

  const overallAverage =
    subjectGrades.length > 0
      ? subjectGrades.reduce((acc, s) => acc + s.currentGrade, 0) / subjectGrades.length
      : 0;

  const filteredGrades =
    selectedSubject === 'all'
      ? grades
      : grades.filter((g) => g.subject.toLowerCase() === selectedSubject.toLowerCase());

  if (gradesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading grades...</span>
      </div>
    );
  }

  if (gradesError) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-gray-600 mb-4">Failed to load grades</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">My Grades</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your academic performance and progress</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedTerm} onValueChange={setSelectedTerm}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Term</SelectItem>
              <SelectItem value="previous">Previous Term</SelectItem>
              <SelectItem value="year">Full Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Award className="h-12 w-12 text-[#3E92CC] mx-auto mb-3" />
            <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">
              {overallAverage.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Overall Average</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">
              {subjectGrades.filter((s) => s.currentGrade >= 80).length}/{subjectGrades.length || 1}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Goals Achieved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <BookOpen className="h-12 w-12 text-[#3E92CC] mx-auto mb-3" />
            <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">{subjects.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Subjects</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">
              {grades[0]?.grade || '-'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Grade Level</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Subject Overview</TabsTrigger>
          <TabsTrigger value="recent">Recent Grades</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subjectGrades.length > 0 ? (
              subjectGrades.map((subject) => (
                <Card key={subject.subject} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 ${subject.color} rounded-lg flex items-center justify-center`}
                        >
                          <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{subject.subject}</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{subject.teacher}</p>
                        </div>
                      </div>
                      {getTrendIcon(subject.trend)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Current Grade</span>
                      <span
                        className={`text-2xl font-bold ${getGradeColor(subject.currentGrade)}`}
                      >
                        {subject.currentGrade}%
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress to Goal ({subject.targetGrade}%)</span>
                        <span>
                          {Math.min(
                            100,
                            (subject.currentGrade / subject.targetGrade) * 100,
                          ).toFixed(0)}
                          %
                        </span>
                      </div>
                      <Progress
                        value={Math.min(
                          100,
                          (subject.currentGrade / subject.targetGrade) * 100,
                        )}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span>{subject.assignments} assignments completed</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Next: {subject.nextAssignment}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No grades recorded yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((s) => (
                    <SelectItem key={s} value={s.toLowerCase()}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              {filteredGrades.length > 0 ? (
                filteredGrades.map((grade) => (
                  <Card key={grade.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="flex items-center justify-center w-12 h-12 bg-[#3E92CC]/10 rounded-lg">
                            <FileText className="h-6 w-6 text-[#3E92CC]" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-[#0D1B2A] dark:text-white">
                                {grade.subject} - {grade.examType}
                              </h3>
                              <Badge className={getTypeColor(grade.examType)}>
                                {grade.examType}
                              </Badge>
                              <Badge className={getStatusColor('graded')}>graded</Badge>
                            </div>
                            <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                              <span>{grade.subject}</span>
                              <span>•</span>
                              <span>
                                {grade.teacher?.user?.firstName} {grade.teacher?.user?.lastName}
                              </span>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(grade.examDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                            {grade.remarks && (
                              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-3">
                                <p className="text-sm">
                                  <span className="font-medium">Feedback:</span> {grade.remarks}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-3xl font-bold ${getGradeColor(
                              Number(grade.percentage) || 0,
                            )}`}
                          >
                            {grade.marks}/{grade.totalMarks}
                          </div>
                          <div
                            className={`text-sm ${getGradeColor(
                              Number(grade.percentage) || 0,
                            )}`}
                          >
                            {(Number(grade.percentage) || 0).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No grades found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Grade Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjectGrades.length > 0 ? (
                    subjectGrades.map((subject) => (
                      <div
                        key={subject.subject}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-3 h-3 ${subject.color} rounded-full`}
                          />
                          <span className="font-medium">{subject.subject}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={getGradeColor(subject.currentGrade)}>
                            {subject.currentGrade}%
                          </span>
                          {getTrendIcon(subject.trend)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No data yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Goals & Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjectGrades.filter((s) => s.currentGrade >= 90).map((s) => (
                    <div
                      key={s.subject}
                      className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                    >
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">{s.subject} Excellence</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Achieved 90%+ average
                        </p>
                      </div>
                    </div>
                  ))}
                  {subjectGrades.filter((s) => s.currentGrade >= 80 && s.currentGrade < 90).map(
                    (s) => (
                      <div
                        key={s.subject}
                        className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                      >
                        <Target className="h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="font-medium">{s.subject} Improvement</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Goal: Reach 90% average
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                  {subjectGrades.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No goals yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
