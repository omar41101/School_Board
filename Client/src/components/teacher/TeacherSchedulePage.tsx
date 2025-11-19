import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar } from '../ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin,
  Users,
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Bell,
  Video,
  FileText
} from 'lucide-react';

interface ScheduleItem {
  id: string;
  title: string;
  subject: string;
  class: string;
  type: 'class' | 'exam' | 'meeting' | 'office_hours';
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  studentsCount: number;
  isOnline: boolean;
  meetingLink?: string;
  description?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

export function TeacherSchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');

  const mockSchedule: ScheduleItem[] = [
    {
      id: '1',
      title: 'Mathematics - Quadratic Equations',
      subject: 'Mathematics',
      class: '10-A',
      type: 'class',
      date: '2024-01-22',
      startTime: '08:00',
      endTime: '09:30',
      room: 'Room 201',
      studentsCount: 28,
      isOnline: false,
      description: 'Introduction to quadratic equations and solving methods',
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'Advanced Mathematics',
      subject: 'Mathematics',
      class: '11-B',
      type: 'class',
      date: '2024-01-22',
      startTime: '10:00',
      endTime: '11:30',
      room: 'Room 203',
      studentsCount: 24,
      isOnline: false,
      description: 'Derivatives and applications',
      status: 'scheduled'
    },
    {
      id: '3',
      title: 'Office Hours',
      subject: 'Mathematics',
      class: 'All',
      type: 'office_hours',
      date: '2024-01-22',
      startTime: '14:00',
      endTime: '15:00',
      room: 'Office 105',
      studentsCount: 0,
      isOnline: false,
      description: 'Student consultation hours',
      status: 'scheduled'
    },
    {
      id: '4',
      title: 'Calculus Exam',
      subject: 'Mathematics',
      class: '12-A',
      type: 'exam',
      date: '2024-01-23',
      startTime: '09:00',
      endTime: '11:00',
      room: 'Exam Hall A',
      studentsCount: 22,
      isOnline: false,
      description: 'Final exam on integration and differentiation',
      status: 'scheduled'
    },
    {
      id: '5',
      title: 'Parent-Teacher Meeting',
      subject: 'General',
      class: '10-A',
      type: 'meeting',
      date: '2024-01-24',
      startTime: '16:00',
      endTime: '18:00',
      room: 'Conference Room',
      studentsCount: 0,
      isOnline: true,
      meetingLink: 'https://meet.school.com/parent-teacher',
      description: 'Monthly parent consultation meeting',
      status: 'scheduled'
    }
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'class': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'exam': return 'bg-red-100 text-red-800 border-red-200';
      case 'meeting': return 'bg-green-100 text-green-800 border-green-200';
      case 'office_hours': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'class': return <BookOpen className="h-4 w-4" />;
      case 'exam': return <FileText className="h-4 w-4" />;
      case 'meeting': return <Users className="h-4 w-4" />;
      case 'office_hours': return <Clock className="h-4 w-4" />;
      default: return <CalendarIcon className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
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
            <div key={time} className="h-16 flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
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
              const scheduleForSlot = mockSchedule.find(s => 
                s.date === `2024-01-${dates[dayIndex]}` && s.startTime === time
              );
              
              return (
                <div key={time} className="h-16 border border-gray-200 dark:border-gray-700 rounded">
                  {scheduleForSlot && (
                    <div className={`h-full p-2 rounded text-xs ${getTypeColor(scheduleForSlot.type)}`}>
                      <div className="font-medium truncate">{scheduleForSlot.title}</div>
                      <div className="truncate">{scheduleForSlot.class}</div>
                      <div className="truncate">{scheduleForSlot.room}</div>
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

  const renderDayView = () => {
    const todaySchedule = mockSchedule.filter(s => s.date === '2024-01-22');

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Today's Schedule - January 22, 2024</h3>
        {todaySchedule.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No classes scheduled for today</p>
          </div>
        ) : (
          todaySchedule.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-[#3E92CC]/10 rounded-lg">
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-[#0D1B2A] dark:text-white">
                          {item.title}
                        </h3>
                        <Badge className={getTypeColor(item.type)}>
                          {item.type.replace('_', ' ')}
                        </Badge>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{item.startTime} - {item.endTime}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{item.room}</span>
                        </div>
                        {item.studentsCount > 0 && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span>{item.studentsCount} students</span>
                          </div>
                        )}
                        {item.isOnline && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Video className="h-4 w-4 text-gray-400" />
                            <span>Online</span>
                          </div>
                        )}
                      </div>
                      
                      {item.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {item.description}
                        </p>
                      )}
                      
                      {item.meetingLink && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-3">
                          <p className="text-sm">
                            <span className="font-medium">Meeting Link:</span>
                            <a href={item.meetingLink} className="text-blue-600 hover:text-blue-800 ml-2">
                              {item.meetingLink}
                            </a>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Bell className="h-4 w-4" />
                    </Button>
                    {item.status === 'scheduled' && (
                      <Button size="sm" className="bg-[#3E92CC] hover:bg-[#2E82BC] text-white">
                        Start Class
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">My Schedule</h1>
          <p className="text-gray-600 dark:text-gray-400">View and manage your teaching schedule</p>
        </div>
        <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      <div className="flex items-center justify-between">
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="schedule">Schedule View</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Classes</TabsTrigger>
          <TabsTrigger value="history">Class History</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="mt-6">
          <Card>
            <CardContent className="p-6">
              {viewMode === 'day' && renderDayView()}
              {viewMode === 'week' && renderWeekView()}
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

        <TabsContent value="upcoming" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Next 7 Days</h3>
            {mockSchedule.slice(0, 5).map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-[#3E92CC]/10 rounded-lg">
                        {getTypeIcon(item.type)}
                      </div>
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.date} at {item.startTime} - {item.endTime} • {item.room}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getTypeColor(item.type)}>
                        {item.type.replace('_', ' ')}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Bell className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recent Classes</h3>
            {mockSchedule.filter(s => s.status === 'completed').map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                        {getTypeIcon(item.type)}
                      </div>
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.date} at {item.startTime} - {item.endTime} • {item.room}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">
                        Completed
                      </Badge>
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="text-center py-8 text-gray-500">
              <p>No more completed classes to show</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}