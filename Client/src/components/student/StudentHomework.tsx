import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { 
  Clock, 
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle,
  Upload,
  Download,
  Eye,
  Play,
  Paperclip,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { assignmentApi, normalizeArrayResponse } from '../../lib/api';

interface Homework {
  id: string;
  title: string;
  subject: string;
  description: string;
  instructions: string;
  teacher: {
    id: string;
    name: string;
    avatar?: string;
  };
  type: 'assignment' | 'project' | 'essay' | 'lab' | 'presentation';
  assignedDate: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'submitted' | 'graded' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedTime: number; // in hours
  actualTime?: number;
  grade?: {
    score: number;
    maxScore: number;
    feedback: string;
    gradedDate: string;
  };
  attachments: {
    id: string;
    name: string;
    type: string;
    size: string;
    url: string;
  }[];
  submissions?: {
    id: string;
    fileName: string;
    submittedDate: string;
    size: string;
  }[];
  progress: number;
}

export function StudentHomework() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [homework, setHomework] = useState<Homework[]>([]);

  useEffect(() => {
    if (user?._id) {
      fetchHomework();
    }
  }, [user?._id]);

  const fetchHomework = async () => {
    try {
      setLoading(true);
      setError(null);

      const assignmentsResponse: any = await assignmentApi.getAll();
      const assignments = normalizeArrayResponse(assignmentsResponse);

      const homeworkItems: Homework[] = assignments.map((assignment: any) => ({
        id: assignment._id,
        title: assignment.title,
        subject: assignment.course?.name || 'Subject',
        description: assignment.description || '',
        instructions: assignment.description || 'Complete the assignment',
        teacher: assignment.teacher && typeof assignment.teacher === 'object' ? {
          id: assignment.teacher._id,
          name: `${assignment.teacher.firstName || ''} ${assignment.teacher.lastName || ''}`.trim(),
          avatar: assignment.teacher.avatar
        } : {
          id: '',
          name: 'Teacher',
        },
        type: 'assignment' as const,
        assignedDate: assignment.createdAt ? new Date(assignment.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        dueDate: assignment.dueDate ? new Date(assignment.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: assignment.status || (new Date(assignment.dueDate) < new Date() ? 'overdue' as const : 'pending' as const),
        priority: 'medium' as const,
        estimatedTime: 3,
        attachments: [],
        progress: assignment.status === 'submitted' ? 100 : 0
      }));

      setHomework(homeworkItems);
    } catch (err: any) {
      console.error('Failed to fetch homework:', err);
      setError(err.message || 'Failed to load homework');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Homework['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'submitted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'graded':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: Homework['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: Homework['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-600" />;
      case 'in_progress':
        return <Play className="h-4 w-4 text-blue-600" />;
      case 'submitted':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'graded':
        return <CheckCircle className="h-4 w-4 text-purple-600" />;
      case 'overdue':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: Homework['type']) => {
    switch (type) {
      case 'assignment':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'project':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'essay':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'lab':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'presentation':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredHomework = homework.filter((hw: Homework) => {
    if (activeTab === 'all') return true;
    return hw.status === activeTab;
  });

  const getHomeworkStats = () => {
    return {
      total: homework.length,
      pending: homework.filter((hw: Homework) => hw.status === 'pending').length,
      inProgress: homework.filter((hw: Homework) => hw.status === 'in_progress').length,
      submitted: homework.filter((hw: Homework) => hw.status === 'submitted').length,
      graded: homework.filter((hw: Homework) => hw.status === 'graded').length,
      overdue: homework.filter((hw: Homework) => hw.status === 'overdue').length
    };
  };

  const stats = getHomeworkStats();

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
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
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={fetchHomework}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">Homework & Assignments</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your assignments and track progress</p>
        </div>
        <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] dark:bg-[#3E92CC] dark:hover:bg-[#3E92CC]/80">
          <Upload className="mr-2 h-4 w-4" />
          Submit Work
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">{stats.total}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">{stats.pending}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Pending</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">In Progress</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.submitted}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Submitted</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.graded}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Graded</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Overdue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 max-w-3xl">
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress ({stats.inProgress})</TabsTrigger>
          <TabsTrigger value="submitted">Submitted ({stats.submitted})</TabsTrigger>
          <TabsTrigger value="graded">Graded ({stats.graded})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({stats.overdue})</TabsTrigger>
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredHomework.map((homework) => (
              <Card key={homework.id} className="border-0 shadow-md bg-white dark:bg-[#1B2B3A] hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={`text-xs px-2 py-1 ${getStatusColor(homework.status)}`}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(homework.status)}
                            <span className="capitalize">{homework.status.replace('_', ' ')}</span>
                          </div>
                        </Badge>
                        <Badge className={`text-xs px-2 py-1 ${getTypeColor(homework.type)}`}>
                          {homework.type.charAt(0).toUpperCase() + homework.type.slice(1)}
                        </Badge>
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(homework.priority)}`}></div>
                      </div>
                      <CardTitle className="text-lg mb-1">{homework.title}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{homework.subject}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{homework.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300 mb-1">
                        <Calendar className="h-4 w-4" />
                        <span>Due: {homework.dueDate}</span>
                      </div>
                      <div className={`text-sm font-medium ${
                        getDaysUntilDue(homework.dueDate) < 0 ? 'text-red-600' :
                        getDaysUntilDue(homework.dueDate) <= 1 ? 'text-orange-600' :
                        'text-green-600'
                      }`}>
                        {getDaysUntilDue(homework.dueDate) < 0 
                          ? `${Math.abs(getDaysUntilDue(homework.dueDate))} days overdue`
                          : getDaysUntilDue(homework.dueDate) === 0 
                          ? 'Due today'
                          : `${getDaysUntilDue(homework.dueDate)} days left`
                        }
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Teacher */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-[#0D1B2A]/50 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={homework.teacher.avatar} />
                      <AvatarFallback className="bg-[#3E92CC] text-white text-xs">
                        {homework.teacher.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#0D1B2A] dark:text-white">
                        {homework.teacher.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Instructor</p>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
                      <Clock className="h-4 w-4" />
                      <span>{homework.estimatedTime}h estimated</span>
                    </div>
                  </div>

                  {/* Progress */}
                  {homework.status === 'in_progress' && (
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-300">Progress</span>
                        <span className="font-medium text-[#0D1B2A] dark:text-white">
                          {homework.progress}%
                        </span>
                      </div>
                      <Progress value={homework.progress} className="h-2" />
                    </div>
                  )}

                  {/* Grade */}
                  {homework.grade && (
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                          Grade Received
                        </span>
                        <span className="text-lg font-bold text-purple-700 dark:text-purple-300">
                          {homework.grade.score}/{homework.grade.maxScore} ({((homework.grade.score / homework.grade.maxScore) * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <p className="text-sm text-purple-600 dark:text-purple-400 italic">
                        "{homework.grade.feedback}"
                      </p>
                      <p className="text-xs text-purple-500 dark:text-purple-400 mt-1">
                        Graded on {homework.grade.gradedDate}
                      </p>
                    </div>
                  )}

                  {/* Attachments */}
                  {homework.attachments.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-[#0D1B2A] dark:text-white mb-2">Attachments:</p>
                      <div className="space-y-2">
                        {homework.attachments.map((attachment) => (
                          <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-[#0D1B2A] rounded">
                            <div className="flex items-center space-x-2">
                              <Paperclip className="h-4 w-4 text-[#3E92CC]" />
                              <span className="text-sm text-[#0D1B2A] dark:text-white">{attachment.name}</span>
                              <span className="text-xs text-gray-500">({attachment.size})</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submissions */}
                  {homework.submissions && homework.submissions.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-[#0D1B2A] dark:text-white mb-2">Your Submissions:</p>
                      <div className="space-y-2">
                        {homework.submissions.map((submission) => (
                          <div key={submission.id} className="flex items-center justify-between p-2 bg-green-100 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-green-700 dark:text-green-300">{submission.fileName}</span>
                              <span className="text-xs text-green-600 dark:text-green-400">({submission.size})</span>
                            </div>
                            <span className="text-xs text-green-600 dark:text-green-400">
                              Submitted {submission.submittedDate}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center space-x-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                    {homework.status !== 'graded' && homework.status !== 'submitted' && (
                      <Button size="sm" className="bg-[#3E92CC] hover:bg-[#3E92CC]/80">
                        <Upload className="mr-2 h-4 w-4" />
                        Submit
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Ask Question
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredHomework.length === 0 && (
            <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
              <CardContent className="p-12 text-center">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#0D1B2A] dark:text-white mb-2">
                  No homework found
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  No assignments found for the selected status.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}