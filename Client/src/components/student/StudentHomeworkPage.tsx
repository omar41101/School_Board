import { useState, useMemo } from 'react';
import { useAppSelector } from '../../store/hooks';
import {
  useGetStudentMeQuery,
  useGetCoursesQuery,
  useGetAssignmentsQuery,
} from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  Download,
  Eye,
  Loader2,
} from 'lucide-react';
import type { Assignment } from '../../types';

export function StudentHomeworkPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const { data: studentMeData } = useGetStudentMeQuery(undefined, {
    skip: (user as { role?: string })?.role !== 'student',
  });
  const studentId = studentMeData?.data?.student?.id;

  const { data: coursesData } = useGetCoursesQuery(
    { student: studentId! },
    { skip: !studentId },
  );
  const courses = coursesData?.data?.courses || [];
  const courseIds = courses.map((c) => c.id).join(',');

  const { data: assignmentsData, isLoading, error } = useGetAssignmentsQuery(
    courseIds ? { courseIds } : undefined!,
    { skip: !courseIds },
  );

  const assignments = (assignmentsData?.data?.assignments || []) as Assignment[];

  const homework = useMemo(() => {
    return assignments.map((a) => {
      const due = new Date(a.dueDate);
      const now = new Date();
      const isOverdue = due < now && a.status !== 'closed';
      let status: 'pending' | 'submitted' | 'graded' | 'overdue' = 'pending';
      if (isOverdue) status = 'overdue';
      else if (a.status === 'closed') status = 'graded';
      else if ((a.submissions as { studentId?: number }[])?.some((s) => s.studentId === studentId))
        status = 'submitted';
      else status = 'pending';

      return {
        id: String(a.id),
        subject: a.course?.name || a.subject || 'Subject',
        teacher:
          a.teacher?.user?.firstName && a.teacher?.user?.lastName
            ? `${a.teacher.user.firstName} ${a.teacher.user.lastName}`
            : 'Teacher',
        title: a.title,
        description: a.description || '',
        dueDate: a.dueDate ? new Date(a.dueDate).toISOString().split('T')[0] : '',
        assignedDate: a.createdAt ? new Date(a.createdAt).toISOString().split('T')[0] : '',
        status,
        priority: 'medium' as const,
        estimatedTime: 90,
        submissionType: 'file' as const,
        grade: undefined,
        maxPoints: Number(a.totalMarks),
        feedback: undefined,
        attachments: (a.attachments as { name?: string }[])?.map((x) => x.name || '') || [],
      };
    });
  }, [assignments, studentId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'graded':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'submitted':
        return <Upload className="h-4 w-4" />;
      case 'graded':
        return <CheckCircle className="h-4 w-4" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const filteredHomework = homework.filter((hw) => {
    const matchesSearch =
      hw.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hw.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject =
      selectedSubject === 'all' || hw.subject.toLowerCase() === selectedSubject;
    const matchesStatus = selectedStatus === 'all' || hw.status === selectedStatus;
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const pendingCount = homework.filter((hw) => hw.status === 'pending').length;
  const overdueCount = homework.filter((hw) => hw.status === 'overdue').length;
  const submittedCount = homework.filter((hw) => hw.status === 'submitted').length;
  const gradedCount = homework.filter((hw) => hw.status === 'graded').length;

  const subjects = [...new Set(homework.map((h) => h.subject))];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading homework...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-gray-600 mb-4">Failed to load homework</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">My Homework</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track your assignments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
            <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">{pendingCount}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Upload className="h-12 w-12 text-blue-500 mx-auto mb-3" />
            <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">{submittedCount}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Submitted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">{gradedCount}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Graded</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
            <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">{overdueCount}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({homework.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
          <TabsTrigger value="submitted">Submitted ({submittedCount})</TabsTrigger>
          <TabsTrigger value="graded">Graded ({gradedCount})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({overdueCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 max-w-md">
                <Input
                  placeholder="Search homework..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
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
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="graded">Graded</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {filteredHomework.length > 0 ? (
                filteredHomework.map((hw) => {
                  const daysUntilDue = getDaysUntilDue(hw.dueDate);
                  return (
                    <Card key={hw.id} className="hover:shadow-lg transition-shadow duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="flex items-center justify-center w-12 h-12 bg-[#3E92CC]/10 rounded-lg">
                              {getStatusIcon(hw.status)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-[#0D1B2A] dark:text-white">
                                  {hw.title}
                                </h3>
                                <Badge className={getPriorityColor(hw.priority)}>
                                  {hw.priority}
                                </Badge>
                                <Badge className={getStatusColor(hw.status)}>{hw.status}</Badge>
                              </div>
                              <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                                <span>{hw.subject}</span>
                                <span>•</span>
                                <span>{hw.teacher}</span>
                                <span>•</span>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>Due: {hw.dueDate}</span>
                                </div>
                                <span>•</span>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>~{hw.estimatedTime}min</span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                {hw.description}
                              </p>
                              {hw.attachments && hw.attachments.length > 0 && (
                                <div className="flex items-center space-x-2 mb-3">
                                  <span className="text-xs text-gray-500">Attachments:</span>
                                  {hw.attachments.map((att, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      <Download className="mr-1 h-3 w-3" />
                                      {att}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              {daysUntilDue >= 0 && hw.status === 'pending' && (
                                <div
                                  className={`text-sm ${
                                    daysUntilDue <= 1
                                      ? 'text-red-600'
                                      : daysUntilDue <= 3
                                        ? 'text-yellow-600'
                                        : 'text-green-600'
                                  }`}
                                >
                                  {daysUntilDue === 0
                                    ? 'Due today!'
                                    : daysUntilDue === 1
                                      ? 'Due tomorrow'
                                      : `${daysUntilDue} days remaining`}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {hw.status === 'pending' && (
                              <Button
                                size="sm"
                                className="bg-[#3E92CC] hover:bg-[#2E82BC] text-white"
                              >
                                <Upload className="mr-2 h-4 w-4" />
                                Submit
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No homework assigned yet</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <div className="space-y-4">
            {homework
              .filter((hw) => hw.status === 'pending')
              .map((hw) => (
                <Card key={hw.id}>
                  <CardContent className="p-4">
                    <h3 className="font-medium">{hw.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {hw.subject} • Due: {hw.dueDate}
                    </p>
                  </CardContent>
                </Card>
              ))}
            {homework.filter((hw) => hw.status === 'pending').length === 0 && (
              <p className="text-gray-500 text-center py-4">No pending homework</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="submitted" className="mt-6">
          <div className="space-y-4">
            {homework
              .filter((hw) => hw.status === 'submitted')
              .map((hw) => (
                <Card key={hw.id}>
                  <CardContent className="p-4">
                    <h3 className="font-medium">{hw.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {hw.subject} • Due: {hw.dueDate}
                    </p>
                  </CardContent>
                </Card>
              ))}
            {homework.filter((hw) => hw.status === 'submitted').length === 0 && (
              <p className="text-gray-500 text-center py-4">No submitted homework</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="graded" className="mt-6">
          <div className="space-y-4">
            {homework
              .filter((hw) => hw.status === 'graded')
              .map((hw) => (
                <Card key={hw.id}>
                  <CardContent className="p-4">
                    <h3 className="font-medium">{hw.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {hw.subject} • Due: {hw.dueDate}
                    </p>
                  </CardContent>
                </Card>
              ))}
            {homework.filter((hw) => hw.status === 'graded').length === 0 && (
              <p className="text-gray-500 text-center py-4">No graded homework</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="overdue" className="mt-6">
          <div className="space-y-4">
            {homework
              .filter((hw) => hw.status === 'overdue')
              .map((hw) => (
                <Card key={hw.id}>
                  <CardContent className="p-4">
                    <h3 className="font-medium">{hw.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {hw.subject} • Due: {hw.dueDate}
                    </p>
                  </CardContent>
                </Card>
              ))}
            {homework.filter((hw) => hw.status === 'overdue').length === 0 && (
              <p className="text-gray-500 text-center py-4">No overdue homework</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
