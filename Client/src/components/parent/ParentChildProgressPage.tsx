import React, { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import {
  useGetParentMeQuery,
  useGetGradesQuery,
  useGetAttendanceQuery,
} from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import {
  TrendingUp,
  TrendingDown,
  BookOpen,
  Calendar,
  Clock,
  User,
  MessageSquare,
  FileText,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Target,
  Star,
  Loader2,
} from 'lucide-react';
import type { Student, Grade, Attendance } from '../../types';

export function ParentChildProgressPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [selectedChild, setSelectedChild] = useState<string>('');
  const [selectedTerm, setSelectedTerm] = useState('current');

  const { data: parentMeData, isLoading: parentLoading } = useGetParentMeQuery(undefined, {
    skip: (user as { role?: string })?.role !== 'parent',
  });

  const children = (parentMeData?.data?.parent?.children || []) as Student[];
  const currentChild = children.find((c) => String(c.id) === selectedChild) || children[0];
  const childId = currentChild?.id;

  const { data: gradesData, isLoading: gradesLoading } = useGetGradesQuery(
    { student: childId! },
    { skip: !childId },
  );
  const { data: attendanceData } = useGetAttendanceQuery(
    { student: childId! },
    { skip: !childId },
  );

  const grades = (gradesData?.data?.grades || []) as Grade[];
  const attendanceList = (attendanceData?.data?.attendance || []) as Attendance[];

  const subjects = [...new Set(grades.map((g) => g.subject))];
  const subjectGrades = subjects.map((subject) => {
    const subjectGradesList = grades.filter((g) => g.subject === subject);
    const avg =
      subjectGradesList.length > 0
        ? subjectGradesList.reduce((acc, g) => acc + (Number(g.percentage) || 0), 0) /
          subjectGradesList.length
        : 0;
    const prevGrades = subjectGradesList.slice(0, -1);
    const prevAvg =
      prevGrades.length > 0
        ? prevGrades.reduce((acc, g) => acc + (Number(g.percentage) || 0), 0) / prevGrades.length
        : avg;
    const trend: 'up' | 'down' | 'stable' =
      avg > prevAvg ? 'up' : avg < prevAvg ? 'down' : 'stable';
    const lastGrade = subjectGradesList[subjectGradesList.length - 1];
    return {
      id: subject,
      subject,
      teacher:
        lastGrade?.teacher?.user?.firstName && lastGrade?.teacher?.user?.lastName
          ? `${lastGrade.teacher.user.firstName} ${lastGrade.teacher.user.lastName}`
          : 'Teacher',
      currentGrade: Math.round(avg * 10) / 10,
      previousGrade: Math.round(prevAvg * 10) / 10,
      trend,
      assignments: subjectGradesList.length,
      nextExam: lastGrade?.examDate
        ? new Date(lastGrade.examDate).toLocaleDateString()
        : 'TBD',
      lastAssignment: lastGrade
        ? {
            title: `${lastGrade.subject} - ${lastGrade.examType}`,
            grade: Number(lastGrade.percentage) || 0,
            date: new Date(lastGrade.examDate).toLocaleDateString(),
          }
        : { title: '-', grade: 0, date: '-' },
    };
  });

  const presentCount = attendanceList.filter((a) => a.status === 'present').length;
  const absentCount = attendanceList.filter((a) => a.status === 'absent').length;
  const lateCount = attendanceList.filter((a) => a.status === 'late').length;
  const totalDays = attendanceList.length || 1;
  const attendancePercentage = Math.round((presentCount / totalDays) * 1000) / 10;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <div className="w-4 h-1 bg-gray-400 rounded" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const overallAverage =
    subjectGrades.length > 0
      ? subjectGrades.reduce((acc, s) => acc + s.currentGrade, 0) / subjectGrades.length
      : 0;

  if (parentLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <User className="h-16 w-16 text-gray-300 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">No children linked to your account</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">Child Progress</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor your child&apos;s academic performance and development
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select
            value={selectedChild || String(children[0]?.id)}
            onValueChange={setSelectedChild}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select child" />
            </SelectTrigger>
            <SelectContent>
              {children.map((child) => (
                <SelectItem key={child.id} value={String(child.id)}>
                  {child.user?.firstName} {child.user?.lastName} - {child.className}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] text-white">
            <MessageSquare className="mr-2 h-4 w-4" />
            Contact Teacher
          </Button>
        </div>
      </div>

      {currentChild && (
        <>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={currentChild.user?.avatar} alt="" />
                  <AvatarFallback className="text-lg">
                    {currentChild.user?.firstName?.[0]}
                    {currentChild.user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-[#0D1B2A] dark:text-white">
                    {currentChild.user?.firstName} {currentChild.user?.lastName}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {currentChild.level} • Class {currentChild.className} • ID: {currentChild.matricule}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-2xl font-bold text-[#3E92CC]">
                      {overallAverage.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Overall Average</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {attendancePercentage}%
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Attendance</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">
                      {subjects.length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Subjects</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="academics" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="academics">Academic Performance</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="behavior">Behavior</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </TabsList>

            <TabsContent value="academics" className="mt-6">
              <div className="space-y-6">
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

                {gradesLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : subjectGrades.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {subjectGrades.map((subject) => (
                      <Card
                        key={subject.id}
                        className="hover:shadow-lg transition-shadow duration-200"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-10 h-10 bg-[#3E92CC]/10 rounded-lg flex items-center justify-center">
                                <BookOpen className="h-5 w-5 text-[#3E92CC]" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{subject.subject}</CardTitle>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {subject.teacher}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`text-2xl font-bold ${getGradeColor(subject.currentGrade)}`}
                                >
                                  {subject.currentGrade}%
                                </span>
                                {getTrendIcon(subject.trend)}
                              </div>
                              <p className={`text-sm ${getTrendColor(subject.trend)}`}>
                                {subject.trend === 'up' &&
                                  `+${(subject.currentGrade - subject.previousGrade).toFixed(1)}`}
                                {subject.trend === 'down' &&
                                  (subject.currentGrade - subject.previousGrade).toFixed(1)}
                                {subject.trend === 'stable' && 'No change'}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="flex items-center justify-center space-x-1 mb-1">
                                <FileText className="h-4 w-4 text-[#3E92CC]" />
                                <span className="text-sm font-medium">Assignments</span>
                              </div>
                              <p className="text-xl font-bold text-[#0D1B2A] dark:text-white">
                                {subject.assignments}
                              </p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="flex items-center justify-center space-x-1 mb-1">
                                <Calendar className="h-4 w-4 text-[#3E92CC]" />
                                <span className="text-sm font-medium">Next Exam</span>
                              </div>
                              <p className="text-sm font-bold text-[#0D1B2A] dark:text-white">
                                {subject.nextExam}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Last Assignment</h4>
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">
                                  {subject.lastAssignment.title}
                                </span>
                                <span
                                  className={`text-sm font-bold ${getGradeColor(subject.lastAssignment.grade)}`}
                                >
                                  {subject.lastAssignment.grade}%
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                Submitted: {subject.lastAssignment.date}
                              </p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="w-full">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            View Detailed Report
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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

            <TabsContent value="attendance" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {attendancePercentage}%
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">Overall Attendance Rate</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span>Present Days</span>
                        </div>
                        <span className="font-bold">{presentCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="h-5 w-5 text-red-600" />
                          <span>Absent Days</span>
                        </div>
                        <span className="font-bold">{absentCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-yellow-600" />
                          <span>Tardy Days</span>
                        </div>
                        <span className="font-bold">{lateCount}</span>
                      </div>
                      <div className="flex items-center justify-between border-t pt-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5 text-gray-600" />
                          <span>Total School Days</span>
                        </div>
                        <span className="font-bold">{totalDays}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Attendance Progress</span>
                        <span>{attendancePercentage}%</span>
                      </div>
                      <Progress value={attendancePercentage} className="w-full" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Attendance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {attendanceList.length > 0 ? (
                      <div className="space-y-2">
                        {attendanceList.slice(0, 10).map((a) => (
                          <div
                            key={a.id}
                            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                          >
                            <span>{new Date(a.date).toLocaleDateString()}</span>
                            <Badge
                              variant={
                                a.status === 'present'
                                  ? 'default'
                                  : a.status === 'absent'
                                    ? 'destructive'
                                    : 'secondary'
                              }
                            >
                              {a.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No attendance data</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="behavior" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Behavior Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Behavior notes will appear here when teachers add them.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Academic Strengths</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {subjectGrades
                        .filter((s) => s.currentGrade >= 90)
                        .map((s) => (
                          <div
                            key={s.subject}
                            className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                          >
                            <Star className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-medium">{s.subject} Excellence</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Consistently high performance
                              </p>
                            </div>
                          </div>
                        ))}
                      {subjectGrades.filter((s) => s.currentGrade >= 90).length === 0 && (
                        <p className="text-gray-500 text-center py-4">No data yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Areas for Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {subjectGrades
                        .filter((s) => s.currentGrade < 80 && s.currentGrade > 0)
                        .map((s) => (
                          <div
                            key={s.subject}
                            className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                          >
                            <Target className="h-5 w-5 text-yellow-600" />
                            <div>
                              <p className="font-medium">{s.subject} Improvement</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Goal: Reach 80% average
                              </p>
                            </div>
                          </div>
                        ))}
                      {subjectGrades.filter((s) => s.currentGrade < 80 && s.currentGrade > 0)
                        .length === 0 && (
                        <p className="text-gray-500 text-center py-4">No areas identified</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
