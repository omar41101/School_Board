import { useState } from 'react';
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
  Forward
} from 'lucide-react';

interface Teacher {
  id: string;
  name: string;
  subject: string;
  avatar: string;
  email: string;
  phone: string;
  officeHours: string;
  nextAvailable: string;
}

interface Message {
  id: string;
  from: string;
  fromRole: 'teacher' | 'parent' | 'admin';
  to: string;
  subject: string;
  content: string;
  timestamp: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  attachments?: string[];
  replies?: Message[];
}

interface Meeting {
  id: string;
  title: string;
  teacher: string;
  subject: string;
  date: string;
  time: string;
  duration: number;
  type: 'in_person' | 'video' | 'phone';
  status: 'scheduled' | 'completed' | 'cancelled' | 'requested';
  notes?: string;
}

export function ParentCommunicationPage() {
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedChild, setSelectedChild] = useState('emma');
  const [newMessage, setNewMessage] = useState({
    to: '',
    subject: '',
    content: '',
    priority: 'medium'
  });

  const mockTeachers: Teacher[] = [
    {
      id: '1',
      name: 'Dr. Marie Dubois',
      subject: 'Mathematics',
      avatar: '/api/placeholder/40/40',
      email: 'marie.dubois@school.com',
      phone: '+1 (555) 123-4567',
      officeHours: 'Mon-Wed 2:00-4:00 PM',
      nextAvailable: 'Tomorrow at 2:30 PM'
    },
    {
      id: '2',
      name: 'Prof. Jean Martin',
      subject: 'Physics',
      avatar: '/api/placeholder/40/40',
      email: 'jean.martin@school.com',
      phone: '+1 (555) 987-6543',
      officeHours: 'Tue-Thu 1:00-3:00 PM',
      nextAvailable: 'Today at 3:00 PM'
    },
    {
      id: '3',
      name: 'Mme. Sophie Laurent',
      subject: 'Literature',
      avatar: '/api/placeholder/40/40',
      email: 'sophie.laurent@school.com',
      phone: '+1 (555) 456-7890',
      officeHours: 'Mon-Fri 3:30-4:30 PM',
      nextAvailable: 'Friday at 4:00 PM'
    }
  ];

  const mockMessages: Message[] = [
    {
      id: '1',
      from: 'Dr. Marie Dubois',
      fromRole: 'teacher',
      to: 'Parent',
      subject: 'Emma\'s Excellent Progress in Mathematics',
      content: 'I wanted to reach out to share some wonderful news about Emma\'s progress in mathematics. She has shown remarkable improvement in understanding quadratic equations and has been actively participating in class discussions. Her recent test score of 95% demonstrates her dedication to learning. Keep up the great work!',
      timestamp: '2024-01-20 14:30',
      read: false,
      priority: 'medium',
      attachments: [],
      replies: []
    },
    {
      id: '2',
      from: 'Prof. Jean Martin',
      fromRole: 'teacher',
      to: 'Parent',
      subject: 'Physics Lab Assignment - Requires Attention',
      content: 'Emma has been doing well in physics theory, but I\'ve noticed she seems to struggle a bit with the hands-on lab work. I would recommend some additional practice with laboratory procedures. Would you be available for a brief meeting to discuss how we can support her better?',
      timestamp: '2024-01-19 16:45',
      read: true,
      priority: 'high',
      attachments: ['lab_report_feedback.pdf'],
      replies: []
    },
    {
      id: '3',
      from: 'School Administration',
      fromRole: 'admin',
      to: 'Parent',
      subject: 'Parent-Teacher Conference Reminder',
      content: 'This is a friendly reminder that the monthly parent-teacher conferences are scheduled for next week. Please confirm your attendance and let us know if you need to reschedule any appointments.',
      timestamp: '2024-01-18 09:15',
      read: true,
      priority: 'medium',
      attachments: ['conference_schedule.pdf'],
      replies: []
    }
  ];

  const mockMeetings: Meeting[] = [
    {
      id: '1',
      title: 'Mathematics Progress Discussion',
      teacher: 'Dr. Marie Dubois',
      subject: 'Mathematics',
      date: '2024-01-25',
      time: '15:00',
      duration: 30,
      type: 'in_person',
      status: 'scheduled',
      notes: 'Discuss Emma\'s advanced placement options'
    },
    {
      id: '2',
      title: 'Physics Lab Support Meeting',
      teacher: 'Prof. Jean Martin',
      subject: 'Physics',
      date: '2024-01-23',
      time: '16:30',
      duration: 20,
      type: 'video',
      status: 'requested',
      notes: 'Address lab work concerns and create support plan'
    },
    {
      id: '3',
      title: 'Literature Essay Review',
      teacher: 'Mme. Sophie Laurent',
      subject: 'Literature',
      date: '2024-01-20',
      time: '14:00',
      duration: 25,
      type: 'in_person',
      status: 'completed',
      notes: 'Reviewed Emma\'s poetry analysis - excellent work'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'requested': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'in_person': return <User className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">Teacher Communication</h1>
          <p className="text-gray-600 dark:text-gray-400">Stay connected with your child's teachers</p>
        </div>
        <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] text-white">
          <Plus className="mr-2 h-4 w-4" />
          New Message
        </Button>
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
              <div className="flex-1 max-w-md">
                <Input placeholder="Search messages..." />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>

            <div className="space-y-4">
              {mockMessages.map((message) => (
                <Card key={message.id} className={`hover:shadow-lg transition-shadow duration-200 ${!message.read ? 'border-[#3E92CC] bg-blue-50/50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{message.from.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className={`font-semibold ${!message.read ? 'text-[#0D1B2A] dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                              {message.from}
                            </h3>
                            <Badge className={getPriorityColor(message.priority)}>
                              {message.priority}
                            </Badge>
                            {!message.read && (
                              <Badge className="bg-[#3E92CC] text-white">
                                New
                              </Badge>
                            )}
                          </div>
                          
                          <h4 className={`font-medium mb-2 ${!message.read ? 'text-[#0D1B2A] dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                            {message.subject}
                          </h4>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {message.content}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{message.timestamp}</span>
                            </div>
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="flex items-center space-x-1">
                                <Paperclip className="h-3 w-3" />
                                <span>{message.attachments.length} attachment(s)</span>
                              </div>
                            )}
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
                        <Button size="sm" variant="outline">
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="teachers" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTeachers.map((teacher) => (
              <Card key={teacher.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={teacher.avatar} alt={teacher.name} />
                      <AvatarFallback className="text-lg">
                        {teacher.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#0D1B2A] dark:text-white">{teacher.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{teacher.subject}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{teacher.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{teacher.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>Office Hours: {teacher.officeHours}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Next Available: {teacher.nextAvailable}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1 bg-[#3E92CC] hover:bg-[#2E82BC] text-white">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="meetings" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Meeting Schedule</h2>
              <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] text-white">
                <Plus className="mr-2 h-4 w-4" />
                Request Meeting
              </Button>
            </div>

            <div className="space-y-4">
              {mockMeetings.map((meeting) => (
                <Card key={meeting.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-[#3E92CC]/10 rounded-lg">
                          {getTypeIcon(meeting.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-[#0D1B2A] dark:text-white">
                              {meeting.title}
                            </h3>
                            <Badge className={getStatusColor(meeting.status)}>
                              {meeting.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div className="flex items-center space-x-2 text-sm">
                              <User className="h-4 w-4 text-gray-400" />
                              <span>{meeting.teacher}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <BookOpen className="h-4 w-4 text-gray-400" />
                              <span>{meeting.subject}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span>{meeting.date}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>{meeting.time} ({meeting.duration}min)</span>
                            </div>
                          </div>
                          
                          {meeting.notes && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              <strong>Notes:</strong> {meeting.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {meeting.status === 'scheduled' && (
                          <>
                            <Button size="sm" variant="outline">
                              Reschedule
                            </Button>
                            <Button size="sm" className="bg-[#3E92CC] hover:bg-[#2E82BC] text-white">
                              Join Meeting
                            </Button>
                          </>
                        )}
                        {meeting.status === 'requested' && (
                          <Button size="sm" variant="outline">
                            Pending Approval
                          </Button>
                        )}
                        {meeting.status === 'completed' && (
                          <Button size="sm" variant="outline">
                            View Summary
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                  <div className="space-y-2">
                    <Label htmlFor="child">Child</Label>
                    <Select value={selectedChild} onValueChange={setSelectedChild}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select child" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emma">Emma Johnson - 10-A</SelectItem>
                        <SelectItem value="james">James Johnson - 8-B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teacher">To (Teacher)</Label>
                    <Select value={newMessage.to} onValueChange={(value) => setNewMessage({...newMessage, to: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockTeachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name} - {teacher.subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newMessage.priority} onValueChange={(value) => setNewMessage({...newMessage, priority: value})}>
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

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject"
                      placeholder="Message subject"
                      value={newMessage.subject}
                      onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
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
                    onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <Button variant="outline">
                    <Paperclip className="mr-2 h-4 w-4" />
                    Attach File
                  </Button>
                  <Button variant="outline">
                    <Bell className="mr-2 h-4 w-4" />
                    Request Read Receipt
                  </Button>
                </div>

                <Separator />

                <div className="flex justify-end space-x-4">
                  <Button variant="outline">
                    Save Draft
                  </Button>
                  <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] text-white">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
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