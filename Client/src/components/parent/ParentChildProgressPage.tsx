import { useState } from 'react';
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
  Award,
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
  Star
} from 'lucide-react';

interface Child {
  id: string;
  name: string;
  avatar: string;
  class: string;
  level: string;
  studentId: string;
}

interface Subject {
  id: string;
  name: string;
  teacher: string;
  currentGrade: number;
  previousGrade: number;
  trend: 'up' | 'down' | 'stable';
  assignments: number;
  nextExam: string;
  lastAssignment: {
    title: string;
    grade: number;
    date: string;
  };
}

interface Attendance {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  tardyDays: number;
  percentage: number;
}

interface Behavior {
  id: string;
  date: string;
  type: 'positive' | 'negative' | 'neutral';
  description: string;
  teacher: string;
  subject: string;
}

export function ParentChildProgressPage() {
  const [selectedChild, setSelectedChild] = useState('1');
  const [selectedTerm, setSelectedTerm] = useState('current');

  const mockChildren: Child[] = [
    {
      id: '1',
      name: 'Emma Johnson',
      avatar: '/api/placeholder/40/40',
      class: '10-A',
      level: 'Grade 10',
      studentId: 'STU001'
    },
    {
      id: '2',
      name: 'James Johnson',
      avatar: '/api/placeholder/40/40',
      class: '8-B',
      level: 'Grade 8',
      studentId: 'STU004'
    }
  ];

  const mockSubjects: Subject[] = [
    {
      id: '1',
      name: 'Mathematics',
      teacher: 'Dr. Marie Dubois',
      currentGrade: 92,
      previousGrade: 88,
      trend: 'up',
      assignments: 12,
      nextExam: '2024-01-25',
      lastAssignment: {
        title: 'Quadratic Equations Quiz',
        grade: 95,
        date: '2024-01-20'
      }
    },
    {
      id: '2',
      name: 'Physics',
      teacher: 'Prof. Jean Martin',
      currentGrade: 85,
      previousGrade: 87,
      trend: 'down',
      assignments: 8,
      nextExam: '2024-01-28',
      lastAssignment: {
        title: 'Motion and Forces Test',
        grade: 82,
        date: '2024-01-18'
      }
    },
    {
      id: '3',
      name: 'Literature',
      teacher: 'Mme. Sophie Laurent',
      currentGrade: 88,
      previousGrade: 88,
      trend: 'stable',
      assignments: 15,
      nextExam: '2024-01-30',
      lastAssignment: {
        title: 'Poetry Analysis Essay',
        grade: 90,
        date: '2024-01-19'
      }
    },
    {
      id: '4',
      name: 'History',
      teacher: 'Mr. David Brown',
      currentGrade: 91,
      previousGrade: 85,
      trend: 'up',
      assignments: 10,
      nextExam: '2024-02-02',
      lastAssignment: {
        title: 'World War II Research',
        grade: 94,
        date: '2024-01-17'
      }
    }
  ];

  const mockAttendance: Attendance = {
    totalDays: 120,
    presentDays: 115,
    absentDays: 3,
    tardyDays: 2,
    percentage: 95.8
  };

  const mockBehavior: Behavior[] = [
    {
      id: '1',
      date: '2024-01-20',
      type: 'positive',
      description: 'Excellent participation in class discussion',
      teacher: 'Dr. Marie Dubois',
      subject: 'Mathematics'
    },
    {
      id: '2',
      date: '2024-01-18',
      type: 'positive',
      description: 'Helped classmate with assignment',
      teacher: 'Mme. Sophie Laurent',
      subject: 'Literature'
    },
    {
      id: '3',
      date: '2024-01-16',
      type: 'neutral',
      description: 'Submitted assignment one day late',
      teacher: 'Prof. Jean Martin',
      subject: 'Physics'
    }
  ];

  const currentChild = mockChildren.find(child => child.id === selectedChild) || mockChildren[0];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'stable': return <div className="w-4 h-1 bg-gray-400 rounded"></div>;
      default: return null;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getBehaviorColor = (type: string) => {
    switch (type) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      case 'neutral': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getBehaviorIcon = (type: string) => {
    switch (type) {
      case 'positive': return <CheckCircle className="h-4 w-4" />;
      case 'negative': return <AlertCircle className="h-4 w-4" />;
      case 'neutral': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">Child Progress</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor your child's academic performance and development</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedChild} onValueChange={setSelectedChild}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select child" />
            </SelectTrigger>
            <SelectContent>
              {mockChildren.map((child) => (
                <SelectItem key={child.id} value={child.id}>
                  {child.name} - {child.class}
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

      {/* Child Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={currentChild.avatar} alt={currentChild.name} />
              <AvatarFallback className="text-lg">
                {currentChild.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#0D1B2A] dark:text-white">{currentChild.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {currentChild.level} • Class {currentChild.class} • ID: {currentChild.studentId}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-[#3E92CC]">89.2%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Overall Average</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">95.8%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Attendance</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">4</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockSubjects.map((subject) => (
                <Card key={subject.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-[#3E92CC]/10 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-[#3E92CC]" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{subject.name}</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{subject.teacher}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <span className={`text-2xl font-bold ${getGradeColor(subject.currentGrade)}`}>
                            {subject.currentGrade}%
                          </span>
                          {getTrendIcon(subject.trend)}
                        </div>
                        <p className={`text-sm ${getTrendColor(subject.trend)}`}>
                          {subject.trend === 'up' && `+${subject.currentGrade - subject.previousGrade}`}
                          {subject.trend === 'down' && `${subject.currentGrade - subject.previousGrade}`}
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
                        <p className="text-xl font-bold text-[#0D1B2A] dark:text-white">{subject.assignments}</p>
                      </div>
                      
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <Calendar className="h-4 w-4 text-[#3E92CC]" />
                          <span className="text-sm font-medium">Next Exam</span>
                        </div>
                        <p className="text-sm font-bold text-[#0D1B2A] dark:text-white">{subject.nextExam}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Last Assignment</h4>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{subject.lastAssignment.title}</span>
                          <span className={`text-sm font-bold ${getGradeColor(subject.lastAssignment.grade)}`}>
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
                    {mockAttendance.percentage}%
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Overall Attendance Rate</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Present Days</span>
                    </div>
                    <span className="font-bold">{mockAttendance.presentDays}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <span>Absent Days</span>
                    </div>
                    <span className="font-bold">{mockAttendance.absentDays}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <span>Tardy Days</span>
                    </div>
                    <span className="font-bold">{mockAttendance.tardyDays}</span>
                  </div>
                  
                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-gray-600" />
                      <span>Total School Days</span>
                    </div>
                    <span className="font-bold">{mockAttendance.totalDays}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Attendance Progress</span>
                    <span>{mockAttendance.percentage}%</span>
                  </div>
                  <Progress value={mockAttendance.percentage} className="w-full" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Attendance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span>January 2024</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">96.2%</span>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span>December 2023</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">94.8%</span>
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span>November 2023</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">97.1%</span>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span>October 2023</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">95.5%</span>
                      <div className="w-4 h-1 bg-gray-400 rounded"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="behavior" className="mt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-green-600">12</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Positive Notes</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-yellow-600">3</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Neutral Notes</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-red-600">1</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Areas for Improvement</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Behavior Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockBehavior.map((behavior) => (
                    <div key={behavior.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className={`p-2 rounded-lg ${getBehaviorColor(behavior.type)}`}>
                        {getBehaviorIcon(behavior.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{behavior.description}</h4>
                          <Badge className={getBehaviorColor(behavior.type)}>
                            {behavior.type}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{behavior.teacher}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <BookOpen className="h-3 w-3" />
                            <span>{behavior.subject}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{behavior.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Academic Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Star className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Mathematics Excellence</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Consistently high performance in problem-solving</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Star className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Class Participation</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Active engagement in discussions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Star className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Assignment Quality</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Thorough and well-researched work</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Areas for Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <Target className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium">Physics Lab Work</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Could benefit from more hands-on practice</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <Target className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium">Time Management</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Occasional late submissions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}