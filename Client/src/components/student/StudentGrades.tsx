import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  BookOpen,
  Trophy,
  Target,
  Calendar,
  Download,
  Eye,
  BarChart3
} from 'lucide-react';

interface Grade {
  id: string;
  subject: string;
  assignment: string;
  type: 'exam' | 'quiz' | 'homework' | 'project' | 'participation';
  score: number;
  maxScore: number;
  date: string;
  teacher: string;
  feedback?: string;
  weight: number;
}

interface SubjectGrade {
  subject: string;
  teacher: string;
  currentGrade: number;
  targetGrade: number;
  grades: Grade[];
  trend: 'up' | 'down' | 'stable';
  position: number;
  totalStudents: number;
}

export function StudentGrades() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const mockSubjects: SubjectGrade[] = [
    {
      subject: 'Mathematics',
      teacher: 'Dr. Sarah Johnson',
      currentGrade: 87.5,
      targetGrade: 90,
      trend: 'up',
      position: 3,
      totalStudents: 28,
      grades: [
        {
          id: '1',
          subject: 'Mathematics',
          assignment: 'Algebra Quiz',
          type: 'quiz',
          score: 18,
          maxScore: 20,
          date: '2024-10-01',
          teacher: 'Dr. Sarah Johnson',
          feedback: 'Excellent work on quadratic equations!',
          weight: 0.15
        },
        {
          id: '2',
          subject: 'Mathematics',
          assignment: 'Calculus Midterm',
          type: 'exam',
          score: 42,
          maxScore: 50,
          date: '2024-09-25',
          teacher: 'Dr. Sarah Johnson',
          feedback: 'Good understanding of derivatives, work on integration.',
          weight: 0.3
        }
      ]
    },
    {
      subject: 'Computer Science',
      teacher: 'Prof. Michael Chen',
      currentGrade: 92.3,
      targetGrade: 95,
      trend: 'up',
      position: 1,
      totalStudents: 25,
      grades: [
        {
          id: '3',
          subject: 'Computer Science',
          assignment: 'Python Project',
          type: 'project',
          score: 48,
          maxScore: 50,
          date: '2024-10-03',
          teacher: 'Prof. Michael Chen',
          feedback: 'Outstanding implementation of data structures!',
          weight: 0.25
        }
      ]
    },
    {
      subject: 'English Literature',
      teacher: 'Ms. Emily Rodriguez',
      currentGrade: 78.2,
      targetGrade: 85,
      trend: 'down',
      position: 12,
      totalStudents: 30,
      grades: [
        {
          id: '4',
          subject: 'English Literature',
          assignment: 'Essay on Shakespeare',
          type: 'homework',
          score: 15,
          maxScore: 20,
          date: '2024-09-28',
          teacher: 'Ms. Emily Rodriguez',
          feedback: 'Good analysis but needs more supporting evidence.',
          weight: 0.2
        }
      ]
    }
  ];

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeLetter = (percentage: number) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: Grade['type']) => {
    switch (type) {
      case 'exam':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'quiz':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'homework':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'project':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'participation':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const overallGPA = mockSubjects.reduce((sum, subject) => sum + subject.currentGrade, 0) / mockSubjects.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">My Grades</h1>
          <p className="text-gray-600 dark:text-gray-300">Track your academic performance and progress</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Overall GPA</p>
                <p className={`text-2xl font-bold ${getGradeColor(overallGPA)}`}>
                  {overallGPA.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Grade: {getGradeLetter(overallGPA)}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-[#3E92CC]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Subjects</p>
                <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">
                  {mockSubjects.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  This semester
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-[#3E92CC]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Best Subject</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.max(...mockSubjects.map(s => s.currentGrade)).toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Computer Science
                </p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Target Progress</p>
                <p className="text-2xl font-bold text-[#3E92CC]">
                  {Math.round((mockSubjects.filter(s => s.currentGrade >= s.targetGrade).length / mockSubjects.length) * 100)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Goals achieved
                </p>
              </div>
              <Target className="h-8 w-8 text-[#3E92CC]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subjects">By Subject</TabsTrigger>
          <TabsTrigger value="recent">Recent Grades</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockSubjects.map((subject) => (
              <Card key={subject.subject} className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{subject.subject}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{subject.teacher}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className={`text-2xl font-bold ${getGradeColor(subject.currentGrade)}`}>
                          {subject.currentGrade.toFixed(1)}%
                        </span>
                        {getTrendIcon(subject.trend)}
                      </div>
                      <p className="text-xs text-gray-500">
                        Rank: {subject.position}/{subject.totalStudents}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-300">Progress to Target</span>
                      <span className="font-medium">
                        {subject.currentGrade.toFixed(1)}% / {subject.targetGrade}%
                      </span>
                    </div>
                    <Progress 
                      value={(subject.currentGrade / subject.targetGrade) * 100} 
                      className="h-2"
                    />
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p>Recent: {subject.grades.length} assignments</p>
                    <p>Last updated: {subject.grades[0]?.date}</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="subjects" className="mt-6">
          <div className="space-y-6">
            {mockSubjects.map((subject) => (
              <Card key={subject.subject} className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{subject.subject}</CardTitle>
                    <Badge className={`${getGradeColor(subject.currentGrade)} bg-transparent border-current`}>
                      {getGradeLetter(subject.currentGrade)} ({subject.currentGrade.toFixed(1)}%)
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subject.grades.map((grade) => (
                      <div key={grade.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0D1B2A]/50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-[#0D1B2A] dark:text-white">
                              {grade.assignment}
                            </h4>
                            <Badge className={`text-xs px-2 py-1 ${getTypeColor(grade.type)}`}>
                              {grade.type}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                            <span>Score: {grade.score}/{grade.maxScore}</span>
                            <span>Weight: {(grade.weight * 100).toFixed(0)}%</span>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {grade.date}
                            </div>
                          </div>
                          {grade.feedback && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 italic">
                              "{grade.feedback}"
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`text-xl font-bold ${getGradeColor((grade.score / grade.maxScore) * 100)}`}>
                            {((grade.score / grade.maxScore) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
            <CardHeader>
              <CardTitle>Recent Assignments & Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSubjects.flatMap(subject => subject.grades)
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((grade) => (
                    <div key={grade.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h4 className="font-medium text-[#0D1B2A] dark:text-white">
                            {grade.assignment}
                          </h4>
                          <Badge className={`text-xs px-2 py-1 ${getTypeColor(grade.type)}`}>
                            {grade.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {grade.subject} • {grade.teacher}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {grade.date}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getGradeColor((grade.score / grade.maxScore) * 100)}`}>
                          {grade.score}/{grade.maxScore}
                        </div>
                        <div className={`text-sm ${getGradeColor((grade.score / grade.maxScore) * 100)}`}>
                          {((grade.score / grade.maxScore) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}