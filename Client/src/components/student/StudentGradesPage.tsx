import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
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
  Star,
  CheckCircle
} from 'lucide-react';

interface Grade {
  id: string;
  subject: string;
  teacher: string;
  assignmentType: 'homework' | 'quiz' | 'exam' | 'project';
  title: string;
  grade: number;
  maxPoints: number;
  date: string;
  feedback?: string;
  status: 'graded' | 'pending' | 'submitted';
}

interface SubjectGrade {
  subject: string;
  teacher: string;
  currentGrade: number;
  targetGrade: number;
  trend: 'up' | 'down' | 'stable';
  assignments: number;
  nextAssignment: string;
  color: string;
}

export function StudentGradesPage() {
  const [selectedTerm, setSelectedTerm] = useState('current');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const mockGrades: Grade[] = [
    {
      id: '1',
      subject: 'Mathematics',
      teacher: 'Dr. Marie Dubois',
      assignmentType: 'exam',
      title: 'Quadratic Equations Test',
      grade: 92,
      maxPoints: 100,
      date: '2024-01-20',
      feedback: 'Excellent work! Great understanding of complex problems.',
      status: 'graded'
    },
    {
      id: '2',
      subject: 'Physics',
      teacher: 'Prof. Jean Martin',
      assignmentType: 'homework',
      title: 'Motion and Forces Problem Set',
      grade: 85,
      maxPoints: 100,
      date: '2024-01-18',
      feedback: 'Good work, but review vector calculations.',
      status: 'graded'
    },
    {
      id: '3',
      subject: 'Literature',
      teacher: 'Mme. Sophie Laurent',
      assignmentType: 'project',
      title: 'Poetry Analysis Essay',
      grade: 0,
      maxPoints: 150,
      date: '2024-01-22',
      status: 'submitted'
    },
    {
      id: '4',
      subject: 'History',
      teacher: 'Mr. David Brown',
      assignmentType: 'quiz',
      title: 'World War II Quiz',
      grade: 88,
      maxPoints: 100,
      date: '2024-01-15',
      feedback: 'Well done! Good understanding of historical context.',
      status: 'graded'
    }
  ];

  const mockSubjectGrades: SubjectGrade[] = [
    {
      subject: 'Mathematics',
      teacher: 'Dr. Marie Dubois',
      currentGrade: 89.2,
      targetGrade: 90,
      trend: 'up',
      assignments: 12,
      nextAssignment: 'Calculus Test - Jan 25',
      color: 'bg-blue-500'
    },
    {
      subject: 'Physics',
      teacher: 'Prof. Jean Martin',
      currentGrade: 84.7,
      targetGrade: 85,
      trend: 'stable',
      assignments: 10,
      nextAssignment: 'Lab Report - Jan 28',
      color: 'bg-green-500'
    },
    {
      subject: 'Literature',
      teacher: 'Mme. Sophie Laurent',
      currentGrade: 91.5,
      targetGrade: 92,
      trend: 'up',
      assignments: 8,
      nextAssignment: 'Book Review - Feb 1',
      color: 'bg-purple-500'
    },
    {
      subject: 'History',
      teacher: 'Mr. David Brown',
      currentGrade: 86.3,
      targetGrade: 88,
      trend: 'down',
      assignments: 9,
      nextAssignment: 'Essay - Feb 5',
      color: 'bg-orange-500'
    }
  ];

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'graded': return 'bg-green-100 text-green-800';
      case 'submitted': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exam': return 'bg-red-100 text-red-800';
      case 'project': return 'bg-purple-100 text-purple-800';
      case 'quiz': return 'bg-blue-100 text-blue-800';
      case 'homework': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <div className="w-4 h-1 bg-gray-400 rounded"></div>;
    }
  };

  const overallAverage = mockSubjectGrades.reduce((acc, subject) => acc + subject.currentGrade, 0) / mockSubjectGrades.length;

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

      {/* Overall Performance */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Award className="h-12 w-12 text-[#3E92CC] mx-auto mb-3" />
            <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">{overallAverage.toFixed(1)}%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Overall Average</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">3/4</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Goals Achieved</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <BookOpen className="h-12 w-12 text-[#3E92CC] mx-auto mb-3" />
            <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">4</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Subjects</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">A-</p>
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
            {mockSubjectGrades.map((subject) => (
              <Card key={subject.subject} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${subject.color} rounded-lg flex items-center justify-center`}>
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
                    <span className={`text-2xl font-bold ${getGradeColor(subject.currentGrade)}`}>
                      {subject.currentGrade}%
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress to Goal ({subject.targetGrade}%)</span>
                      <span>{Math.min(100, (subject.currentGrade / subject.targetGrade) * 100).toFixed(0)}%</span>
                    </div>
                    <Progress 
                      value={Math.min(100, (subject.currentGrade / subject.targetGrade) * 100)} 
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
            ))}
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
                  {mockSubjectGrades.map((subject) => (
                    <SelectItem key={subject.subject} value={subject.subject.toLowerCase()}>
                      {subject.subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {mockGrades.map((grade) => (
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
                              {grade.title}
                            </h3>
                            <Badge className={getTypeColor(grade.assignmentType)}>
                              {grade.assignmentType}
                            </Badge>
                            <Badge className={getStatusColor(grade.status)}>
                              {grade.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                            <span>{grade.subject}</span>
                            <span>•</span>
                            <span>{grade.teacher}</span>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{grade.date}</span>
                            </div>
                          </div>
                          
                          {grade.feedback && (
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-3">
                              <p className="text-sm">
                                <span className="font-medium">Feedback:</span> {grade.feedback}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {grade.status === 'graded' ? (
                          <>
                            <div className={`text-3xl font-bold ${getGradeColor((grade.grade / grade.maxPoints) * 100)}`}>
                              {grade.grade}/{grade.maxPoints}
                            </div>
                            <div className={`text-sm ${getGradeColor((grade.grade / grade.maxPoints) * 100)}`}>
                              {Math.round((grade.grade / grade.maxPoints) * 100)}%
                            </div>
                          </>
                        ) : grade.status === 'submitted' ? (
                          <div className="flex items-center space-x-2">
                            <Clock className="h-5 w-5 text-yellow-600" />
                            <span className="text-sm text-yellow-600">Pending</span>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">Not submitted</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                  {mockSubjectGrades.map((subject) => (
                    <div key={subject.subject} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 ${subject.color} rounded-full`}></div>
                        <span className="font-medium">{subject.subject}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={getGradeColor(subject.currentGrade)}>
                          {subject.currentGrade}%
                        </span>
                        {getTrendIcon(subject.trend)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Goals & Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Mathematics Excellence</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Achieved 90%+ average</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Literature Star</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Top performance in writing</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <Target className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium">Physics Improvement</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Goal: Reach 85% average</p>
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