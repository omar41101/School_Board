import { useState, useMemo } from 'react';
import { useAppSelector } from '../../store/hooks';
import { useGetStudentMeQuery, useGetCoursesQuery } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
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
  AlertCircle,
} from 'lucide-react';
import type { Course } from '../../types';

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
  const { user } = useAppSelector((state) => state.auth);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('week');

  const { data: studentMeData } = useGetStudentMeQuery(undefined, {
    skip: (user as { role?: string })?.role !== 'student',
  });
  const studentId = studentMeData?.data?.student?.id;

  const { data: coursesData, isLoading, error } = useGetCoursesQuery(
    { student: studentId! },
    { skip: !studentId },
  );

  const courses = (coursesData?.data?.courses || []) as Course[];

  const schedule = useMemo<ScheduleItem[]>(() => {
    const items: ScheduleItem[] = [];
    courses.forEach((course) => {
      const scheduleData = (course.schedule || []) as { day?: string; startTime?: string; room?: string }[];
      scheduleData.forEach((entry, idx) => {
        items.push({
          id: `${course.id}-${entry.day || idx}`,
          subject: course.name,
          teacher:
            course.teacher?.user?.firstName && course.teacher?.user?.lastName
              ? `${course.teacher.user.firstName} ${course.teacher.user.lastName}`
              : 'TBA',
          time: entry.startTime || '08:00',
          duration: '1h 30min',
          room: entry.room || 'TBA',
          type: 'class',
          day: entry.day || 'Monday',
        });
      });
    });
    return items;
  }, [courses]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'class':
        return 'bg-blue-100 text-blue-800';
      case 'exam':
        return 'bg-red-100 text-red-800';
      case 'lab':
        return 'bg-green-100 text-green-800';
      case 'break':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'class':
        return <BookOpen className="h-4 w-4" />;
      case 'exam':
        return <CalendarIcon className="h-4 w-4" />;
      case 'lab':
        return <User className="h-4 w-4" />;
      case 'break':
        return <Clock className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['08:00', '10:00', '12:00', '14:00', '15:45'];

  const renderWeekView = () => (
    <div className="grid grid-cols-6 gap-4">
      <div className="space-y-4">
        <div className="h-16 flex items-center justify-center font-medium bg-gray-50 dark:bg-gray-800 rounded">
          Time
        </div>
        {timeSlots.map((time) => (
          <div
            key={time}
            className="h-20 flex items-center justify-center text-sm text-gray-600 dark:text-gray-400"
          >
            {time}
          </div>
        ))}
      </div>
      {days.map((day) => (
        <div key={day} className="space-y-4">
          <div className="h-16 bg-gray-50 dark:bg-gray-800 rounded p-3">
            <div className="font-medium text-center">{day}</div>
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          </div>
          {timeSlots.map((time) => {
            const classForSlot = schedule.find(
              (item) => item.day === day && item.time === time,
            );
            return (
              <div
                key={time}
                className="h-20 border border-gray-200 dark:border-gray-700 rounded"
              >
                {classForSlot && (
                  <div
                    className={`h-full p-2 rounded text-xs ${getTypeColor(classForSlot.type)}`}
                  >
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

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const selectedDayName = dayNames[selectedDate.getDay()];
  const todaySchedule = schedule.filter((item) => item.day === selectedDayName);

  const renderDayView = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        Schedule - {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
      </h3>
      {todaySchedule.length > 0 ? (
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
                        {item.subject}
                      </h3>
                      <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>
                          {item.time} ({item.duration})
                        </span>
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
        ))
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No classes scheduled for this day</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  if (isLoading) {
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
        <p className="text-gray-600 mb-4">Failed to load schedule</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">My Schedule</h1>
          <p className="text-gray-600 dark:text-gray-400">
            View your class schedule and upcoming events
          </p>
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
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setSelectedDate(
                new Date(selectedDate.getTime() - 7 * 24 * 60 * 60 * 1000),
              )
            }
          >
            ← Previous Week
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDate(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setSelectedDate(
                new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000),
              )
            }
          >
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
            <h3 className="text-lg font-semibold">This Week&apos;s Classes</h3>
            {schedule.length > 0 ? (
              schedule.slice(0, 5).map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{item.subject}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.day}, {item.time} • {item.room}
                        </p>
                      </div>
                      <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No upcoming classes</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
