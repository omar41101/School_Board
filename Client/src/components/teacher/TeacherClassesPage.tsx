import { useState, useMemo } from 'react';
import { useAppSelector } from '../../store/hooks';
import {
  useGetTeacherMeQuery,
  useGetCoursesQuery,
  useGetGradesQuery,
  useGetAttendanceQuery,
} from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  Users,
  BookOpen,
  Clock,
  Calendar,
  FileText,
  Plus,
  Eye,
  Edit,
  MessageSquare,
  Award,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Loader2,
} from 'lucide-react';
import type { Course, Grade, Attendance } from '../../types';

export function TeacherClassesPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: teacherMeData, isLoading: teacherLoading } = useGetTeacherMeQuery(undefined, {
    skip: (user as { role?: string })?.role !== 'teacher',
  });

  const teacherId = teacherMeData?.data?.teacher?.id;

  const { data: coursesData, isLoading: coursesLoading } = useGetCoursesQuery(
    { teacher: teacherId! },
    { skip: !teacherId },
  );

  const courses = (coursesData?.data?.courses || []) as Course[];

  const { data: gradesData } = useGetGradesQuery({ teacher: teacherId! }, { skip: !teacherId });
  const { data: attendanceData } = useGetAttendanceQuery(
    { teacher: teacherId! },
    { skip: !teacherId },
  );

  const grades = (gradesData?.data?.grades || []) as Grade[];
  const attendanceList = (attendanceData?.data?.attendance || []) as Attendance[];

  const classData = useMemo(() => {
    return courses.map((course) => {
      const courseGrades = grades.filter((g) => g.courseId === course.id);
      const courseAttendance = attendanceList.filter((a) => a.courseId === course.id);
      const enrolledCount = (course.enrolledStudents as number[] | null)?.length || 0;
      const avgGrade =
        courseGrades.length > 0
          ? courseGrades.reduce((acc, g) => acc + (Number(g.percentage) || 0), 0) /
            courseGrades.length
          : 0;
      const presentCount = courseAttendance.filter((a) => a.status === 'present').length;
      const attendanceRate =
        courseAttendance.length > 0
          ? Math.round((presentCount / courseAttendance.length) * 100)
          : 0;
      const schedule = (course.schedule || []) as { day?: string; startTime?: string }[];
      const nextSlot = schedule[0];
      return {
        id: String(course.id),
        name: `${course.name} (${course.code})`,
        subject: course.subject,
        level: course.level,
        students: enrolledCount,
        avgGrade: Math.round(avgGrade * 10) / 10,
        attendance: attendanceRate,
        nextClass: nextSlot
          ? `${nextSlot.day} at ${nextSlot.startTime || 'TBA'}`
          : 'TBA',
        room: (schedule[0] as { room?: string })?.room || 'TBA',
        schedule,
      };
    });
  }, [courses, grades, attendanceList]);

  const studentsByCourse = useMemo(() => {
    const map: Record<number, { id: number; name: string; avatar?: string; grade: number; attendance: number }[]> = {};
    courses.forEach((course) => {
      const enrolledIds = (course.enrolledStudents as number[]) || [];
      const courseGrades = grades.filter((g) => g.courseId === course.id);
      const courseAttendance = attendanceList.filter((a) => a.courseId === course.id);
      const students = enrolledIds.map((studentId) => {
        const studentGrades = courseGrades.filter((g) => g.studentId === studentId);
        const studentAttendance = courseAttendance.filter((a) => a.studentId === studentId);
        const avgGrade =
          studentGrades.length > 0
            ? studentGrades.reduce((acc, g) => acc + (Number(g.percentage) || 0), 0) /
              studentGrades.length
            : 0;
        const presentCount = studentAttendance.filter((a) => a.status === 'present').length;
        const attRate =
          studentAttendance.length > 0
            ? Math.round((presentCount / studentAttendance.length) * 100)
            : 0;
        return {
          id: studentId,
          name: `Student ${studentId}`,
          avatar: undefined,
          grade: Math.round(avgGrade * 10) / 10,
          attendance: attRate,
        };
      });
      map[course.id] = students;
    });
    return map;
  }, [courses, grades, attendanceList]);

  const allStudents = useMemo(() => {
    const seen = new Set<number>();
    const list: { id: number; name: string; avatar?: string; grade: number; attendance: number; courseId: number }[] = [];
    Object.entries(studentsByCourse).forEach(([courseIdStr, students]) => {
      const courseId = parseInt(courseIdStr);
      students.forEach((s) => {
        if (!seen.has(s.id)) {
          seen.add(s.id);
          list.push({ ...s, courseId });
        }
      });
    });
    return list;
  }, [studentsByCourse]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'needs_attention':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatus = (grade: number, attendance: number) => {
    if (grade >= 90 && attendance >= 95) return 'excellent';
    if (grade >= 80 && attendance >= 90) return 'good';
    if (grade < 70 || attendance < 80) return 'critical';
    return 'needs_attention';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="h-4 w-4" />;
      case 'good':
        return <TrendingUp className="h-4 w-4" />;
      case 'needs_attention':
        return <AlertCircle className="h-4 w-4" />;
      case 'critical':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const filteredStudents = allStudents.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass =
      selectedClass === 'all' || String(s.courseId) === selectedClass;
    return matchesSearch && matchesClass;
  });

  if (teacherLoading || coursesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading classes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">My Classes</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your classes and monitor student progress
          </p>
        </div>
        <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] text-white">
          <Plus className="mr-2 h-4 w-4" />
          Create Assignment
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Class Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {classData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classData.map((cls) => (
                <Card
                  key={cls.id}
                  className="hover:shadow-lg transition-shadow duration-200"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-[#3E92CC]/10 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-[#3E92CC]" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{cls.name}</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {cls.level}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <Users className="h-4 w-4 text-[#3E92CC]" />
                          <span className="text-sm font-medium">Students</span>
                        </div>
                        <p className="text-xl font-bold text-[#0D1B2A] dark:text-white">
                          {cls.students}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <Award className="h-4 w-4 text-[#3E92CC]" />
                          <span className="text-sm font-medium">Avg Grade</span>
                        </div>
                        <p className="text-xl font-bold text-[#0D1B2A] dark:text-white">
                          {cls.avgGrade}%
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Attendance Rate</span>
                        <span className="font-medium">{cls.attendance}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-[#3E92CC] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${cls.attendance}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>Next class: {cls.nextClass}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Room: {cls.room}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-[#3E92CC] hover:bg-[#2E82BC] text-white"
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        View Class
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No classes assigned yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="students" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 max-w-md">
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classData.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {filteredStudents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((student) => {
                  const status = getStatus(student.grade, student.attendance);
                  return (
                    <Card
                      key={`${student.id}-${student.courseId}`}
                      className="hover:shadow-lg transition-shadow duration-200"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={student.avatar} alt="" />
                            <AvatarFallback>{student.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold text-[#0D1B2A] dark:text-white">
                              {student.name}
                            </h3>
                            <Badge className={`${getStatusColor(status)} text-xs`}>
                              {getStatusIcon(status)}
                              <span className="ml-1 capitalize">
                                {status.replace('_', ' ')}
                              </span>
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Current Grade
                            </p>
                            <p className="text-lg font-bold text-[#0D1B2A] dark:text-white">
                              {student.grade}%
                            </p>
                          </div>
                          <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Attendance
                            </p>
                            <p className="text-lg font-bold text-[#0D1B2A] dark:text-white">
                              {student.attendance}%
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="mr-1 h-3 w-3" />
                            Profile
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No students found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Class Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {classData.map((cls) => (
                    <div
                      key={cls.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{cls.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {cls.students} students
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#3E92CC]">{cls.avgGrade}%</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Average Grade
                        </p>
                      </div>
                    </div>
                  ))}
                  {classData.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No data yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Student Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['excellent', 'good', 'needs_attention', 'critical'].map((status) => {
                    const count = filteredStudents.filter(
                      (s) => getStatus(s.grade, s.attendance) === status,
                    ).length;
                    const pct =
                      filteredStudents.length > 0
                        ? Math.round((count / filteredStudents.length) * 100)
                        : 0;
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(status)}
                          <span className="capitalize">{status.replace('_', ' ')}</span>
                        </div>
                        <span className="font-medium">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
