import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Send, 
  Paperclip, 
  MoreVertical,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  Phone,
  Video,
  Search
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    role: 'student' | 'teacher' | 'parent' | 'admin';
    avatar?: string;
  };
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: {
    id: string;
    name: string;
    type: string;
    size: string;
    url: string;
  }[];
  replyTo?: string;
}

export interface MessageThread {
  id: string;
  subject: string;
  participants: {
    id: string;
    name: string;
    role: 'student' | 'teacher' | 'parent' | 'admin';
    avatar?: string;
  }[];
  messages: Message[];
  lastMessage: Message;
  unreadCount: number;
  isStarred: boolean;
  isArchived: boolean;
  category: 'academic' | 'behavioral' | 'administrative' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
}

interface MessageThreadProps {
  thread: MessageThread;
  currentUserId: string;
  onSendMessage: (content: string, attachments?: File[]) => void;
  onToggleStar: (threadId: string) => void;
  onArchive: (threadId: string) => void;
  onDelete: (threadId: string) => void;
  onCall?: (participantId: string) => void;
  onVideoCall?: (participantId: string) => void;
}

export function MessageThread({ 
  thread, 
  currentUserId, 
  onSendMessage, 
  onToggleStar, 
  onArchive, 
  onDelete,
  onCall,
  onVideoCall 
}: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isComposing, setIsComposing] = useState(false);

  const handleSendMessage = () => {
    if (newMessage.trim() || attachments.length > 0) {
      onSendMessage(newMessage, attachments);
      setNewMessage('');
      setAttachments([]);
      setIsComposing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getPriorityColor = (priority: MessageThread['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: MessageThread['category']) => {
    switch (category) {
      case 'academic':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'behavioral':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'administrative':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'general':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
        weekday: 'short', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  return (
    <Card className="h-full flex flex-col bg-white dark:bg-[#1B2B3A]">
      {/* Header */}
      <CardHeader className="border-b border-gray-100 dark:border-gray-700 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-[#0D1B2A] dark:text-white mb-2 truncate">
              {thread.subject}
            </CardTitle>
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={`text-xs px-2 py-1 ${getPriorityColor(thread.priority)}`}>
                {thread.priority.toUpperCase()}
              </Badge>
              <Badge variant="outline" className={`text-xs px-2 py-1 ${getCategoryColor(thread.category)}`}>
                {thread.category}
              </Badge>
              {thread.unreadCount > 0 && (
                <Badge className="bg-[#3E92CC] text-white text-xs px-2 py-1">
                  {thread.unreadCount} unread
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {thread.participants.map((participant, index) => (
                <div key={participant.id} className="flex items-center space-x-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={participant.avatar} />
                    <AvatarFallback className="bg-[#3E92CC] text-white text-xs">
                      {participant.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {participant.name}
                  </span>
                  {index < thread.participants.length - 1 && (
                    <span className="text-gray-400">,</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {onCall && (
              <Button variant="outline" size="sm" onClick={() => onCall(thread.participants[0].id)}>
                <Phone className="h-4 w-4" />
              </Button>
            )}
            {onVideoCall && (
              <Button variant="outline" size="sm" onClick={() => onVideoCall(thread.participants[0].id)}>
                <Video className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleStar(thread.id)}
              className={thread.isStarred ? 'text-yellow-500' : ''}
            >
              <Star className={`h-4 w-4 ${thread.isStarred ? 'fill-current' : ''}`} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onArchive(thread.id)}>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(thread.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {thread.messages.map((message) => {
              const isOwnMessage = message.sender.id === currentUserId;
              
              return (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.sender.avatar} />
                    <AvatarFallback className="bg-[#3E92CC] text-white text-xs">
                      {message.sender.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`flex-1 max-w-md ${isOwnMessage ? 'text-right' : ''}`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-[#0D1B2A] dark:text-white">
                        {message.sender.name}
                      </span>
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        {message.sender.role}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    
                    <div
                      className={`p-3 rounded-lg ${
                        isOwnMessage
                          ? 'bg-[#3E92CC] text-white'
                          : 'bg-gray-100 dark:bg-[#0D1B2A]/50 text-[#0D1B2A] dark:text-white'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.attachments.map((attachment) => (
                            <div
                              key={attachment.id}
                              className="flex items-center space-x-2 text-xs bg-white/10 rounded p-2"
                            >
                              <Paperclip className="h-3 w-3" />
                              <span className="flex-1 truncate">{attachment.name}</span>
                              <span>({attachment.size})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {!message.read && !isOwnMessage && (
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-[#3E92CC] rounded-full"></div>
                        <span className="text-xs text-[#3E92CC] ml-1">Unread</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Message Input */}
      <div className="border-t border-gray-100 dark:border-gray-700 p-4">
        <div className="space-y-3">
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center space-x-2 bg-gray-100 dark:bg-[#0D1B2A] rounded-lg px-3 py-2">
                  <Paperclip className="h-4 w-4 text-[#3E92CC]" />
                  <span className="text-sm text-[#0D1B2A] dark:text-white truncate">
                    {file.name}
                  </span>
                  <button
                    onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                    className="text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsComposing(true)}
                className="min-h-[80px] resize-none"
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <input
                type="file"
                id="attachment"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    setAttachments([...attachments, ...Array.from(e.target.files)]);
                  }
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('attachment')?.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() && attachments.length === 0}
                className="bg-[#3E92CC] hover:bg-[#3E92CC]/80"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}