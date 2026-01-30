import { useState } from 'react';
import { useGetEventsQuery } from '../../services/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Calendar } from '../ui/calendar';
import { EventCard, Event } from '../events/EventCard';
import {
  Plus,
  Filter,
  Search,
  Calendar as CalendarIcon,
  Users,
  Bell,
  Download,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import type { Event as ApiEvent } from '../../types';

function toEventCardFormat(e: ApiEvent): Event {
  const start = new Date(e.startDate);
  const end = new Date(e.endDate);
  return {
    id: String(e.id),
    title: e.title,
    description: e.description || '',
    type: e.type as Event['type'],
    startDate: e.startDate.split('T')[0],
    endDate: e.endDate.split('T')[0],
    startTime: start.toTimeString().slice(0, 5),
    endTime: end.toTimeString().slice(0, 5),
    location: e.location || 'TBA',
    organizer: e.organizer
      ? {
          id: String(e.organizer.id),
          name: `${e.organizer.firstName} ${e.organizer.lastName}`,
          role: (e.organizer.role as Event['organizer']['role']) || 'teacher',
        }
      : { id: '0', name: 'Unknown', role: 'teacher' },
    attendees: {
      total: (e.participants?.length || 0) as number,
      registered: (e.participants?.length || 0) as number,
      limit: e.maxParticipants,
    },
    status:
      e.status === 'scheduled'
        ? 'upcoming'
        : (e.status as Event['status']),
    priority: 'medium',
    isPublic: e.isPublic ?? true,
    requiresRegistration: false,
    tags: [],
  };
}

export function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');

  const { data: eventsData, isLoading, error } = useGetEventsQuery({});

  const apiEvents = (eventsData?.data?.events || []) as ApiEvent[];
  const events = apiEvents.map(toEventCardFormat);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTab =
      activeTab === 'all' ||
      event.type === activeTab ||
      event.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    total: events.length,
    upcoming: events.filter((e) => e.status === 'upcoming').length,
    ongoing: events.filter((e) => e.status === 'ongoing').length,
    completed: events.filter((e) => e.status === 'completed').length,
    totalAttendees: events.reduce((sum, e) => sum + e.attendees.registered, 0),
    publicEvents: events.filter((e) => e.isPublic).length,
  };

  const handleViewEvent = (event: Event) => {
    console.log('View event:', event.title);
  };

  const handleEditEvent = (event: Event) => {
    console.log('Edit event:', event.title);
  };

  const handleDeleteEvent = (event: Event) => {
    console.log('Delete event:', event.title);
  };

  const handleRegisterEvent = (event: Event) => {
    console.log('Register for event:', event.title);
  };

  const handleShareEvent = (event: Event) => {
    console.log('Share event:', event.title);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading events...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-gray-600 mb-4">Failed to load events</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">
            Events & Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage school events and track participation
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'calendar' : 'grid')}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {viewMode === 'grid' ? 'Calendar View' : 'Grid View'}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] dark:bg-[#3E92CC] dark:hover:bg-[#3E92CC]/80">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Events</p>
                <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">
                  {stats.total}
                </p>
              </div>
              <CalendarIcon className="h-8 w-8 text-[#3E92CC]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Upcoming</p>
                <p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p>
              </div>
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Ongoing</p>
                <p className="text-2xl font-bold text-green-600">{stats.ongoing}</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Completed</p>
                <p className="text-2xl font-bold text-gray-600">{stats.completed}</p>
              </div>
              <div className="w-3 h-3 bg-gray-500 rounded-full" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Attendees</p>
                <p className="text-2xl font-bold text-[#3E92CC]">{stats.totalAttendees}</p>
              </div>
              <Users className="h-8 w-8 text-[#3E92CC]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Public Events</p>
                <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">
                  {stats.publicEvents}
                </p>
              </div>
              <Bell className="h-8 w-8 text-[#3E92CC]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {viewMode === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1 border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3 border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
            <CardHeader>
              <CardTitle>
                Events for{' '}
                {selectedDate?.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEvents
                  .filter((event) => {
                    if (!selectedDate) return false;
                    const eventDate = new Date(event.startDate);
                    return eventDate.toDateString() === selectedDate.toDateString();
                  })
                  .map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-[#0D1B2A]/50 rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-[#3E92CC] rounded-lg flex items-center justify-center text-white font-bold">
                          {event.startTime.slice(0, 2)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-[#0D1B2A] dark:text-white truncate">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {event.startTime} - {event.endTime} • {event.location}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewEvent(event)}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                {filteredEvents.filter((event) => {
                  if (!selectedDate) return false;
                  const eventDate = new Date(event.startDate);
                  return eventDate.toDateString() === selectedDate.toDateString();
                }).length === 0 && (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No events scheduled for this date
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search events by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
            </Button>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6 max-w-3xl">
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming ({stats.upcoming})</TabsTrigger>
              <TabsTrigger value="academic">Academic</TabsTrigger>
              <TabsTrigger value="sports">Sports</TabsTrigger>
              <TabsTrigger value="cultural">Cultural</TabsTrigger>
              <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onView={handleViewEvent}
                      onEdit={handleEditEvent}
                      onDelete={handleDeleteEvent}
                      onRegister={handleRegisterEvent}
                      onShare={handleShareEvent}
                    />
                  ))}
                </div>
              ) : (
                <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
                  <CardContent className="p-12 text-center">
                    <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-[#0D1B2A] dark:text-white mb-2">
                      No events found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {searchTerm
                        ? 'Try adjusting your search criteria.'
                        : 'Get started by creating your first event.'}
                    </p>
                    {!searchTerm && (
                      <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] dark:bg-[#3E92CC] dark:hover:bg-[#3E92CC]/80">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Event
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
