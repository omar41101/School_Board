import { useState } from 'react';
import { toast } from 'sonner';
import { useGetEventsQuery, useCreateEventMutation } from '../../services/api';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calendar } from '../ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { FormModal } from '../shared/FormModal';
import { Calendar as CalendarIcon, Plus, Loader2, MapPin } from 'lucide-react';
import type { Event as ApiEvent } from '../../types';

const EVENT_TYPES = ['academic', 'sports', 'cultural', 'holiday', 'exam', 'meeting', 'other'] as const;

export function PlanningPage() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  const [calendarMonth, setCalendarMonth] = useState<Date>(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    type: 'meeting' as ApiEvent['type'],
    startDate: '',
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    description: '',
    targetAudience: 'all' as const,
  });

  const { data: eventsData, isLoading: eventsLoading } = useGetEventsQuery({});
  const [createEvent, { isLoading: creatingEvent }] = useCreateEventMutation();

  const apiEvents = (eventsData?.data?.events ?? []) as ApiEvent[];
  const eventsOnSelectedDay = apiEvents.filter((e) => {
    const d = e.startDate.split('T')[0];
    return d === selectedDate.toISOString().slice(0, 10);
  });

  const handleCreateEvent = async () => {
    if (!eventForm.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    const dateStr = eventForm.startDate || selectedDate.toISOString().slice(0, 10);
    const startDate = new Date(`${dateStr}T${eventForm.startTime}`);
    const endDate = new Date(`${dateStr}T${eventForm.endTime}`);
    try {
      await createEvent({
        title: eventForm.title.trim(),
        type: eventForm.type,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        location: eventForm.location || undefined,
        description: eventForm.description || undefined,
        targetAudience: eventForm.targetAudience,
      }).unwrap();
      toast.success('Event created for students and teachers');
      setAddEventOpen(false);
      setEventForm((p) => ({ ...p, title: '', description: '', location: '' }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create event');
    }
  };

  const openAddEvent = () => {
    setEventForm((p) => ({
      ...p,
      startDate: selectedDate.toISOString().slice(0, 10),
    }));
    setAddEventOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">Planning & Events</h1>
          <p className="text-gray-600 dark:text-gray-400">One calendar for students and teachers. Select a day and add an event.</p>
        </div>
        <Button type="button" className="bg-[#0D1B2A] hover:bg-[#1B2B3A] text-white" onClick={openAddEvent}>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <Card className="flex-1">
          <CardContent className="p-4 lg:p-6">
            {eventsLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#3E92CC]" />
              </div>
            )}
            {!eventsLoading && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    {calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const d = new Date(calendarMonth);
                        d.setMonth(d.getMonth() - 1);
                        setCalendarMonth(d);
                      }}
                    >
                      ← Prev
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const now = new Date();
                        setSelectedDate(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
                        setCalendarMonth(new Date(now.getFullYear(), now.getMonth(), 1));
                      }}
                    >
                      Today
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const d = new Date(calendarMonth);
                        d.setMonth(d.getMonth() + 1);
                        setCalendarMonth(d);
                      }}
                    >
                      Next →
                    </Button>
                  </div>
                </div>
                <Calendar
                  mode="single"
                  month={calendarMonth}
                  onMonthChange={setCalendarMonth}
                  selected={selectedDate}
                  onSelect={(d) => d && setSelectedDate(d)}
                  className="rounded-md border w-full"
                />
              </>
            )}
          </CardContent>
        </Card>

        <Card className="w-full lg:w-80 shrink-0">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">
              {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </h3>
            <Button type="button" variant="outline" size="sm" className="w-full mb-4" onClick={openAddEvent}>
              <Plus className="mr-2 h-4 w-4" />
              Add event this day
            </Button>
            {eventsOnSelectedDay.length === 0 ? (
              <p className="text-sm text-muted-foreground">No events this day</p>
            ) : (
              <ul className="space-y-2">
                {eventsOnSelectedDay.map((e) => {
                  const start = new Date(e.startDate);
                  const end = new Date(e.endDate);
                  return (
                    <li key={e.id} className="text-sm border-l-2 border-[#3E92CC] pl-2 py-1">
                      <span className="font-medium">{e.title}</span>
                      <span className="text-muted-foreground block">
                        {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
                        {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {e.type}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <FormModal
        open={addEventOpen}
        onOpenChange={setAddEventOpen}
        title="Add Event (students & teachers)"
        size="lg"
        footer={
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setAddEventOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-[#0D1B2A] hover:bg-[#1B2B3A]"
              onClick={handleCreateEvent}
              disabled={creatingEvent || !eventForm.title.trim()}
            >
              {creatingEvent ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Create Event
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label>Title</Label>
            <Input
              value={eventForm.title}
              onChange={(e) => setEventForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Event title"
            />
          </div>
          <div>
            <Label>Type</Label>
            <Select
              value={eventForm.type}
              onValueChange={(v) => setEventForm((p) => ({ ...p, type: v as ApiEvent['type'] }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Target audience</Label>
            <Select
              value={eventForm.targetAudience}
              onValueChange={(v) => setEventForm((p) => ({ ...p, targetAudience: v as 'all' }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All (students & teachers)</SelectItem>
                <SelectItem value="students">Students</SelectItem>
                <SelectItem value="teachers">Teachers</SelectItem>
                <SelectItem value="parents">Parents</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={eventForm.startDate || selectedDate.toISOString().slice(0, 10)}
              onChange={(e) => setEventForm((p) => ({ ...p, startDate: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Start time</Label>
              <Input
                type="time"
                value={eventForm.startTime}
                onChange={(e) => setEventForm((p) => ({ ...p, startTime: e.target.value }))}
              />
            </div>
            <div>
              <Label>End time</Label>
              <Input
                type="time"
                value={eventForm.endTime}
                onChange={(e) => setEventForm((p) => ({ ...p, endTime: e.target.value }))}
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <Label>Location (optional)</Label>
            <Input
              value={eventForm.location}
              onChange={(e) => setEventForm((p) => ({ ...p, location: e.target.value }))}
              placeholder="Room or location"
            />
          </div>
          <div className="md:col-span-2">
            <Label>Description (optional)</Label>
            <Textarea
              value={eventForm.description}
              onChange={(e) => setEventForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Event description"
              rows={3}
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
