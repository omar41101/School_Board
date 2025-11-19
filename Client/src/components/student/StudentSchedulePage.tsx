import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar } from '../ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin,
  BookOpen,
  User,
  Bell,
  Download,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { courseApi, normalizeArrayResponse } from '../../lib/api';

interface ScheduleItem {
  id: string;
  subject: string;
  teacher: string;
  time: string;
  duration: string;
  room: string;
  type: 'class' | 'exam' | 'lab' | 'break';
  day: string;
}

export function StudentSchedulePage() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    if (user?._id) {
      fetchSchedule();
    }
  }, [user?._id]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      setError(null);

      const coursesResponse: any = await courseApi.getAll();
      const courses = normalizeArrayResponse(coursesResponse);

      const scheduleItems: ScheduleItem[] = [];

      courses.forEach((course: any) => {
        if (course.schedule && Array.isArray(course.schedule)) {
          course.schedule.forEach((entry: any) => {
            scheduleItems.push({
              id: `${course._id}-${entry.day}`,
              subject: course.name,
              teacher: course.teacher && typeof course.teacher === 'object' 
                ? `${course.teacher.firstName || ''} ${course.teacher.lastName || ''}`.trim()
                : 'TBA',
              time: entry.startTime || '08:00',
              duration: '1h 30min',
              room: entry.room || 'TBA',
              type: 'class',
              day: entry.day
            });
          });
        }
      });

      setSchedule(scheduleItems);
    } catch (err: any) {
      console.error('Failed to fetch schedule:', err);
      setError(err.message || 'Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'class': return 'bg-blue-100 text-blue-800';
      case 'exam': return 'bg-red-100 text-red-800';
      case 'lab': return 'bg-green-100 text-green-800';
      case 'break': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'class': return <BookOpen className="h-4 w-4" />;
      case 'exam': return <CalendarIcon className="h-4 w-4" />;
      case 'lab': return <User className="h-4 w-4" />;
      case 'break': return <Clock className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const renderWeekView = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['08:00', '10:00', '12:00', '14:00', '15:45'];

    return (
      <div className="grid grid-cols-6 gap-4">
        <div className="space-y-4">
          <div className="h-16 flex items-center justify-center font-medium bg-gray-50 dark:bg-gray-800 rounded">
            Time
          </div>
          {timeSlots.map((time) => (
            <div key={time} className="h-20 flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
              {time}
            </div>
          ))}
        </div>

        {days.map((day) => (
          <div key={day} className="space-y-4">
            <div className="h-16 bg-gray-50 dark:bg-gray-800 rounded p-3">
              <div className="font-medium text-center">{day}</div>
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">Jan 22</div>
            </div>
            {timeSlots.map((time) => {
              const classForSlot = schedule.find((item: ScheduleItem) => 
                item.day === day && item.time === time
              );
              
              return (
                <div key={time} className="h-20 border border-gray-200 dark:border-gray-700 rounded">
                  {classForSlot && (
                    <div className={`h-full p-2 rounded text-xs ${getTypeColor(classForSlot.type)}`}>
                      <div className="font-medium truncate">{classForSlot.subject}</div>
                      <div className="truncate">{classForSlot.room}</div>
                      <div className="truncate">{classForSlot.duration}</div>
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
    const todaySchedule = schedule.filter((item: ScheduleItem) => item.day === 'Monday');

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Today's Schedule - Monday, January 22, 2024</h3>
        {todaySchedule.map((item: ScheduleItem) => (
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
                        {item.subject}
                      </h3>
                      <Badge className={getTypeColor(item.type)}>
                        {item.type}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{item.time} ({item.duration})</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{item.room}</span>
                      </div>
                      {item.teacher && (
                        <div className="flex items-center space-x-2 text-sm">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>{item.teacher}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Bell className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
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
        <Button onClick={fetchSchedule}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">My Schedule</h1>
          <p className="text-gray-600 dark:text-gray-400">View your class schedule and upcoming events</p>
        </div>
        <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] text-white">
          <Download className="mr-2 h-4 w-4" />
          Export Schedule
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
          <TabsTrigger value="schedule">Weekly View</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="mt-6">
          <Card>
            <CardContent className="p-6">
              {viewMode === 'week' && renderWeekView()}
              {viewMode === 'day' && renderDayView()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="today" className="mt-6">
          {renderDayView()}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">This Week's Highlights</h3>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-red-800">Mathematics Exam</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Wednesday, 10:00 AM • Exam Hall A</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800">Exam</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Physics Lab Session</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Thursday, 2:00 PM • Lab 105</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Lab</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Literature Presentation</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Friday, 11:00 AM • Room 301</p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">Presentation</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}