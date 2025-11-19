import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { 
  FileText, 
  Plus, 
  Edit,
  Save,
  Calendar,
  Clock,
  User,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Award,
  AlertCircle,
  CheckCircle,
  Search,
  Filter
} from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  class: string;
  type: 'homework' | 'quiz' | 'exam' | 'project';
  totalPoints: number;
  dueDate: string;
  assignedDate: string;
  status: 'active' | 'completed' | 'overdue';
  submissions: number;
  totalStudents: number;
  averageGrade: number;
}

interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  assignmentId: string;
  assignmentTitle: string;
  grade: number;
  totalPoints: number;
  submittedDate: string;
  feedback: string;
  status: 'graded' | 'pending' | 'late' | 'absent';
}

export function TeacherGradesPage() {
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedAssignment, setSelectedAssignment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    type: '',
    totalPoints: '',
    dueDate: '',
    description: ''
  });

  const mockAssignments: Assignment[] = [
    {
      id: '1',
      title: 'Quadratic Equations Test',
      subject: 'Mathematics',
      class: '10-A',
      type: 'exam',
      totalPoints: 100,
      dueDate: '2024-01-25',
      assignedDate: '2024-01-18',
      status: 'active',
      submissions: 22,
      totalStudents: 28,
      averageGrade: 82.5
    },
    {
      id: '2',
      title: 'Algebra Problem Set',
      subject: 'Mathematics',
      class: '11-B',
      type: 'homework',
      totalPoints: 50,
      dueDate: '2024-01-20',
      assignedDate: '2024-01-15',
      status: 'completed',
      submissions: 24,
      totalStudents: 24,
      averageGrade: 78.3
    },
    {
      id: '3',
      title: 'Calculus Project',
      subject: 'Mathematics',
      class: '12-A',
      type: 'project',
      totalPoints: 150,
      dueDate: '2024-01-30',
      assignedDate: '2024-01-10',
      status: 'active',
      submissions: 18,
      totalStudents: 22,
      averageGrade: 85.7
    }
  ];

  const mockGrades: Grade[] = [
    {
      id: '1',
      studentId: 'STU001',
      studentName: 'Emma Johnson',
      studentAvatar: '/api/placeholder/40/40',
      assignmentId: '1',
      assignmentTitle: 'Quadratic Equations Test',
      grade: 92,
      totalPoints: 100,
      submittedDate: '2024-01-23',
      feedback: 'Excellent work! Great understanding of the concepts.',
      status: 'graded'
    },
    {
      id: '2',
      studentId: 'STU002',
      studentName: 'Lucas Martin',
      studentAvatar: '/api/placeholder/40/40',
      assignmentId: '1',
      assignmentTitle: 'Quadratic Equations Test',
      grade: 0,
      totalPoints: 100,
      submittedDate: '',
      feedback: '',
      status: 'pending'
    },
    {
      id: '3',
      studentId: 'STU003',
      studentName: 'Sophie Davis',
      studentAvatar: '/api/placeholder/40/40',
      assignmentId: '1',
      assignmentTitle: 'Quadratic Equations Test',
      grade: 76,
      totalPoints: 100,
      submittedDate: '2024-01-25',
      feedback: 'Good effort, but review factoring methods.',
      status: 'late'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'homework': return 'bg-blue-100 text-blue-800';
      case 'quiz': return 'bg-green-100 text-green-800';
      case 'exam': return 'bg-red-100 text-red-800';
      case 'project': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'graded': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'late': return 'bg-orange-100 text-orange-800';
      case 'absent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeColor = (grade: number, total: number) => {
    const percentage = (grade / total) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">Grades & Assignments</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage assignments and track student performance</p>
        </div>
        <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] text-white">
          <Plus className="mr-2 h-4 w-4" />
          New Assignment
        </Button>
      </div>

      <Tabs defaultValue="assignments" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="grades">Grade Book</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="create">Create Assignment</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 max-w-md">
                <Input 
                  placeholder="Search assignments..." 
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
                  <SelectItem value="10-A">10-A Mathematics</SelectItem>
                  <SelectItem value="11-B">11-B Advanced Math</SelectItem>
                  <SelectItem value="12-A">12-A Calculus</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {mockAssignments.map((assignment) => (
                <Card key={assignment.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-[#3E92CC]/10 rounded-lg">
                          <FileText className="h-6 w-6 text-[#3E92CC]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-[#0D1B2A] dark:text-white">
                              {assignment.title}
                            </h3>
                            <Badge className={getTypeColor(assignment.type)}>
                              {assignment.type}
                            </Badge>
                            <Badge variant="outline">{assignment.class}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div className="flex items-center space-x-2 text-sm">
                              <Award className="h-4 w-4 text-gray-400" />
                              <span>{assignment.totalPoints} points</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span>Due: {assignment.dueDate}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <User className="h-4 w-4 text-gray-400" />
                              <span>{assignment.submissions}/{assignment.totalStudents} submitted</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <TrendingUp className="h-4 w-4 text-gray-400" />
                              <span>Avg: {assignment.averageGrade}%</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Submission Progress:</span>
                            <div className="flex-1 max-w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-[#3E92CC] h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(assignment.submissions / assignment.totalStudents) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">
                              {Math.round((assignment.submissions / assignment.totalStudents) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="bg-[#3E92CC] hover:bg-[#2E82BC] text-white">
                          Grade
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="grades" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 max-w-md">
                <Input placeholder="Search students..." />
              </div>
              <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select assignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignments</SelectItem>
                  {mockAssignments.map((assignment) => (
                    <SelectItem key={assignment.id} value={assignment.id}>
                      {assignment.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {mockGrades.map((grade) => (
                <Card key={grade.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={grade.studentAvatar} alt={grade.studentName} />
                          <AvatarFallback>{grade.studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-[#0D1B2A] dark:text-white">
                              {grade.studentName}
                            </h3>
                            <Badge className={getStatusColor(grade.status)}>
                              {grade.status}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Assignment: {grade.assignmentTitle}
                          </p>
                          
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm">Grade:</span>
                              <span className={`text-lg font-bold ${getGradeColor(grade.grade, grade.totalPoints)}`}>
                                {grade.grade}/{grade.totalPoints}
                              </span>
                              <span className="text-sm text-gray-500">
                                ({Math.round((grade.grade / grade.totalPoints) * 100)}%)
                              </span>
                            </div>
                            {grade.submittedDate && (
                              <div className="flex items-center space-x-2 text-sm">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span>Submitted: {grade.submittedDate}</span>
                              </div>
                            )}
                          </div>
                          
                          {grade.feedback && (
                            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <p className="text-sm">
                                <span className="font-medium">Feedback:</span> {grade.feedback}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="bg-[#3E92CC] hover:bg-[#2E82BC] text-white">
                          <Save className="mr-1 h-4 w-4" />
                          Update
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <FileText className="h-8 w-8 text-[#3E92CC]" />
                  <div>
                    <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">12</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Assignments</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">89%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Submission Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Award className="h-8 w-8 text-[#3E92CC]" />
                  <div>
                    <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">82.1%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Class Average</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">7</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pending Grades</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>A (90-100%)</span>
                    <span className="font-medium">32%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>B (80-89%)</span>
                    <span className="font-medium">41%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>C (70-79%)</span>
                    <span className="font-medium">19%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>D (60-69%)</span>
                    <span className="font-medium">6%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>F (Below 60%)</span>
                    <span className="font-medium">2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assignment Types Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-[#3E92CC] rounded-full"></div>
                      <span>Homework</span>
                    </div>
                    <span className="font-medium">85.3%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Quizzes</span>
                    </div>
                    <span className="font-medium">78.9%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Exams</span>
                    </div>
                    <span className="font-medium">82.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span>Projects</span>
                    </div>
                    <span className="font-medium">88.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <div className="max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Create New Assignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Assignment Title</Label>
                    <Input 
                      id="title"
                      placeholder="Enter assignment title"
                      value={newAssignment.title}
                      onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Assignment Type</Label>
                    <Select value={newAssignment.type} onValueChange={(value) => setNewAssignment({...newAssignment, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="homework">Homework</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="exam">Exam</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="points">Total Points</Label>
                    <Input 
                      id="points"
                      type="number"
                      placeholder="100"
                      value={newAssignment.totalPoints}
                      onChange={(e) => setNewAssignment({...newAssignment, totalPoints: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input 
                      id="dueDate"
                      type="date"
                      value={newAssignment.dueDate}
                      onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    placeholder="Assignment instructions and details..."
                    rows={4}
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                  />
                </div>

                <Separator />

                <div className="flex justify-end space-x-4">
                  <Button variant="outline">
                    Save as Draft
                  </Button>
                  <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] text-white">
                    Create Assignment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}