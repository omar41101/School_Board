import { useState } from 'react';
import { toast } from 'sonner';
import {
  useGetParentMeQuery,
  useGetTeachersQuery,
  useGetMessagesQuery,
  useGetEventsQuery,
  useCreateMessageMutation,
} from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import {
  MessageSquare,
  Send,
  Search,
  Phone,
  Video,
  Calendar,
  Clock,
  User,
  BookOpen,
  Mail,
  Bell,
  Plus,
  Filter,
  Paperclip,
  Star,
  Reply,
  Forward,
  Loader2,
} from 'lucide-react';
import type { Teacher, Message, Event } from '../../types';

export function ParentCommunicationPage() {
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedChild, setSelectedChild] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState({
    to: '',
    subject: '',
    content: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const { data: parentMeData } = useGetParentMeQuery();
  const parentUserId = parentMeData?.data?.parent?.userId;
  const children = parentMeData?.data?.parent?.children ?? [];

  const { data: teachersData, isLoading: teachersLoading } = useGetTeachersQuery({
    page: 1,
    limit: 10,
  });
  const teachers: Teacher[] = teachersData?.data?.teachers ?? [];

  const { data: messagesData, isLoading: messagesLoading } = useGetMessagesQuery(
    { inbox: true, limit: 10 },
    { skip: !parentUserId }
  );
  const messages: Message[] = messagesData?.data?.messages ?? [];

  const { data: eventsData, isLoading: eventsLoading } = useGetEventsQuery({ type: 'meeting' });
  const events: Event[] = eventsData?.data?.events ?? [];

  const [createMessage, { isLoading: isSending }] = useCreateMessageMutation();

  const filteredMessages = messages.filter((msg) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      msg.subject.toLowerCase().includes(s) ||
      msg.content.toLowerCase().includes(s) ||
      (msg.sender && `${(msg.sender as { firstName?: string }).firstName} ${(msg.sender as { lastName?: string }).lastName}`.toLowerCase().includes(s))
    );
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'requested':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const handleSendMessage = async () => {
    const recipientUserId = newMessage.to ? Number(newMessage.to) : teachers.find((t) => String(t.userId) === newMessage.to)?.userId;
    if (!recipientUserId || !newMessage.subject || !newMessage.content) {
      toast.error('Please fill in recipient, subject, and message');
      return;
    }
    try {
      await createMessage({
        recipientId: recipientUserId,
        subject: newMessage.subject,
        content: newMessage.content,
      }).unwrap();
      toast.success('Message sent successfully');
      setNewMessage({ to: '', subject: '', content: '', priority: 'medium' });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  if (teachersLoading || messagesLoading) {
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Communication</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Messages, teachers, and meetings
          </p>
        </div>
      </div>

      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="compose">Compose</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-4">
              {filteredMessages.length === 0 ? (
                <p className="text-gray-500 py-8 text-center">No messages</p>
              ) : (
                filteredMessages.map((msg) => {
                  const fromName = msg.sender
                    ? `${(msg.sender as { firstName?: string }).firstName} ${(msg.sender as { lastName?: string }).lastName}`
                    : 'Unknown';
                  return (
                    <Card
                      key={msg.id}
                      className={`hover:shadow-lg transition-shadow duration-200 ${!msg.isRead ? 'border-[#3E92CC] bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>{fromName.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-[#0D1B2A] dark:text-white">{fromName}</h3>
                                <Badge className={getPriorityColor(msg.priority)}>{msg.priority}</Badge>
                                {!msg.isRead && <Badge className="bg-[#3E92CC] text-white">New</Badge>}
                              </div>
                              <h4 className="font-medium mb-2">{msg.subject}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{msg.content}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{msg.createdAt?.slice(0, 16)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button size="sm" variant="outline">
                              <Reply className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Forward className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="teachers" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.length === 0 ? (
              <p className="text-gray-500 py-8 col-span-full text-center">No teachers found</p>
            ) : (
              teachers.map((teacher) => {
                const name = teacher.user
                  ? `${(teacher.user as { firstName?: string }).firstName} ${(teacher.user as { lastName?: string }).lastName}`
                  : 'Teacher';
                const email = (teacher.user as { email?: string })?.email ?? '';
                const phone = (teacher.user as { phone?: string })?.phone ?? '-';
                return (
                  <Card key={teacher.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={(teacher.user as { avatar?: string })?.avatar} alt={name} />
                          <AvatarFallback className="text-lg">{name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#0D1B2A] dark:text-white">{name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{teacher.specialization || teacher.subjects?.[0] || 'Teacher'}</p>
                        </div>
                      </div>
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{phone}</span>
                        </div>
                      </div>
                      <Button size="sm" className="w-full bg-[#3E92CC] hover:bg-[#2E82BC] text-white">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Message
                      </Button>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="meetings" className="mt-6">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Meeting Schedule</h2>
            <div className="space-y-4">
              {events.length === 0 ? (
                <p className="text-gray-500 py-8 text-center">No meetings scheduled</p>
              ) : (
                events.map((event) => {
                  const organizerName = event.organizer
                    ? `${(event.organizer as { firstName?: string }).firstName} ${(event.organizer as { lastName?: string }).lastName}`
                    : 'TBD';
                  const startDate = new Date(event.startDate);
                  const endDate = new Date(event.endDate);
                  const status = event.status || 'scheduled';
                  return (
                    <Card key={event.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="flex items-center justify-center w-12 h-12 bg-[#3E92CC]/10 rounded-lg">
                              <Calendar className="h-6 w-6 text-[#3E92CC]" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-[#0D1B2A] dark:text-white">{event.title}</h3>
                                <Badge className={getStatusColor(status)}>{status}</Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                                <div className="flex items-center space-x-2 text-sm">
                                  <User className="h-4 w-4 text-gray-400" />
                                  <span>{organizerName}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                  <Calendar className="h-4 w-4 text-gray-400" />
                                  <span>{startDate.toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                  <Clock className="h-4 w-4 text-gray-400" />
                                  <span>{startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                {event.location && (
                                  <div className="flex items-center space-x-2 text-sm">
                                    <BookOpen className="h-4 w-4 text-gray-400" />
                                    <span>{event.location}</span>
                                  </div>
                                )}
                              </div>
                              {event.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{event.description}</p>
                              )}
                            </div>
                          </div>
                          {status === 'scheduled' && (
                            <Button size="sm" className="bg-[#3E92CC] hover:bg-[#2E82BC] text-white">
                              Join Meeting
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="compose" className="mt-6">
          <div className="max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle>Compose New Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {children.length > 0 && (
                    <div className="space-y-2">
                      <Label htmlFor="child">Child</Label>
                      <Select value={selectedChild} onValueChange={setSelectedChild}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select child" />
                        </SelectTrigger>
                        <SelectContent>
                          {children.map((child) => (
                            <SelectItem key={child.id} value={String(child.id)}>
                              {child.user ? `${(child.user as { firstName?: string }).firstName} ${(child.user as { lastName?: string }).lastName}` : `Student ${child.id}`} - {child.className}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="teacher">To (Teacher)</Label>
                    <Select value={newMessage.to} onValueChange={(v) => setNewMessage({ ...newMessage, to: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map((t) => (
                          <SelectItem key={t.id} value={String(t.userId)}>
                            {t.user ? `${(t.user as { firstName?: string }).firstName} ${(t.user as { lastName?: string }).lastName}` : `Teacher ${t.id}`} - {t.specialization || t.subjects?.[0] || ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newMessage.priority} onValueChange={(v) => setNewMessage({ ...newMessage, priority: v as 'low' | 'medium' | 'high' })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Message subject"
                      value={newMessage.subject}
                      onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Message</Label>
                  <Textarea
                    id="content"
                    placeholder="Type your message here..."
                    rows={8}
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                  />
                </div>
                <Separator />
                <div className="flex justify-end space-x-4">
                  <Button
                    className="bg-[#0D1B2A] hover:bg-[#1B2B3A] text-white"
                    onClick={handleSendMessage}
                    disabled={isSending || !newMessage.to || !newMessage.subject || !newMessage.content}
                  >
                    {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    {isSending ? 'Sending...' : 'Send Message'}
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
