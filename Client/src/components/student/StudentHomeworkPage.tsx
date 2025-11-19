import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { 
  FileText,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Upload,
  Download,
  Search,
  Filter,
  Plus,
  Eye,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { assignmentApi, normalizeArrayResponse } from '../../lib/api';

interface Homework {
  id: string;
  subject: string;
  teacher: string;
  title: string;
  description: string;
  dueDate: string;
  assignedDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  estimatedTime: number; // in minutes
  attachments?: string[];
  submissionType: 'file' | 'text' | 'both';
  grade?: number;
  maxPoints?: number;
  feedback?: string;
}

export function StudentHomeworkPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
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
        subject: assignment.course?.name || 'Subject',
        teacher: assignment.teacher && typeof assignment.teacher === 'object' 
          ? `${assignment.teacher.firstName || ''} ${assignment.teacher.lastName || ''}`.trim()
          : 'Teacher',
        title: assignment.title,
        description: assignment.description || '',
        dueDate: assignment.dueDate ? new Date(assignment.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        assignedDate: assignment.createdAt ? new Date(assignment.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: assignment.status || (new Date(assignment.dueDate) < new Date() ? 'overdue' as const : 'pending' as const),
        priority: 'medium' as const,
        estimatedTime: 90,
        submissionType: 'file' as const
      }));

      setHomework(homeworkItems);
    } catch (err: any) {
      console.error('Failed to fetch homework:', err);
      setError(err.message || 'Failed to load homework');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'graded': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'submitted': return <Upload className="h-4 w-4" />;
      case 'graded': return <CheckCircle className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredHomework = homework.filter((hw: Homework) => {
    const matchesSearch = hw.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hw.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || hw.subject.toLowerCase() === selectedSubject;
    const matchesStatus = selectedStatus === 'all' || hw.status === selectedStatus;
    
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const pendingCount = homework.filter((hw: Homework) => hw.status === 'pending').length;
  const overdueCount = homework.filter((hw: Homework) => hw.status === 'overdue').length;
  const submittedCount = homework.filter((hw: Homework) => hw.status === 'submitted').length;
  const gradedCount = homework.filter((hw: Homework) => hw.status === 'graded').length;

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">My Homework</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track your assignments</p>
        </div>
      </div>

      {/* Summary Cards */}
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
            {/* Filters */}
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
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="literature">Literature</SelectItem>
                  <SelectItem value="history">History</SelectItem>
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

            {/* Homework List */}
            <div className="space-y-4">
              {filteredHomework.map((homework) => {
                const daysUntilDue = getDaysUntilDue(homework.dueDate);
                
                return (
                  <Card key={homework.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="flex items-center justify-center w-12 h-12 bg-[#3E92CC]/10 rounded-lg">
                            {getStatusIcon(homework.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-[#0D1B2A] dark:text-white">
                                {homework.title}
                              </h3>
                              <Badge className={getPriorityColor(homework.priority)}>
                                {homework.priority}
                              </Badge>
                              <Badge className={getStatusColor(homework.status)}>
                                {homework.status}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                              <span>{homework.subject}</span>
                              <span>•</span>
                              <span>{homework.teacher}</span>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>Due: {homework.dueDate}</span>
                              </div>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>~{homework.estimatedTime}min</span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {homework.description}
                            </p>
                            
                            {homework.attachments && homework.attachments.length > 0 && (
                              <div className="flex items-center space-x-2 mb-3">
                                <span className="text-xs text-gray-500">Attachments:</span>
                                {homework.attachments.map((attachment, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    <Download className="mr-1 h-3 w-3" />
                                    {attachment}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            
                            {homework.status === 'graded' && homework.grade && (
                              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg mb-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium">Grade: {homework.grade}/{homework.maxPoints}</span>
                                  <span className="text-green-600 font-bold">
                                    {Math.round((homework.grade / homework.maxPoints!) * 100)}%
                                  </span>
                                </div>
                                {homework.feedback && (
                                  <p className="text-sm">
                                    <span className="font-medium">Feedback:</span> {homework.feedback}
                                  </p>
                                )}
                              </div>
                            )}
                            
                            {daysUntilDue >= 0 && homework.status === 'pending' && (
                              <div className={`text-sm ${daysUntilDue <= 1 ? 'text-red-600' : daysUntilDue <= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                                {daysUntilDue === 0 ? 'Due today!' : 
                                 daysUntilDue === 1 ? 'Due tomorrow' : 
                                 `${daysUntilDue} days remaining`}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {homework.status === 'pending' && (
                            <Button size="sm" className="bg-[#3E92CC] hover:bg-[#2E82BC] text-white">
                              <Upload className="mr-2 h-4 w-4" />
                              Submit
                            </Button>
                          )}
                          {homework.status === 'graded' && (
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <div className="space-y-4">
            {homework.filter((hw: Homework) => hw.status === 'pending').map((homeworkItem: Homework) => (
              <Card key={homeworkItem.id}>
                <CardContent className="p-4">
                  <h3 className="font-medium">{homeworkItem.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{homeworkItem.subject} • Due: {homeworkItem.dueDate}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="submitted" className="mt-6">
          <div className="space-y-4">
            {homework.filter((hw: Homework) => hw.status === 'submitted').map((homeworkItem: Homework) => (
              <Card key={homeworkItem.id}>
                <CardContent className="p-4">
                  <h3 className="font-medium">{homeworkItem.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{homeworkItem.subject} • Due: {homeworkItem.dueDate}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="graded" className="mt-6">
          <div className="space-y-4">
            {homework.filter((hw: Homework) => hw.status === 'graded').map((homeworkItem: Homework) => (
              <Card key={homeworkItem.id}>
                <CardContent className="p-4">
                  <h3 className="font-medium">{homeworkItem.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{homeworkItem.subject} • Due: {homeworkItem.dueDate}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="overdue" className="mt-6">
          <div className="space-y-4">
            {homework.filter((hw: Homework) => hw.status === 'overdue').map((homeworkItem: Homework) => (
              <Card key={homeworkItem.id}>
                <CardContent className="p-4">
                  <h3 className="font-medium">{homeworkItem.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{homeworkItem.subject} • Due: {homeworkItem.dueDate}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}