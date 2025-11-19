import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { MessageThread, MessageThread as ThreadType } from '../communication/MessageThread';
import { 
  Plus, 
  Search,
  MessageSquare,
  Star,
  Archive,
  Send,
  Filter,
  Inbox,
  Sent
} from 'lucide-react';

export function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedThread, setSelectedThread] = useState<ThreadType | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock data for message threads
  const mockThreads: ThreadType[] = [
    {
      id: '1',
      subject: 'Mathematics Assignment Review',
      participants: [
        {
          id: '1',
          name: 'Dr. Sarah Johnson',
          role: 'teacher',
          avatar: undefined
        },
        {
          id: '2',
          name: 'Alice Johnson',
          role: 'student'
        }
      ],
      messages: [
        {
          id: '1',
          sender: {
            id: '1',
            name: 'Dr. Sarah Johnson',
            role: 'teacher'
          },
          content: 'Hi Alice, I wanted to discuss your recent mathematics assignment. You showed excellent understanding of calculus concepts.',
          timestamp: '2024-10-05T10:30:00Z',
          read: true
        },
        {
          id: '2',
          sender: {
            id: '2',
            name: 'Alice Johnson',
            role: 'student'
          },
          content: 'Thank you Dr. Johnson! I really enjoyed working on the derivative problems. Could you provide some additional practice exercises?',
          timestamp: '2024-10-05T11:15:00Z',
          read: true
        },
        {
          id: '3',
          sender: {
            id: '1',
            name: 'Dr. Sarah Johnson',
            role: 'teacher'
          },
          content: 'Absolutely! I\'ll prepare some advanced problems for you. Also, would you be interested in joining our mathematics competition team?',
          timestamp: '2024-10-05T14:20:00Z',
          read: false
        }
      ],
      lastMessage: {
        id: '3',
        sender: {
          id: '1',
          name: 'Dr. Sarah Johnson',
          role: 'teacher'
        },
        content: 'Absolutely! I\'ll prepare some advanced problems for you. Also, would you be interested in joining our mathematics competition team?',
        timestamp: '2024-10-05T14:20:00Z',
        read: false
      },
      unreadCount: 1,
      isStarred: true,
      isArchived: false,
      category: 'academic',
      priority: 'medium',
      createdAt: '2024-10-05T10:30:00Z',
      updatedAt: '2024-10-05T14:20:00Z'
    },
    {
      id: '2',
      subject: 'Parent-Teacher Conference Request',
      participants: [
        {
          id: '3',
          name: 'Michael Smith',
          role: 'parent'
        },
        {
          id: '4',
          name: 'Prof. Michael Chen',
          role: 'teacher'
        }
      ],
      messages: [
        {
          id: '4',
          sender: {
            id: '3',
            name: 'Michael Smith',
            role: 'parent'
          },
          content: 'Hello Prof. Chen, I would like to schedule a meeting to discuss Bob\'s progress in computer science.',
          timestamp: '2024-10-04T09:00:00Z',
          read: true
        },
        {
          id: '5',
          sender: {
            id: '4',
            name: 'Prof. Michael Chen',
            role: 'teacher'
          },
          content: 'Hello Mr. Smith, I\'d be happy to meet with you. Bob is doing very well in programming. How about next Tuesday at 3 PM?',
          timestamp: '2024-10-04T16:30:00Z',
          read: true
        }
      ],
      lastMessage: {
        id: '5',
        sender: {
          id: '4',
          name: 'Prof. Michael Chen',
          role: 'teacher'
        },
        content: 'Hello Mr. Smith, I\'d be happy to meet with you. Bob is doing very well in programming. How about next Tuesday at 3 PM?',
        timestamp: '2024-10-04T16:30:00Z',
        read: true
      },
      unreadCount: 0,
      isStarred: false,
      isArchived: false,
      category: 'general',
      priority: 'high',
      createdAt: '2024-10-04T09:00:00Z',
      updatedAt: '2024-10-04T16:30:00Z'
    },
    {
      id: '3',
      subject: 'Behavioral Report - David Wilson',
      participants: [
        {
          id: '5',
          name: 'Ms. Emily Rodriguez',
          role: 'teacher'
        },
        {
          id: '6',
          name: 'Lisa Wilson',
          role: 'parent'
        }
      ],
      messages: [
        {
          id: '6',
          sender: {
            id: '5',
            name: 'Ms. Emily Rodriguez',
            role: 'teacher'
          },
          content: 'Dear Mrs. Wilson, I wanted to inform you about David\'s excellent participation in our literature discussions this week.',
          timestamp: '2024-10-03T15:45:00Z',
          read: true
        }
      ],
      lastMessage: {
        id: '6',
        sender: {
          id: '5',
          name: 'Ms. Emily Rodriguez',
          role: 'teacher'
        },
        content: 'Dear Mrs. Wilson, I wanted to inform you about David\'s excellent participation in our literature discussions this week.',
        timestamp: '2024-10-03T15:45:00Z',
        read: true
      },
      unreadCount: 0,
      isStarred: false,
      isArchived: false,
      category: 'behavioral',
      priority: 'low',
      createdAt: '2024-10-03T15:45:00Z',
      updatedAt: '2024-10-03T15:45:00Z'
    }
  ];

  const filteredThreads = mockThreads.filter(thread => {
    const matchesSearch = thread.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         thread.participants.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesTab = true;
    switch (activeTab) {
      case 'starred':
        matchesTab = thread.isStarred;
        break;
      case 'archived':
        matchesTab = thread.isArchived;
        break;
      case 'unread':
        matchesTab = thread.unreadCount > 0;
        break;
      default:
        matchesTab = !thread.isArchived;
    }
    
    return matchesSearch && matchesTab;
  });

  const getThreadStats = () => {
    return {
      total: mockThreads.filter(t => !t.isArchived).length,
      unread: mockThreads.filter(t => t.unreadCount > 0).length,
      starred: mockThreads.filter(t => t.isStarred).length,
      archived: mockThreads.filter(t => t.isArchived).length
    };
  };

  const stats = getThreadStats();

  const handleSendMessage = (content: string, attachments?: File[]) => {
    console.log('Send message:', content, attachments);
    // Implementation for sending message
  };

  const handleToggleStar = (threadId: string) => {
    console.log('Toggle star for thread:', threadId);
    // Implementation for toggling star
  };

  const handleArchive = (threadId: string) => {
    console.log('Archive thread:', threadId);
    // Implementation for archiving thread
  };

  const handleDelete = (threadId: string) => {
    console.log('Delete thread:', threadId);
    // Implementation for deleting thread
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-US', { 
        weekday: 'short'
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-500';
      case 'high':
        return 'text-orange-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-gray-50 dark:bg-[#0D1B2A] rounded-lg overflow-hidden">
      {/* Sidebar */}
      <div className={`bg-white dark:bg-[#1B2B3A] border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-80'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          {!sidebarCollapsed && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-[#0D1B2A] dark:text-white">Messages</h1>
                <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] dark:bg-[#3E92CC] dark:hover:bg-[#3E92CC]/80">
                  <Plus className="mr-2 h-4 w-4" />
                  New
                </Button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        {!sidebarCollapsed && (
          <div className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="inbox" className="text-xs">
                  <Inbox className="mr-1 h-3 w-3" />
                  Inbox ({stats.total})
                </TabsTrigger>
                <TabsTrigger value="starred" className="text-xs">
                  <Star className="mr-1 h-3 w-3" />
                  Starred ({stats.starred})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}

        {/* Messages List */}
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {filteredThreads.map((thread) => (
              <div
                key={thread.id}
                onClick={() => setSelectedThread(thread)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedThread?.id === thread.id
                    ? 'bg-[#3E92CC]/10 border border-[#3E92CC]/20'
                    : 'hover:bg-gray-50 dark:hover:bg-[#0D1B2A]/50'
                } ${thread.unreadCount > 0 ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
              >
                {!sidebarCollapsed && (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <div className="flex -space-x-1">
                          {thread.participants.slice(0, 2).map((participant, index) => (
                            <Avatar key={participant.id} className="h-8 w-8 border-2 border-white">
                              <AvatarImage src={participant.avatar} />
                              <AvatarFallback className="bg-[#3E92CC] text-white text-xs">
                                {participant.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-[#0D1B2A] dark:text-white truncate">
                            {thread.participants.map(p => p.name).join(', ')}
                          </p>
                          <div className="flex items-center space-x-1">
                            <Badge variant="outline" className="text-xs">
                              {thread.category}
                            </Badge>
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(thread.priority)}`}></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(thread.updatedAt)}
                        </span>
                        {thread.isStarred && (
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        )}
                        {thread.unreadCount > 0 && (
                          <Badge className="bg-[#3E92CC] text-white text-xs px-1 min-w-[16px] h-4">
                            {thread.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="font-medium text-sm text-[#0D1B2A] dark:text-white mb-1 truncate">
                      {thread.subject}
                    </h3>
                    
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                      {thread.lastMessage.content}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedThread ? (
          <MessageThread
            thread={selectedThread}
            currentUserId="current-user-id"
            onSendMessage={handleSendMessage}
            onToggleStar={handleToggleStar}
            onArchive={handleArchive}
            onDelete={handleDelete}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#1B2B3A]">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#0D1B2A] dark:text-white mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Choose a message thread to start reading and replying.
              </p>
              <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] dark:bg-[#3E92CC] dark:hover:bg-[#3E92CC]/80">
                <Plus className="mr-2 h-4 w-4" />
                Start New Conversation
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}