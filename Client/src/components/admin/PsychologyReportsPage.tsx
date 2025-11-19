import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Separator } from '../ui/separator';
import { 
  Brain, 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Calendar as CalendarIcon,
  Download,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Mail,
  Phone,
  BookOpen,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface PsychologyReport {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  psychologist: string;
  reportType: 'assessment' | 'intervention' | 'progress' | 'emergency';
  status: 'draft' | 'completed' | 'reviewed' | 'approved';
  createdDate: string;
  lastModified: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  summary: string;
  recommendations: string[];
}

interface Student {
  id: string;
  name: string;
  class: string;
  age: number;
  email: string;
  phone: string;
  avatar: string;
  reports: number;
  lastVisit: string;
}

export function PsychologyReportsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [newReport, setNewReport] = useState({
    type: '',
    priority: '',
    summary: '',
    recommendations: '',
    followUpDate: ''
  });

  const mockReports: PsychologyReport[] = [
    {
      id: '1',
      studentId: 'STU001',
      studentName: 'Emma Johnson',
      studentClass: '10-A',
      psychologist: 'Dr. Sarah Wilson',
      reportType: 'assessment',
      status: 'completed',
      createdDate: '2024-01-15',
      lastModified: '2024-01-16',
      priority: 'medium',
      summary: 'Initial psychological assessment showing mild anxiety symptoms during exam periods.',
      recommendations: ['Regular counseling sessions', 'Stress management techniques', 'Parent consultation']
    },
    {
      id: '2',
      studentId: 'STU002',
      studentName: 'Lucas Martin',
      studentClass: '11-B',
      psychologist: 'Dr. Michael Brown',
      reportType: 'intervention',
      status: 'approved',
      createdDate: '2024-01-10',
      lastModified: '2024-01-18',
      priority: 'high',
      summary: 'Behavioral intervention plan for attention and focus difficulties.',
      recommendations: ['ADHD evaluation', 'Classroom accommodations', 'Medication consultation']
    },
    {
      id: '3',
      studentId: 'STU003',
      studentName: 'Sophie Davis',
      studentClass: '9-C',
      psychologist: 'Dr. Sarah Wilson',
      reportType: 'progress',
      status: 'reviewed',
      createdDate: '2024-01-12',
      lastModified: '2024-01-19',
      priority: 'low',
      summary: 'Positive progress in social interaction and peer relationships.',
      recommendations: ['Continue current interventions', 'Monthly check-ins', 'Group therapy participation']
    }
  ];

  const mockStudents: Student[] = [
    {
      id: 'STU001',
      name: 'Emma Johnson',
      class: '10-A',
      age: 16,
      email: 'emma.j@email.com',
      phone: '+1 (555) 123-4567',
      avatar: '/api/placeholder/40/40',
      reports: 3,
      lastVisit: '2024-01-16'
    },
    {
      id: 'STU002',
      name: 'Lucas Martin',
      class: '11-B',
      age: 17,
      email: 'lucas.m@email.com',
      phone: '+1 (555) 987-6543',
      avatar: '/api/placeholder/40/40',
      reports: 2,
      lastVisit: '2024-01-18'
    },
    {
      id: 'STU003',
      name: 'Sophie Davis',
      class: '9-C',
      age: 15,
      email: 'sophie.d@email.com',
      phone: '+1 (555) 456-7890',
      avatar: '/api/placeholder/40/40',
      reports: 1,
      lastVisit: '2024-01-19'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'assessment': return <Brain className="h-4 w-4" />;
      case 'intervention': return <AlertTriangle className="h-4 w-4" />;
      case 'progress': return <TrendingUp className="h-4 w-4" />;
      case 'emergency': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">Psychology Reports</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage psychological assessments and interventions</p>
        </div>
        <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] text-white">
          <Plus className="mr-2 h-4 w-4" />
          New Report
        </Button>
      </div>

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reports">All Reports</TabsTrigger>
          <TabsTrigger value="students">Student Profiles</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="create">Create Report</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 max-w-md">
                <Input 
                  placeholder="Search reports, students, or psychologists..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {mockReports.map((report) => (
                <Card key={report.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-[#3E92CC]/10 rounded-lg">
                          {getTypeIcon(report.reportType)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-[#0D1B2A] dark:text-white">
                              {report.studentName}
                            </h3>
                            <Badge variant="outline" className={getPriorityColor(report.priority)}>
                              {report.priority}
                            </Badge>
                            <Badge variant="secondary" className={getStatusColor(report.status)}>
                              {report.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Class: {report.studentClass} • Psychologist: {report.psychologist}
                          </p>
                          <p className="text-sm mb-3">{report.summary}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Created: {report.createdDate}</span>
                            <span>Modified: {report.lastModified}</span>
                            <span className="capitalize">{report.reportType} Report</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="students" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 max-w-md">
                <Input placeholder="Search students..." />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter by Class
              </Button>
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
                        <p className="text-sm text-gray-600 dark:text-gray-400">Class {student.class} • Age {student.age}</p>
                      </div>
                      {student.reports > 0 && (
                        <Badge variant="secondary">{student.reports} reports</Badge>
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{student.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{student.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>Last visit: {student.lastVisit}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1 bg-[#3E92CC] hover:bg-[#2E82BC] text-white">
                        <FileText className="mr-2 h-4 w-4" />
                        View Reports
                      </Button>
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
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
                    <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">142</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Reports</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <User className="h-8 w-8 text-[#3E92CC]" />
                  <div>
                    <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">89</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Cases</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">12</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">High Priority</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">78%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Types Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-[#3E92CC] rounded-full"></div>
                      <span>Assessment</span>
                    </div>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-[#0D1B2A] rounded-full"></div>
                      <span>Intervention</span>
                    </div>
                    <span className="font-medium">30%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Progress</span>
                    </div>
                    <span className="font-medium">20%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Emergency</span>
                    </div>
                    <span className="font-medium">5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Report Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>January 2024</span>
                    <span className="font-medium">23 reports</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>December 2023</span>
                    <span className="font-medium">31 reports</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>November 2023</span>
                    <span className="font-medium">28 reports</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>October 2023</span>
                    <span className="font-medium">35 reports</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <div className="max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Create New Psychology Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="studentSelect">Student</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a student" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockStudents.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name} - {student.class}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reportType">Report Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="assessment">Initial Assessment</SelectItem>
                        <SelectItem value="intervention">Intervention Plan</SelectItem>
                        <SelectItem value="progress">Progress Review</SelectItem>
                        <SelectItem value="emergency">Emergency Evaluation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Follow-up Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? selectedDate.toDateString() : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Report Summary</Label>
                  <Textarea 
                    id="summary"
                    placeholder="Provide a comprehensive summary of the assessment or intervention..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observations">Detailed Observations</Label>
                  <Textarea 
                    id="observations"
                    placeholder="Document detailed observations, behaviors, and findings..."
                    rows={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recommendations">Recommendations</Label>
                  <Textarea 
                    id="recommendations"
                    placeholder="List specific recommendations and action items..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goals">Treatment Goals</Label>
                  <Textarea 
                    id="goals"
                    placeholder="Define specific, measurable treatment goals..."
                    rows={3}
                  />
                </div>

                <Separator />

                <div className="flex justify-end space-x-4">
                  <Button variant="outline">
                    Save as Draft
                  </Button>
                  <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] text-white">
                    Submit Report
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