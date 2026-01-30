import { useState, useMemo } from 'react';
import { useGetTeacherMeQuery, useGetEventsQuery } from '../../services/api';
import { Card, CardContent } from '../ui/card';
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
  Bell,
  FileText,
  Video,
  Loader2,
} from 'lucide-react';
import type { Event } from '../../types';

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

function eventToScheduleItem(e: Event): ScheduleItem {
  const start = new Date(e.startDate);
  const end = new Date(e.endDate);
  const dateStr = e.startDate.slice(0, 10);
  const startTime = start.toTimeString().slice(0, 5);
  const endTime = end.toTimeString().slice(0, 5);
  const typeMap: Record<string, ScheduleItem['type']> = {
    academic: 'class',
    exam: 'exam',
    meeting: 'meeting',
    sports: 'class',
    cultural: 'class',
    holiday: 'class',
    other: 'meeting',
  };
  const statusMap: Record<string, ScheduleItem['status']> = {
    scheduled: 'scheduled',
    ongoing: 'in_progress',
    completed: 'completed',
    cancelled: 'cancelled',
  };
  return {
    id: String(e.id),
    title: e.title,
    subject: e.type || 'General',
    class: e.levels?.[0] || 'All',
    type: typeMap[e.type] || 'meeting',
    date: dateStr,
    startTime,
    endTime,
    room: e.location || 'TBD',
    studentsCount: 0,
    isOnline: false,
    description: e.description,
    status: statusMap[e.status] || 'scheduled',
  };
}

export function TeacherSchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');

  const { data: teacherMeData } = useGetTeacherMeQuery();
  const teacherUserId = teacherMeData?.data?.teacher?.userId;

  const { data: eventsData, isLoading } = useGetEventsQuery(
    { organizerId: teacherUserId },
    { skip: !teacherUserId }
  );

  const scheduleItems: ScheduleItem[] = useMemo(() => {
    const events = eventsData?.data?.events ?? [];
    return events.map(eventToScheduleItem);
  }, [eventsData]);

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00',
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

  const selectedDateStr = selectedDate.toISOString().slice(0, 10);
  const weekStart = new Date(selectedDate);
  weekStart.setDate(selectedDate.getDate() - selectedDate.getDay() + 1);
  const weekDays = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const renderWeekView = () => (
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
      {weekDays.map((day) => {
        const dayStr = day.toISOString().slice(0, 10);
        return (
          <div key={dayStr} className="space-y-2">
            <div className="h-16 bg-gray-50 dark:bg-gray-800 rounded p-3">
              <div className="font-medium text-center">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">{day.getDate()} {day.toLocaleDateString('en-US', { month: 'short' })}</div>
            </div>
            {timeSlots.slice(0, 12).map((time) => {
              const scheduleForSlot = scheduleItems.find(
                (s) => s.date === dayStr && s.startTime === time
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
        );
      })}
    </div>
  );

  const renderDayView = () => {
    const todaySchedule = scheduleItems.filter((s) => s.date === selectedDateStr);
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Schedule - {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </h3>
        {todaySchedule.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No events scheduled for this day</p>
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
                        <h3 className="font-semibold text-[#0D1B2A] dark:text-white">{item.title}</h3>
                        <Badge className={getTypeColor(item.type)}>{item.type.replace('_', ' ')}</Badge>
                        <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
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
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{item.description}</p>
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

  const upcomingItems = scheduleItems
    .filter((s) => s.date >= selectedDateStr && s.status !== 'cancelled')
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))
    .slice(0, 5);

  const completedItems = scheduleItems.filter((s) => s.status === 'completed');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-[#3E92CC]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">My Schedule</h1>
          <p className="text-gray-600 dark:text-gray-400">View and manage your teaching schedule</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <Button variant={viewMode === 'day' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('day')}>
            Day
          </Button>
          <Button variant={viewMode === 'week' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('week')}>
            Week
          </Button>
          <Button variant={viewMode === 'month' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('month')}>
            Month
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() - 7);
              setSelectedDate(d);
            }}
          >
            ← Previous Week
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() + 7);
              setSelectedDate(d);
            }}
          >
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
                  <Calendar mode="single" selected={selectedDate} onSelect={(d) => d && setSelectedDate(d)} className="rounded-md border" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Upcoming Events</h3>
            {upcomingItems.length === 0 ? (
              <p className="text-gray-500 py-4">No upcoming events</p>
            ) : (
              upcomingItems.map((item) => (
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
                        <Badge className={getTypeColor(item.type)}>{item.type.replace('_', ' ')}</Badge>
                        <Button size="sm" variant="outline">
                          <Bell className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recent Classes</h3>
            {completedItems.length === 0 ? (
              <p className="text-gray-500 py-4">No completed classes to show</p>
            ) : (
              completedItems.map((item) => (
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
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
