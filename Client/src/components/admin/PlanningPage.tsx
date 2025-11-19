import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Search, 
  Filter,
  BookOpen,
  GraduationCap,
  Users,
  FileText,
  Edit,
  Trash2,
  Copy,
  AlertCircle,
  CheckCircle,
  User,
  MapPin,
  Video,
  Repeat,
  Bell
} from 'lucide-react';

interface Schedule {
  id: string;
  type: 'course' | 'exam' | 'meeting' | 'event';
  title: string;
  subject: string;
  teacher: string;
  class: string;
  room: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  description?: string;
  recurring?: {
    type: 'weekly' | 'biweekly' | 'monthly';
    until: string;
  };
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  attendees?: string[];
  isOnline?: boolean;
  meetingLink?: string;
}

interface Exam {
  id: string;
  subject: string;
  title: string;
  teacher: string;
  classes: string[];
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  room: string;
  type: 'written' | 'oral' | 'practical' | 'project';
  coefficient: number;
  instructions?: string;
  materials?: string[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  studentsCount: number;
}

export function PlanningPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState('all');

  const mockSchedules: Schedule[] = [
    {
      id: 'SCH001',
      type: 'course',
      title: 'Mathématiques Avancées',
      subject: 'Mathematics',
      teacher: 'Dr. Marie Dubois',
      class: '11-A',
      room: 'Salle 201',
      date: '2024-01-22',
      startTime: '08:00',
      endTime: '09:30',
      duration: 90,
      description: 'Chapitre 5: Fonctions dérivées',
      recurring: {
        type: 'weekly',
        until: '2024-06-15'
      },
      status: 'scheduled',
      attendees: ['STU001', 'STU002', 'STU003'],
      isOnline: false
    },
    {
      id: 'SCH002',
      type: 'course',
      title: 'Physique Quantique',
      subject: 'Physics',
      teacher: 'Prof. Jean Martin',
      class: '12-B',
      room: 'Lab 105',
      date: '2024-01-22',
      startTime: '10:00',
      endTime: '11:30',
      duration: 90,
      description: 'TP: Expérience de double fente',
      status: 'scheduled',
      isOnline: false
    },
    {
      id: 'SCH003',
      type: 'exam',
      title: 'Contrôle de Littérature',
      subject: 'Literature',
      teacher: 'Mme. Sophie Laurent',
      class: '10-C',
      room: 'Salle 301',
      date: '2024-01-23',
      startTime: '14:00',
      endTime: '16:00',
      duration: 120,
      description: 'Examen sur "Les Misérables" de Victor Hugo',
      status: 'scheduled',
      isOnline: false
    }
  ];

  const mockExams: Exam[] = [
    {
      id: 'EX001',
      subject: 'Mathematics',
      title: 'Contrôle Chapitre 5-6',
      teacher: 'Dr. Marie Dubois',
      classes: ['11-A', '11-B'],
      date: '2024-01-25',
      startTime: '09:00',
      endTime: '11:00',
      duration: 120,
      room: 'Amphithéâtre A',
      type: 'written',
      coefficient: 2,
      instructions: 'Calculatrice autorisée. Rédigez soigneusement vos réponses.',
      materials: ['Calculatrice', 'Règle', 'Compas'],
      status: 'scheduled',
      studentsCount: 58
    },
    {
      id: 'EX002',
      subject: 'Physics',
      title: 'TP Évaluation Mécanique',
      teacher: 'Prof. Jean Martin',
      classes: ['12-A'],
      date: '2024-01-26',
      startTime: '14:00',
      endTime: '16:00',
      duration: 120,
      room: 'Laboratoire 201',
      type: 'practical',
      coefficient: 1.5,
      instructions: 'Manipulation en binôme. Rapport à rendre en fin de séance.',
      materials: ['Blouse', 'Cahier de laboratoire'],
      status: 'scheduled',
      studentsCount: 28
    }
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return <BookOpen className="h-4 w-4" />;
      case 'exam': return <FileText className="h-4 w-4" />;
      case 'meeting': return <Users className="h-4 w-4" />;
      case 'event': return <CalendarIcon className="h-4 w-4" />;
      default: return <CalendarIcon className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'course': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'exam': return 'bg-red-100 text-red-800 border-red-200';
      case 'meeting': return 'bg-green-100 text-green-800 border-green-200';
      case 'event': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderWeekView = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const dates = ['22', '23', '24', '25', '26'];

    return (
      <div className="grid grid-cols-6 gap-4">
        <div className="space-y-2">
          <div className="h-16 flex items-center justify-center font-medium bg-gray-50 dark:bg-gray-800 rounded">
            Time
          </div>
          {timeSlots.slice(0, 12).map((time) => (
            <div key={time} className="h-12 flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
              {time}
            </div>
          ))}
        </div>

        {days.map((day, dayIndex) => (
          <div key={day} className="space-y-2">
            <div className="h-16 bg-gray-50 dark:bg-gray-800 rounded p-3">
              <div className="font-medium text-center">{day}</div>
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">Jan {dates[dayIndex]}</div>
            </div>
            {timeSlots.slice(0, 12).map((time) => {
              const scheduleForSlot = mockSchedules.find(s => 
                s.date === `2024-01-${dates[dayIndex]}` && s.startTime === time
              );
              
              return (
                <div key={time} className="h-12 border border-gray-200 dark:border-gray-700 rounded">
                  {scheduleForSlot && (
                    <div className={`h-full p-2 rounded text-xs ${getTypeColor(scheduleForSlot.type)}`}>
                      <div className="font-medium truncate">{scheduleForSlot.title}</div>
                      <div className="truncate">{scheduleForSlot.class}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">Planning & Scheduling</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage courses, exams and academic calendar</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Copy className="mr-2 h-4 w-4" />
            Duplicate Week
          </Button>
          <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] text-white">
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <Button 
              variant={viewMode === 'day' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('day')}
            >
              Day
            </Button>
            <Button 
              variant={viewMode === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('week')}
            >
              Week
            </Button>
            <Button 
              variant={viewMode === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('month')}
            >
              Month
            </Button>
          </div>

          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="10-A">10-A</SelectItem>
              <SelectItem value="11-A">11-A</SelectItem>
              <SelectItem value="11-B">11-B</SelectItem>
              <SelectItem value="12-A">12-A</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Teacher" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teachers</SelectItem>
              <SelectItem value="marie">Dr. Marie Dubois</SelectItem>
              <SelectItem value="jean">Prof. Jean Martin</SelectItem>
              <SelectItem value="sophie">Mme. Sophie Laurent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            ← Previous Week
          </Button>
          <Button variant="outline" size="sm">
            Today
          </Button>
          <Button variant="outline" size="sm">
            Next Week →
          </Button>
        </div>
      </div>

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="exams">Exams</TabsTrigger>
          <TabsTrigger value="create">Create Event</TabsTrigger>
          <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="mt-6">
          <Card>
            <CardContent className="p-6">
              {viewMode === 'week' && renderWeekView()}
              
              {viewMode === 'day' && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Today's Schedule - January 22, 2024</h3>
                  {mockSchedules.filter(s => s.date === '2024-01-22').map((schedule) => (
                    <div key={schedule.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="flex items-center justify-center w-10 h-10 bg-[#3E92CC]/10 rounded-lg">
                        {getTypeIcon(schedule.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">{schedule.title}</h4>
                          <Badge className={getTypeColor(schedule.type)}>
                            {schedule.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {schedule.startTime} - {schedule.endTime} • {schedule.room} • {schedule.class}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Teacher: {schedule.teacher}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {viewMode === 'month' && (
                <div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exams" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Upcoming Exams</h2>
              <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] text-white">
                <Plus className="mr-2 h-4 w-4" />
                Schedule Exam
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {mockExams.map((exam) => (
                <Card key={exam.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
                          <FileText className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-[#0D1B2A] dark:text-white">
                              {exam.title}
                            </h3>
                            <Badge variant="outline">{exam.subject}</Badge>
                            <Badge className={`${getStatusColor(exam.status)}`}>
                              {exam.status}
                            </Badge>
                            <Badge variant="secondary">
                              Coef. {exam.coefficient}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div className="flex items-center space-x-2 text-sm">
                              <CalendarIcon className="h-4 w-4 text-gray-400" />
                              <span>{exam.date}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>{exam.startTime} - {exam.endTime}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span>{exam.room}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Users className="h-4 w-4 text-gray-400" />
                              <span>{exam.studentsCount} students</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <User className="h-4 w-4" />
                            <span>Teacher: {exam.teacher}</span>
                            <span>•</span>
                            <span>Classes: {exam.classes.join(', ')}</span>
                            <span>•</span>
                            <span className="capitalize">{exam.type} exam</span>
                          </div>
                          
                          {exam.instructions && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              <strong>Instructions:</strong> {exam.instructions}
                            </p>
                          )}
                          
                          {exam.materials && exam.materials.length > 0 && (
                            <div className="flex items-center space-x-2 text-sm">
                              <strong>Materials:</strong>
                              {exam.materials.map((material, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {material}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Bell className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <div className="max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle>Create New Event</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="eventType">Event Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="course">Course</SelectItem>
                        <SelectItem value="exam">Exam</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="literature">Literature</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Event title" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teacher">Teacher</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marie">Dr. Marie Dubois</SelectItem>
                        <SelectItem value="jean">Prof. Jean Martin</SelectItem>
                        <SelectItem value="sophie">Mme. Sophie Laurent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10-A">10-A</SelectItem>
                        <SelectItem value="11-A">11-A</SelectItem>
                        <SelectItem value="11-B">11-B</SelectItem>
                        <SelectItem value="12-A">12-A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="room">Room</Label>
                    <Input id="room" placeholder="Room number or name" />
                  </div>

                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left">
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

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input id="duration" type="number" placeholder="90" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input id="startTime" type="time" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input id="endTime" type="time" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recurring">Recurring</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Not recurring" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Not recurring</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Event description..." rows={3} />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="isOnline" />
                    <Label htmlFor="isOnline">Online Event</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="sendNotification" />
                    <Label htmlFor="sendNotification">Send Notifications</Label>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end space-x-4">
                  <Button variant="outline">
                    Save as Draft
                  </Button>
                  <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] text-white">
                    Create Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conflicts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-orange-500" />
                Schedule Conflicts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <div className="flex-1">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-400">
                      Room Conflict - Salle 201
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-500">
                      January 22, 2024 at 10:00 - Mathematics (11-A) and Physics (11-B) scheduled in same room
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Resolve
                  </Button>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div className="flex-1">
                    <h4 className="font-medium text-red-800 dark:text-red-400">
                      Teacher Double Booking
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-500">
                      Dr. Marie Dubois scheduled for two classes at January 23, 2024 at 14:00
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Resolve
                  </Button>
                </div>

                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                  <p>No more conflicts found</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}