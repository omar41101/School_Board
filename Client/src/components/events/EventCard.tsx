import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { 
  Calendar, 
  Clock,
  MapPin,
  Users,
  User,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Bell,
  Share
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'academic' | 'sports' | 'cultural' | 'administrative' | 'holiday' | 'exam';
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  organizer: {
    id: string;
    name: string;
    role: 'teacher' | 'admin' | 'student';
    avatar?: string;
  };
  attendees: {
    total: number;
    registered: number;
    limit?: number;
  };
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isPublic: boolean;
  requiresRegistration: boolean;
  tags: string[];
  attachments?: {
    id: string;
    name: string;
    url: string;
  }[];
}

interface EventCardProps {
  event: Event;
  onView: (event: Event) => void;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
  onRegister?: (event: Event) => void;
  onShare?: (event: Event) => void;
}

export function EventCard({ event, onView, onEdit, onDelete, onRegister, onShare }: EventCardProps) {
  const getTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'academic':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sports':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cultural':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'administrative':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'holiday':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'exam':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: Event['status']) => {
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

  const getPriorityColor = (priority: Event['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isMultiDay = event.startDate !== event.endDate;
  const isRegistrationFull = event.attendees.limit && event.attendees.registered >= event.attendees.limit;

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white dark:bg-[#1B2B3A] shadow-md hover:shadow-[#3E92CC]/20 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={`text-xs px-2 py-1 ${getTypeColor(event.type)}`}>
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </Badge>
              <Badge className={`text-xs px-2 py-1 ${getStatusColor(event.status)}`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </Badge>
              <div className={`w-2 h-2 rounded-full ${getPriorityColor(event.priority)}`}></div>
              {event.isPublic && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  Public
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-[#0D1B2A] dark:text-white mb-1 line-clamp-2">
              {event.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {event.description}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(event)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              {onShare && (
                <DropdownMenuItem onClick={() => onShare(event)}>
                  <Share className="mr-2 h-4 w-4" />
                  Share Event
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onEdit(event)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(event)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Date and Time */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="h-4 w-4 mr-2 text-[#3E92CC]" />
            <span>
              {isMultiDay 
                ? `${formatDate(event.startDate)} - ${formatDate(event.endDate)}`
                : formatDate(event.startDate)
              }
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Clock className="h-4 w-4 mr-2 text-[#3E92CC]" />
            <span>{event.startTime} - {event.endTime}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <MapPin className="h-4 w-4 mr-2 text-[#3E92CC]" />
          <span className="truncate">{event.location}</span>
        </div>

        {/* Organizer */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-[#0D1B2A]/50 rounded-lg">
          <Avatar className="h-8 w-8">
            <AvatarImage src={event.organizer.avatar} />
            <AvatarFallback className="bg-[#3E92CC] text-white text-xs">
              {event.organizer.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#0D1B2A] dark:text-white truncate">
              {event.organizer.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {event.organizer.role} • Organizer
            </p>
          </div>
        </div>

        {/* Attendance */}
        {event.requiresRegistration && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Registration:</span>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4 text-[#3E92CC]" />
                <span className="font-medium text-[#0D1B2A] dark:text-white">
                  {event.attendees.registered}
                  {event.attendees.limit && `/${event.attendees.limit}`}
                </span>
              </div>
            </div>
            {isRegistrationFull && (
              <Badge variant="outline" className="w-full justify-center text-red-600 border-red-200">
                Registration Full
              </Badge>
            )}
          </div>
        )}

        {/* Tags */}
        {event.tags.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tags:</p>
            <div className="flex flex-wrap gap-1">
              {event.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                  {tag}
                </Badge>
              ))}
              {event.tags.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-1">
                  +{event.tags.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(event)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          
          {onRegister && event.requiresRegistration && event.status === 'upcoming' && !isRegistrationFull && (
            <Button
              size="sm"
              onClick={() => onRegister(event)}
              className="bg-[#3E92CC] hover:bg-[#3E92CC]/80"
            >
              Register
            </Button>
          )}
          
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>
              {event.attendees.total > 0 && `${event.attendees.total} interested`}
            </span>
            {event.attachments && event.attachments.length > 0 && (
              <span>{event.attachments.length} attachment(s)</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}