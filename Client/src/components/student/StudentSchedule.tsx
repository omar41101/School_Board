import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { 
  Clock, 
  Calendar as CalendarIcon,
  MapPin,
  User,
  BookOpen,
  Bell,
  Video,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { courseApi, assignmentApi, eventApi, normalizeArrayResponse } from '../../lib/api';

interface ScheduleItem {
  id: string;
  type: 'class' | 'exam' | 'meeting' | 'event' | 'break';
  title: string;
  subject?: string;
  teacher?: {
    id: string;
    name: string;
    avatar?: string;
  };
  location: string;
  startTime: string;
  endTime: string;
  date: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  description?: string;
  materials?: string[];
  isOnline?: boolean;
  meetingLink?: string;
  hasHomework?: boolean;
  hasExam?: boolean;
}

export function StudentSchedule() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState('today');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    if (user?._id) {
      fetchScheduleData();
    }
  }, [user?._id]);

  const fetchScheduleData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch courses, assignments, and events
      const [coursesResponse, assignmentsResponse, eventsResponse]: any[] = await Promise.all([
        courseApi.getAll(),
        assignmentApi.getAll(),
        eventApi.getAll()
      ]);

      const courses = normalizeArrayResponse(coursesResponse);
      const assignments = normalizeArrayResponse(assignmentsResponse);
      const events = normalizeArrayResponse(eventsResponse);

      // Build schedule from courses, assignments, and events
      const scheduleItems: ScheduleItem[] = [];

      // Add courses (classes)
      courses.forEach((course: any) => {
        if (course.schedule && Array.isArray(course.schedule)) {
          course.schedule.forEach((scheduleEntry: any) => {
            // Generate schedule items for the week
            const today = new Date();
            for (let i = 0; i < 7; i++) {
              const date = new Date(today);
              date.setDate(today.getDate() + i);
              const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

              if (scheduleEntry.day === dayName) {
                scheduleItems.push({
                  id: `${course._id}-${scheduleEntry.day}-${i}`,
                  type: 'class',
                  title: course.name,
                  subject: course.name,
                  teacher: course.teacher ? {
                    id: course.teacher._id || course.teacher,
                    name: typeof course.teacher === 'object' ? 
                      `${course.teacher.firstName || ''} ${course.teacher.lastName || ''}`.trim() : 
                      'Teacher',
                    avatar: typeof course.teacher === 'object' ? course.teacher.avatar : undefined
                  } : undefined,
                  location: scheduleEntry.room || 'TBA',
                  startTime: scheduleEntry.startTime || '08:00',
                  endTime: scheduleEntry.endTime || '09:30',
                  date: date.toISOString().split('T')[0],
                  status: 'upcoming',
                  description: course.description
                });
              }
            }
          });
        }
      });

      // Add assignments (exams)
      assignments.forEach((assignment: any) => {
        if (assignment.dueDate) {
          const dueDate = new Date(assignment.dueDate);
          const today = new Date();
          const weekFromNow = new Date(today);
          weekFromNow.setDate(today.getDate() + 7);

          if (dueDate >= today && dueDate <= weekFromNow) {
            scheduleItems.push({
              id: assignment._id,
              type: 'exam',
              title: assignment.title,
              subject: assignment.course?.name || 'Exam',
              location: 'Exam Hall',
              startTime: '09:00',
              endTime: '11:00',
              date: dueDate.toISOString().split('T')[0],
              status: 'upcoming',
              description: assignment.description,
              hasExam: true
            });
          }
        }
      });

      // Add events
      events.forEach((event: any) => {
        if (event.date) {
          const eventDate = new Date(event.date);
          const today = new Date();
          const weekFromNow = new Date(today);
          weekFromNow.setDate(today.getDate() + 7);

          if (eventDate >= today && eventDate <= weekFromNow) {
            scheduleItems.push({
              id: event._id,
              type: 'event',
              title: event.title,
              location: event.location || 'TBA',
              startTime: event.time || '10:00',
              endTime: event.time || '12:00',
              date: eventDate.toISOString().split('T')[0],
              status: 'upcoming',
              description: event.description
            });
          }
        }
      });

      // Sort by date and time
      scheduleItems.sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.startTime.localeCompare(b.startTime);
      });

      setSchedule(scheduleItems);
    } catch (err: any) {
      console.error('Failed to fetch schedule:', err);
      setError(err.message || 'Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: ScheduleItem['type']) => {
    switch (type) {
      case 'class':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'exam':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'meeting':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'event':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'break':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: ScheduleItem['status']) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ongoing':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: ScheduleItem['status']) => {
    switch (status) {
      case 'upcoming':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'ongoing':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-gray-600" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTodaySchedule = () => {
    const today = new Date().toISOString().split('T')[0];
    return schedule.filter((item: ScheduleItem) => item.date === today);
  };

  const getTomorrowSchedule = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    return schedule.filter((item: ScheduleItem) => item.date === tomorrowStr);
  };

  const getWeekSchedule = () => {
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    
    return schedule.filter((item: ScheduleItem) => {
      const itemDate = new Date(item.date);
      return itemDate >= weekStart && itemDate <= weekEnd;
    });
  };

  const getScheduleForTab = () => {
    switch (activeTab) {
      case 'today':
        return getTodaySchedule();
      case 'tomorrow':
        return getTomorrowSchedule();
      case 'week':
        return getWeekSchedule();
      default:
        return getTodaySchedule();
    }
  };

  const filteredSchedule = getScheduleForTab();

  const getScheduleStats = () => {
    const today = getTodaySchedule();
    const tomorrow = getTomorrowSchedule();
    const week = getWeekSchedule();

    return {
      todayClasses: today.filter((item: ScheduleItem) => item.type === 'class').length,
      todayExams: today.filter((item: ScheduleItem) => item.type === 'exam').length,
      tomorrowClasses: tomorrow.filter((item: ScheduleItem) => item.type === 'class').length,
      weekTotal: week.length,
      upcomingHomework: schedule.filter((item: ScheduleItem) => item.hasHomework).length
    };
  };
  const stats = getScheduleStats();

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const getDuration = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading schedule...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={fetchScheduleData}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">My Schedule</h1>
          <p className="text-gray-600 dark:text-gray-300">View your daily classes, exams, and activities</p>
        </div>
        <Button variant="outline">
          <Bell className="mr-2 h-4 w-4" />
          Set Reminders
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">{stats.todayClasses}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Today's Classes</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.todayExams}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Today's Exams</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.tomorrowClasses}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Tomorrow's Classes</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#3E92CC]">{stats.weekTotal}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">This Week</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{stats.upcomingHomework}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Homework Due</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1 border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5" />
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
            
            {/* Quick Info */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Current Time:</span>
                <span className="font-medium text-[#0D1B2A] dark:text-white">
                  {new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Next Class:</span>
                <span className="font-medium text-[#3E92CC]">
                  {schedule.find(item => item.type === 'class' && item.status === 'upcoming')?.startTime || 'None'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="today">Today ({stats.todayClasses + stats.todayExams})</TabsTrigger>
              <TabsTrigger value="tomorrow">Tomorrow ({stats.tomorrowClasses})</TabsTrigger>
              <TabsTrigger value="week">This Week ({stats.weekTotal})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="space-y-4">
                {filteredSchedule.length > 0 ? (
                  filteredSchedule
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map((item) => (
                    <Card key={item.id} className="border-0 shadow-md bg-white dark:bg-[#1B2B3A] hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge className={`text-xs px-2 py-1 ${getTypeColor(item.type)}`}>
                                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                              </Badge>
                              <Badge className={`text-xs px-2 py-1 ${getStatusColor(item.status)}`}>
                                <div className="flex items-center space-x-1">
                                  {getStatusIcon(item.status)}
                                  <span className="capitalize">{item.status}</span>
                                </div>
                              </Badge>
                              {item.isOnline && (
                                <Badge variant="outline" className="text-xs px-2 py-1 border-[#3E92CC] text-[#3E92CC]">
                                  Online
                                </Badge>
                              )}
                              {item.hasHomework && (
                                <Badge variant="outline" className="text-xs px-2 py-1 border-orange-500 text-orange-600">
                                  Homework Due
                                </Badge>
                              )}
                              {item.hasExam && (
                                <Badge variant="outline" className="text-xs px-2 py-1 border-red-500 text-red-600">
                                  Exam
                                </Badge>
                              )}
                            </div>
                            
                            <h3 className="font-semibold text-[#0D1B2A] dark:text-white mb-1">
                              {item.title}
                            </h3>
                            
                            {item.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                {item.description}
                              </p>
                            )}
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-[#3E92CC]" />
                                <span>{formatTime(item.startTime)} - {formatTime(item.endTime)}</span>
                                <span className="ml-2 text-xs">({getDuration(item.startTime, item.endTime)})</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1 text-[#3E92CC]" />
                                <span>{item.location}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right ml-4">
                            <div className="text-lg font-bold text-[#3E92CC]">
                              {formatTime(item.startTime)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {item.date === new Date().toISOString().split('T')[0] ? 'Today' : 
                               item.date === new Date(Date.now() + 86400000).toISOString().split('T')[0] ? 'Tomorrow' :
                               new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                        </div>
                        
                        {/* Teacher */}
                        {item.teacher && (
                          <div className="flex items-center space-x-3 mt-4 p-3 bg-gray-50 dark:bg-[#0D1B2A]/50 rounded-lg">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={item.teacher.avatar} />
                              <AvatarFallback className="bg-[#3E92CC] text-white text-xs">
                                {item.teacher.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-[#0D1B2A] dark:text-white">
                                {item.teacher.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {item.subject} Instructor
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {/* Materials */}
                        {item.materials && item.materials.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-[#0D1B2A] dark:text-white mb-2">
                              Required Materials:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {item.materials.map((material, index) => (
                                <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                                  {material}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Actions */}
                        <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                          {item.isOnline && item.meetingLink && (
                            <Button size="sm" className="bg-[#3E92CC] hover:bg-[#3E92CC]/80">
                              <Video className="mr-2 h-4 w-4" />
                              Join Class
                            </Button>
                          )}
                          {item.hasHomework && (
                            <Button variant="outline" size="sm">
                              <FileText className="mr-2 h-4 w-4" />
                              View Homework
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Bell className="mr-2 h-4 w-4" />
                            Set Reminder
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
                    <CardContent className="p-12 text-center">
                      <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-[#0D1B2A] dark:text-white mb-2">
                        No schedule found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        No classes or activities scheduled for this period.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}