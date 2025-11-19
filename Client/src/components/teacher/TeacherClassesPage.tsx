import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Clock,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
  Plus,
  Eye,
  Edit,
  MessageSquare,
  Award,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface ClassData {
  id: string;
  name: string;
  subject: string;
  level: string;
  students: number;
  avgGrade: number;
  attendance: number;
  nextClass: string;
  room: string;
  schedule: {
    day: string;
    time: string;
  }[];
}

interface Student {
  id: string;
  name: string;
  avatar: string;
  currentGrade: number;
  attendance: number;
  lastAssignment: string;
  status: 'excellent' | 'good' | 'needs_attention' | 'critical';
  parentContact: {
    name: string;
    email: string;
    phone: string;
  };
}

export function TeacherClassesPage() {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const mockClasses: ClassData[] = [
    {
      id: '1',
      name: '10-A Mathematics',
      subject: 'Mathematics',
      level: 'Grade 10',
      students: 28,
      avgGrade: 85.5,
      attendance: 92,
      nextClass: 'Today at 10:00',
      room: 'Room 201',
      schedule: [
        { day: 'Monday', time: '10:00-11:30' },
        { day: 'Wednesday', time: '14:00-15:30' },
        { day: 'Friday', time: '09:00-10:30' }
      ]
    },
    {
      id: '2',
      name: '11-B Advanced Math',
      subject: 'Mathematics',
      level: 'Grade 11',
      students: 24,
      avgGrade: 78.2,
      attendance: 88,
      nextClass: 'Tomorrow at 14:00',
      room: 'Room 203',
      schedule: [
        { day: 'Tuesday', time: '14:00-15:30' },
        { day: 'Thursday', time: '10:00-11:30' }
      ]
    },
    {
      id: '3',
      name: '12-A Calculus',
      subject: 'Mathematics',
      level: 'Grade 12',
      students: 22,
      avgGrade: 82.7,
      attendance: 95,
      nextClass: 'Today at 15:30',
      room: 'Room 205',
      schedule: [
        { day: 'Monday', time: '15:30-17:00' },
        { day: 'Wednesday', time: '08:00-09:30' },
        { day: 'Friday', time: '13:00-14:30' }
      ]
    }
  ];

  const mockStudents: Student[] = [
    {
      id: '1',
      name: 'Emma Johnson',
      avatar: '/api/placeholder/40/40',
      currentGrade: 92,
      attendance: 98,
      lastAssignment: 'Calculus Problem Set - A+',
      status: 'excellent',
      parentContact: {
        name: 'Robert Johnson',
        email: 'robert.johnson@email.com',
        phone: '+1 (555) 123-4567'
      }
    },
    {
      id: '2',
      name: 'Lucas Martin',
      avatar: '/api/placeholder/40/40',
      currentGrade: 76,
      attendance: 85,
      lastAssignment: 'Algebra Quiz - B-',
      status: 'needs_attention',
      parentContact: {
        name: 'Maria Martin',
        email: 'maria.martin@email.com',
        phone: '+1 (555) 987-6543'
      }
    },
    {
      id: '3',
      name: 'Sophie Davis',
      avatar: '/api/placeholder/40/40',
      currentGrade: 88,
      attendance: 92,
      lastAssignment: 'Geometry Test - A-',
      status: 'good',
      parentContact: {
        name: 'David Davis',
        email: 'david.davis@email.com',
        phone: '+1 (555) 456-7890'
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'needs_attention': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-4 w-4" />;
      case 'good': return <TrendingUp className="h-4 w-4" />;
      case 'needs_attention': return <AlertCircle className="h-4 w-4" />;
      case 'critical': return <TrendingDown className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">My Classes</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your classes and monitor student progress</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockClasses.map((classData) => (
              <Card key={classData.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-[#3E92CC]/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-[#3E92CC]" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{classData.name}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{classData.level}</p>
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
                      <p className="text-xl font-bold text-[#0D1B2A] dark:text-white">{classData.students}</p>
                    </div>
                    
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Award className="h-4 w-4 text-[#3E92CC]" />
                        <span className="text-sm font-medium">Avg Grade</span>
                      </div>
                      <p className="text-xl font-bold text-[#0D1B2A] dark:text-white">{classData.avgGrade}%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Attendance Rate</span>
                      <span className="font-medium">{classData.attendance}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-[#3E92CC] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${classData.attendance}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>Next class: {classData.nextClass}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Room: {classData.room}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1 bg-[#3E92CC] hover:bg-[#2E82BC] text-white">
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
                  {mockClasses.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockStudents.map((student) => (
                <Card key={student.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#0D1B2A] dark:text-white">{student.name}</h3>
                        <Badge className={`${getStatusColor(student.status)} text-xs`}>
                          {getStatusIcon(student.status)}
                          <span className="ml-1 capitalize">{student.status.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Current Grade</p>
                        <p className="text-lg font-bold text-[#0D1B2A] dark:text-white">{student.currentGrade}%</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Attendance</p>
                        <p className="text-lg font-bold text-[#0D1B2A] dark:text-white">{student.attendance}%</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm">
                        <span className="font-medium">Last Assignment:</span> {student.lastAssignment}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Parent:</span> {student.parentContact.name}
                      </p>
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
              ))}
            </div>
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
                  {mockClasses.map((classData) => (
                    <div key={classData.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <h4 className="font-medium">{classData.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{classData.students} students</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#3E92CC]">{classData.avgGrade}%</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Average Grade</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Student Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Excellent Performance</span>
                    </div>
                    <span className="font-medium">32%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span>Good Performance</span>
                    </div>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span>Needs Attention</span>
                    </div>
                    <span className="font-medium">18%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <span>Critical</span>
                    </div>
                    <span className="font-medium">5%</span>
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